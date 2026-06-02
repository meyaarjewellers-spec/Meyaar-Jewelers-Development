/**
 * Coupon validation. A discount is ONLY ever applied when a matching, active,
 * in-date coupon row exists — there is no "any code = 10% off" behaviour.
 */
import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { couponCodes, type CouponCode } from "../../shared/schema";
import { toCents } from "./money";

export interface CouponResult {
  discountCents: number;
  coupon: CouponCode | null;
  reason?: string;
}

/**
 * Validate `code` against the subtotal and return the discount in cents.
 * Returns `{ discountCents: 0 }` (with a reason) for any invalid/expired code.
 */
export async function applyCoupon(code: string | undefined, subtotalCents: number): Promise<CouponResult> {
  if (!code || code.trim() === "") return { discountCents: 0, coupon: null };

  const db = getDb();
  const [coupon] = await db
    .select()
    .from(couponCodes)
    .where(and(eq(couponCodes.code, code.trim()), eq(couponCodes.isActive, true)))
    .limit(1);

  if (!coupon) return { discountCents: 0, coupon: null, reason: "Coupon not found" };

  const now = new Date();
  if (coupon.validFrom && now < coupon.validFrom) return { discountCents: 0, coupon: null, reason: "Coupon not yet valid" };
  if (coupon.validUntil && now > coupon.validUntil) return { discountCents: 0, coupon: null, reason: "Coupon expired" };

  const minOrderCents = toCents(coupon.minOrderAmount);
  if (minOrderCents > 0 && subtotalCents < minOrderCents) {
    return { discountCents: 0, coupon: null, reason: "Order below minimum for this coupon" };
  }
  if (coupon.maxUses != null && (coupon.currentUses ?? 0) >= coupon.maxUses) {
    return { discountCents: 0, coupon: null, reason: "Coupon usage limit reached" };
  }

  let discountCents: number;
  if (coupon.discountType === "percentage") {
    const pct = Number.parseFloat(coupon.discountValue);
    discountCents = Math.round((subtotalCents * pct) / 100);
  } else {
    discountCents = toCents(coupon.discountValue);
  }

  const capCents = toCents(coupon.maxDiscountAmount);
  if (capCents > 0) discountCents = Math.min(discountCents, capCents);

  // Never discount below zero or above the subtotal.
  discountCents = Math.max(0, Math.min(discountCents, subtotalCents));

  return { discountCents, coupon };
}
