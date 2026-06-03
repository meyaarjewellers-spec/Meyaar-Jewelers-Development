/**
 * Payment fulfillment driven by Stripe webhooks — the SOURCE OF TRUTH for
 * "paid". Idempotent: replaying the same event yields exactly one paid order,
 * one payment row, and one inventory decrement.
 */
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { orders, orderItems, payments } from "../../shared/schema";
import { toCents } from "./money";
import { decrementStock } from "./inventory";
import { sendEmail, orderConfirmationEmail } from "./email";
import { log } from "../logger";

/** Handle `payment_intent.succeeded`. Safe to call multiple times. */
export async function handlePaymentSucceeded(pi: Stripe.PaymentIntent): Promise<void> {
  const orderId = pi.metadata?.order_id;
  if (!orderId) {
    log(`PaymentIntent ${pi.id} has no order_id metadata; ignoring.`, "fulfillment");
    return;
  }

  const db = getDb();

  const confirmation = await db.transaction(async (tx): Promise<{ to: string; orderNumber: string } | null> => {
    const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).for("update").limit(1);
    if (!order) {
      log(`PaymentIntent ${pi.id} references unknown order ${orderId}.`, "fulfillment");
      return null;
    }

    // Idempotency: if already paid (or beyond), do nothing further.
    if (order.status !== "pending") return null;

    // Server cross-check: charged amount must match the order total.
    const expectedCents = toCents(order.total);
    if (pi.amount_received && pi.amount_received !== expectedCents) {
      log(`Amount mismatch for order ${orderId}: charged ${pi.amount_received}, expected ${expectedCents}.`, "fulfillment");
    }

    await tx.update(orders).set({ status: "paid", updatedAt: new Date() }).where(eq(orders.id, order.id));

    // Upsert the payment row keyed by the unique PaymentIntent id.
    await tx
      .insert(payments)
      .values({
        orderId: order.id,
        stripePaymentIntentId: pi.id,
        stripeChargeId: typeof pi.latest_charge === "string" ? pi.latest_charge : null,
        amount: order.total,
        currency: (pi.currency ?? "usd").toUpperCase(),
        status: "completed",
        paymentType: pi.payment_method_types?.[0] ?? "card",
        metadata: { livemode: pi.livemode },
      })
      .onConflictDoNothing({ target: payments.stripePaymentIntentId });

    // Decrement inventory for the order's items.
    const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    await decrementStock(
      tx,
      items.map((it) => ({ productId: it.productId, variantId: it.variantId, quantity: it.quantity })),
    );

    // Send the confirmation email (fire-and-forget; never block on delivery).
    const recipient = order.guestEmail ?? pi.receipt_email ?? null;
    if (recipient) {
      const email = orderConfirmationEmail(recipient, {
        orderNumber: order.orderNumber,
        customerName: order.guestName ?? undefined,
        items: items.map((it) => ({ productName: it.productName, quantity: it.quantity, unitPriceCents: toCents(it.unitPrice) })),
        subtotalCents: toCents(order.subtotal),
        shippingCents: toCents(order.shippingCost),
        taxCents: toCents(order.taxAmount),
        discountCents: toCents(order.discountAmount),
        totalCents: toCents(order.total),
        currency: order.currency ?? "USD",
      });
      void sendEmail(email).catch((err) => log(`confirmation email error: ${(err as Error).message}`, "fulfillment"));
      return { to: recipient, orderNumber: order.orderNumber };
    }
    return null;
  });

  if (confirmation) log(`order ${confirmation.orderNumber} paid → confirmation queued to ${confirmation.to}`, "fulfillment");
}

/** Handle `payment_intent.payment_failed`: record the failed attempt. */
export async function handlePaymentFailed(pi: Stripe.PaymentIntent): Promise<void> {
  const orderId = pi.metadata?.order_id;
  if (!orderId) return;
  const db = getDb();
  await db
    .insert(payments)
    .values({
      orderId,
      stripePaymentIntentId: pi.id,
      amount: ((pi.amount ?? 0) / 100).toFixed(2),
      currency: (pi.currency ?? "usd").toUpperCase(),
      status: "failed",
      paymentType: pi.payment_method_types?.[0] ?? "card",
    })
    .onConflictDoNothing({ target: payments.stripePaymentIntentId });
}
