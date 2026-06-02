/**
 * POST /api/v1/payments/intent — create a Stripe PaymentIntent for an existing
 * order. The amount is read from the ORDER in the database, never the client.
 */
import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import { optionalAuth } from "../middleware/auth";
import { strictLimiter } from "../middleware/security";
import { getOrderById } from "../services/orders";
import { createPaymentIntent, stripeAvailable } from "../services/stripe";
import { toCents } from "../services/money";

export const paymentsRouter = Router();

const intentSchema = z.object({ orderId: z.string().uuid() });

paymentsRouter.post("/payments/intent", strictLimiter, optionalAuth, validateBody(intentSchema), async (req, res, next) => {
  try {
    if (!stripeAvailable()) {
      return res.status(503).json({ error: { message: "Payments are not configured" } });
    }

    const { orderId } = req.body as z.infer<typeof intentSchema>;
    const order = await getOrderById(orderId);
    if (!order) return res.status(404).json({ error: { message: "Order not found" } });

    // Ownership: a signed-in user may only pay for their own order.
    if (order.userId && req.userId && order.userId !== req.userId) {
      return res.status(403).json({ error: { message: "Forbidden" } });
    }
    if (order.status !== "pending") {
      return res.status(409).json({ error: { message: `Order is already ${order.status}` } });
    }

    const amountCents = toCents(order.total); // authoritative amount from the DB
    const intent = await createPaymentIntent({
      amountCents,
      currency: (order.currency ?? "USD").toLowerCase(),
      orderId: order.id,
      orderNumber: order.orderNumber,
      // Idempotent per order: repeated calls reuse the same intent.
      idempotencyKey: `pi_${order.id}`,
      receiptEmail: order.guestEmail ?? undefined,
    });

    res.json({ data: { clientSecret: intent.client_secret, paymentIntentId: intent.id } });
  } catch (err) {
    next(err);
  }
});
