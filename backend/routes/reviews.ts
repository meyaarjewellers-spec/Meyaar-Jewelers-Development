/**
 * Product reviews.
 *   GET  /api/v1/products/:id/reviews — approved reviews
 *   POST /api/v1/products/:id/reviews — submit a review (verified-purchase aware)
 */
import { Router } from "express";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../db";
import { reviews, orders, orderItems } from "../../shared/schema";
import { validateBody } from "../middleware/validate";
import { optionalAuth } from "../middleware/auth";
import { strictLimiter } from "../middleware/security";

export const reviewsRouter = Router();

reviewsRouter.get("/products/:id/reviews", async (req, res, next) => {
  try {
    const productId = z.string().uuid().safeParse(req.params.id);
    if (!productId.success) return res.status(400).json({ error: { message: "Invalid product id" } });

    const db = getDb();
    const rows = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.productId, productId.data), eq(reviews.status, "approved")))
      .orderBy(desc(reviews.createdAt));

    const count = rows.length;
    const average = count > 0 ? rows.reduce((s, r) => s + r.rating, 0) / count : 0;

    res.json({
      data: {
        average: Math.round(average * 10) / 10,
        count,
        reviews: rows.map((r) => ({
          id: r.id,
          author: r.authorName,
          rating: r.rating,
          title: r.title,
          content: r.content,
          isVerifiedPurchase: r.isVerifiedPurchase,
          date: r.createdAt,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

const createSchema = z.object({
  authorName: z.string().min(1).max(120),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(4000),
});

reviewsRouter.post("/products/:id/reviews", strictLimiter, optionalAuth, validateBody(createSchema), async (req, res, next) => {
  try {
    const productId = z.string().uuid().safeParse(req.params.id);
    if (!productId.success) return res.status(400).json({ error: { message: "Invalid product id" } });

    const body = req.body as z.infer<typeof createSchema>;
    const db = getDb();

    // Verified purchase: an authenticated user with a paid order containing this product.
    let isVerifiedPurchase = false;
    if (req.userId) {
      const purchased = await db
        .select({ id: orderItems.id })
        .from(orderItems)
        .innerJoin(orders, eq(orders.id, orderItems.orderId))
        .where(
          and(
            eq(orderItems.productId, productId.data),
            eq(orders.userId, req.userId),
            eq(orders.status, "paid"),
          ),
        )
        .limit(1);
      isVerifiedPurchase = purchased.length > 0;
    }

    const [review] = await db
      .insert(reviews)
      .values({
        productId: productId.data,
        userId: req.userId ?? null,
        authorName: body.authorName,
        rating: body.rating,
        title: body.title,
        content: body.content,
        status: "approved",
        isVerifiedPurchase,
      })
      .returning();

    res.status(201).json({
      data: {
        id: review.id,
        author: review.authorName,
        rating: review.rating,
        title: review.title,
        content: review.content,
        isVerifiedPurchase: review.isVerifiedPurchase,
        date: review.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});
