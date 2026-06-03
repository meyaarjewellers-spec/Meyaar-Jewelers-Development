/** POST /api/v1/orders — create a pending order from server-computed totals. */
import { Router } from "express";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { cartLineItemSchema, orders, orderItems } from "../../shared/schema";
import { getDb } from "../db";
import { validateBody } from "../middleware/validate";
import { optionalAuth, requireAuth } from "../middleware/auth";
import { computeBreakdown, breakdownToResponse, PricingError } from "../services/pricing";
import { createPendingOrder } from "../services/orders";
import { InventoryError } from "../services/inventory";

export const ordersRouter = Router();

/** GET /api/v1/orders/mine — the authenticated user's order history. */
ordersRouter.get("/orders/mine", requireAuth, async (req, res, next) => {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, req.userId!))
      .orderBy(desc(orders.createdAt))
      .limit(50);

    const withItems = await Promise.all(
      rows.map(async (o) => {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
        return {
          orderNumber: o.orderNumber,
          status: o.status,
          total: Number(o.total),
          currency: o.currency,
          createdAt: o.createdAt,
          items: items.map((it) => ({ name: it.productName, quantity: it.quantity, unitPrice: Number(it.unitPrice) })),
        };
      }),
    );

    res.json({ data: { orders: withItems } });
  } catch (err) {
    next(err);
  }
});

const createOrderSchema = z.object({
  items: z.array(cartLineItemSchema).min(1).max(50),
  couponCode: z.string().max(100).optional(),
  guest: z
    .object({
      name: z.string().min(1).max(255).optional(),
      email: z.string().email().max(255).optional(),
      phone: z.string().max(20).optional(),
    })
    .optional(),
  shippingAddress: z
    .object({
      fullName: z.string().max(255).optional(),
      line1: z.string().max(255).optional(),
      line2: z.string().max(255).optional(),
      city: z.string().max(100).optional(),
      state: z.string().max(100).optional(),
      postalCode: z.string().max(20).optional(),
      country: z.string().max(2).optional(),
    })
    .optional(),
});

ordersRouter.post("/orders", optionalAuth, validateBody(createOrderSchema), async (req, res, next) => {
  try {
    const body = req.body as z.infer<typeof createOrderSchema>;

    // Guests must provide an email so we can send confirmation / receipts.
    if (!req.userId && !body.guest?.email) {
      return res.status(400).json({ error: { message: "Email is required for guest checkout" } });
    }

    const breakdown = await computeBreakdown(body.items, body.couponCode, {
      postalCode: body.shippingAddress?.postalCode,
      country: body.shippingAddress?.country,
    });

    const order = await createPendingOrder({
      breakdown,
      userId: req.userId ?? null,
      guest: body.guest,
      shippingAddress: body.shippingAddress,
      couponCode: body.couponCode,
    });

    res.status(201).json({
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        ...breakdownToResponse(breakdown),
      },
    });
  } catch (err) {
    if (err instanceof PricingError || err instanceof InventoryError) {
      return res.status((err as any).status).json({ error: { message: err.message } });
    }
    next(err);
  }
});
