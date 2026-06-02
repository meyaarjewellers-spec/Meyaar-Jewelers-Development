/**
 * Server-authoritative pricing. The browser sends only product IDs, variant IDs
 * and quantities; EVERY price, discount, tax and total is computed here from the
 * database. The client cannot influence what is charged.
 */
import { inArray } from "drizzle-orm";
import { getDb } from "../db";
import { products, productVariants, type CartLineItem } from "../../shared/schema";
import { env } from "../config/env";
import { toCents, centsToMajor } from "./money";
import { applyCoupon } from "./coupons";
import { calculateTaxCents } from "./stripe";

export interface ResolvedLineItem {
  productId: string;
  variantId?: string;
  productName: string;
  productSku: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface PriceBreakdown {
  lineItems: ResolvedLineItem[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
  couponApplied: boolean;
  couponReason?: string;
}

export interface ShippingAddress {
  postalCode?: string;
  country?: string;
}

export class PricingError extends Error {
  status = 400;
}

/** Resolve cart items against the DB and compute the authoritative breakdown. */
export async function computeBreakdown(
  items: CartLineItem[],
  couponCode?: string,
  address?: ShippingAddress,
): Promise<PriceBreakdown> {
  if (!items || items.length === 0) throw new PricingError("Cart is empty");

  const db = getDb();
  const currency = (env.DEFAULT_CURRENCY || "usd").toLowerCase();

  const productIds = [...new Set(items.map((i) => i.productId))];
  const variantIds = [...new Set(items.map((i) => i.variantId).filter(Boolean))] as string[];

  const productRows = await db.select().from(products).where(inArray(products.id, productIds));
  const productMap = new Map(productRows.map((p) => [p.id, p]));

  const variantMap = new Map<string, typeof productVariants.$inferSelect>();
  if (variantIds.length > 0) {
    const variantRows = await db.select().from(productVariants).where(inArray(productVariants.id, variantIds));
    for (const v of variantRows) variantMap.set(v.id, v);
  }

  const lineItems: ResolvedLineItem[] = [];
  let subtotalCents = 0;

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product || product.isActive === false || product.deletedAt) {
      throw new PricingError(`Product unavailable: ${item.productId}`);
    }

    // Price precedence: variant override → product discount price → base price.
    let unitPriceCents = toCents(product.discountPrice ?? product.basePrice);
    if (item.variantId) {
      const variant = variantMap.get(item.variantId);
      if (!variant || variant.productId !== product.id) {
        throw new PricingError(`Invalid variant for product ${product.id}`);
      }
      if (variant.priceOverride != null) unitPriceCents = toCents(variant.priceOverride);
    }

    const lineTotalCents = unitPriceCents * item.quantity;
    subtotalCents += lineTotalCents;

    lineItems.push({
      productId: product.id,
      variantId: item.variantId,
      productName: product.name,
      productSku: product.sku,
      unitPriceCents,
      quantity: item.quantity,
      lineTotalCents,
    });
  }

  // Discount (validated coupon only).
  const { discountCents, coupon, reason } = await applyCoupon(couponCode, subtotalCents);

  // Shipping: free at/above the configured threshold, else flat rate.
  const afterDiscount = subtotalCents - discountCents;
  const shippingCents =
    subtotalCents <= 0 || afterDiscount >= env.SHIPPING_FREE_THRESHOLD_CENTS
      ? 0
      : env.SHIPPING_FLAT_RATE_CENTS;

  // Tax via Stripe Tax on (subtotal - discount + shipping).
  const taxableCents = afterDiscount + shippingCents;
  const taxCents = await calculateTaxCents({
    taxableCents,
    currency,
    postalCode: address?.postalCode,
    country: address?.country,
  });

  const totalCents = afterDiscount + shippingCents + taxCents;

  return {
    lineItems,
    subtotalCents,
    discountCents,
    shippingCents,
    taxCents,
    totalCents,
    currency,
    couponApplied: Boolean(coupon),
    couponReason: reason,
  };
}

/** Shape a breakdown for a JSON response (major units). */
export function breakdownToResponse(b: PriceBreakdown) {
  return {
    currency: b.currency,
    subtotal: centsToMajor(b.subtotalCents),
    discount: centsToMajor(b.discountCents),
    shipping: centsToMajor(b.shippingCents),
    tax: centsToMajor(b.taxCents),
    total: centsToMajor(b.totalCents),
    couponApplied: b.couponApplied,
    couponReason: b.couponReason,
    items: b.lineItems.map((li) => ({
      productId: li.productId,
      variantId: li.variantId,
      name: li.productName,
      sku: li.productSku,
      unitPrice: centsToMajor(li.unitPriceCents),
      quantity: li.quantity,
      lineTotal: centsToMajor(li.lineTotalCents),
    })),
  };
}
