/**
 * Order creation. Persists a pending order + its line items and reserves
 * inventory atomically. The order stores the SERVER-computed totals; these are
 * the only figures ever charged.
 */
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { orders, orderItems, type Order } from "../../shared/schema";
import { centsToDecimalString } from "./money";
import type { PriceBreakdown } from "./pricing";
import { reserveStock } from "./inventory";

export interface CreateOrderInput {
  breakdown: PriceBreakdown;
  userId?: string | null;
  guest?: { name?: string; email?: string; phone?: string };
  shippingAddress?: unknown;
  couponCode?: string;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = randomUUID().slice(0, 8).toUpperCase();
  return `MJ-${ymd}-${rand}`;
}

/** Create a pending order with items + inventory reservation in one transaction. */
export async function createPendingOrder(input: CreateOrderInput): Promise<Order> {
  const db = getDb();
  const b = input.breakdown;

  return db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orders)
      .values({
        userId: input.userId ?? null,
        orderNumber: generateOrderNumber(),
        guestEmail: input.guest?.email,
        guestName: input.guest?.name,
        guestPhone: input.guest?.phone,
        shippingAddress: input.shippingAddress ?? null,
        subtotal: centsToDecimalString(b.subtotalCents),
        taxAmount: centsToDecimalString(b.taxCents),
        shippingCost: centsToDecimalString(b.shippingCents),
        discountAmount: centsToDecimalString(b.discountCents),
        total: centsToDecimalString(b.totalCents),
        status: "pending",
        currency: b.currency.toUpperCase(),
        couponCode: b.couponApplied ? input.couponCode : null,
      })
      .returning();

    await tx.insert(orderItems).values(
      b.lineItems.map((li) => ({
        orderId: order.id,
        productId: li.productId,
        variantId: li.variantId ?? null,
        productName: li.productName,
        productSku: li.productSku,
        unitPrice: centsToDecimalString(li.unitPriceCents),
        quantity: li.quantity,
      })),
    );

    await reserveStock(tx, b.lineItems);
    return order;
  });
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return order;
}
