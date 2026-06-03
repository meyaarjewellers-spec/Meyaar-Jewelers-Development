/**
 * Admin API (all routes require an ADMIN_EMAILS user). Uses the server DB
 * connection (service role), so it operates above RLS.
 *   GET   /api/v1/admin/me
 *   GET   /api/v1/admin/stats
 *   GET   /api/v1/admin/orders         PATCH /api/v1/admin/orders/:id
 *   GET   /api/v1/admin/products       PATCH /api/v1/admin/products/:id
 *   GET   /api/v1/admin/reviews        PATCH /api/v1/admin/reviews/:id
 *   GET   /api/v1/admin/subscribers
 */
import { Router } from "express";
import { z } from "zod";
import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import { orders, orderItems, products, productInventory, reviews, newsletterSubscribers } from "../../shared/schema";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";

export const adminRouter = Router();

// Gate the whole router.
adminRouter.use("/admin", requireAdmin);

adminRouter.get("/admin/me", (_req, res) => res.json({ data: { isAdmin: true } }));

adminRouter.get("/admin/stats", async (_req, res, next) => {
  try {
    const db = getDb();
    const [[orderAgg], [productCount], [subCount], [pendingReviews]] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int`, revenue: sql<number>`coalesce(sum(case when ${orders.status} <> 'pending' then ${orders.total} else 0 end),0)` }).from(orders),
      db.select({ count: sql<number>`count(*)::int` }).from(products),
      db.select({ count: sql<number>`count(*)::int` }).from(newsletterSubscribers),
      db.select({ count: sql<number>`count(*)::int` }).from(reviews).where(eq(reviews.status, "pending")),
    ]);
    res.json({
      data: {
        orders: orderAgg?.count ?? 0,
        revenue: Number(orderAgg?.revenue ?? 0),
        products: productCount?.count ?? 0,
        subscribers: subCount?.count ?? 0,
        pendingReviews: pendingReviews?.count ?? 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/admin/orders", async (_req, res, next) => {
  try {
    const db = getDb();
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
    const withItems = await Promise.all(
      rows.map(async (o) => {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
        return { ...o, total: Number(o.total), items: items.map((i) => ({ name: i.productName, quantity: i.quantity, unitPrice: Number(i.unitPrice) })) };
      }),
    );
    res.json({ data: { orders: withItems } });
  } catch (err) {
    next(err);
  }
});

const statusSchema = z.object({
  status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]),
});
adminRouter.patch("/admin/orders/:id", validateBody(statusSchema), async (req, res, next) => {
  try {
    const id = z.string().uuid().safeParse(req.params.id);
    if (!id.success) return res.status(400).json({ error: { message: "Invalid id" } });
    const db = getDb();
    await db.update(orders).set({ status: req.body.status, updatedAt: new Date() }).where(eq(orders.id, id.data));
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/admin/products", async (_req, res, next) => {
  try {
    const db = getDb();
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        basePrice: products.basePrice,
        discountPrice: products.discountPrice,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        stock: productInventory.quantityAvailable,
      })
      .from(products)
      .leftJoin(productInventory, eq(productInventory.productId, products.id))
      .orderBy(desc(products.createdAt))
      .limit(500);
    res.json({
      data: {
        products: rows.map((p) => ({
          ...p,
          basePrice: Number(p.basePrice),
          discountPrice: p.discountPrice != null ? Number(p.discountPrice) : null,
          stock: p.stock ?? null,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

const productPatch = z.object({
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  basePrice: z.number().nonnegative().optional(),
  discountPrice: z.number().nonnegative().nullable().optional(),
});
adminRouter.patch("/admin/products/:id", validateBody(productPatch), async (req, res, next) => {
  try {
    const id = z.string().uuid().safeParse(req.params.id);
    if (!id.success) return res.status(400).json({ error: { message: "Invalid id" } });
    const body = req.body as z.infer<typeof productPatch>;
    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (body.isActive !== undefined) update.isActive = body.isActive;
    if (body.isFeatured !== undefined) update.isFeatured = body.isFeatured;
    if (body.basePrice !== undefined) update.basePrice = body.basePrice.toFixed(2);
    if (body.discountPrice !== undefined) update.discountPrice = body.discountPrice === null ? null : body.discountPrice.toFixed(2);
    const db = getDb();
    await db.update(products).set(update).where(eq(products.id, id.data));
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/admin/reviews", async (_req, res, next) => {
  try {
    const db = getDb();
    const rows = await db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(300);
    res.json({ data: { reviews: rows } });
  } catch (err) {
    next(err);
  }
});

const reviewPatch = z.object({ status: z.enum(["pending", "approved", "rejected"]) });
adminRouter.patch("/admin/reviews/:id", validateBody(reviewPatch), async (req, res, next) => {
  try {
    const id = z.string().uuid().safeParse(req.params.id);
    if (!id.success) return res.status(400).json({ error: { message: "Invalid id" } });
    const db = getDb();
    await db.update(reviews).set({ status: req.body.status }).where(eq(reviews.id, id.data));
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/admin/subscribers", async (_req, res, next) => {
  try {
    const db = getDb();
    const rows = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt)).limit(1000);
    res.json({ data: { subscribers: rows } });
  } catch (err) {
    next(err);
  }
});
