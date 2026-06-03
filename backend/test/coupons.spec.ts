import { describe, it, expect, vi, beforeEach } from "vitest";

// Shared mutable state so each test can control what the DB "returns".
const state = vi.hoisted(() => ({ rows: [] as any[] }));

vi.mock("../db", () => ({
  getDb: () => ({
    select: () => ({
      from: () => ({
        where: () => ({ limit: () => Promise.resolve(state.rows) }),
      }),
    }),
  }),
}));

import { applyCoupon } from "../services/coupons";

function coupon(overrides: Record<string, any> = {}) {
  return {
    id: "c1",
    code: "SAVE",
    discountType: "percentage",
    discountValue: "10",
    maxDiscountAmount: null,
    minOrderAmount: null,
    validFrom: null,
    validUntil: null,
    maxUses: null,
    currentUses: 0,
    isActive: true,
    ...overrides,
  };
}

beforeEach(() => {
  state.rows = [];
});

describe("applyCoupon", () => {
  it("gives ZERO discount when the code is empty (no 'any code = discount')", async () => {
    const r = await applyCoupon("", 10000);
    expect(r.discountCents).toBe(0);
    expect(r.coupon).toBeNull();
  });

  it("gives ZERO discount when no matching coupon row exists", async () => {
    state.rows = [];
    const r = await applyCoupon("RANDOMTEXT", 10000);
    expect(r.discountCents).toBe(0);
    expect(r.reason).toBe("Coupon not found");
  });

  it("applies a percentage discount from the DB row", async () => {
    state.rows = [coupon({ discountType: "percentage", discountValue: "10" })];
    const r = await applyCoupon("SAVE", 10000); // $100
    expect(r.discountCents).toBe(1000); // $10
  });

  it("applies a fixed discount from the DB row", async () => {
    state.rows = [coupon({ discountType: "fixed", discountValue: "5.00" })];
    const r = await applyCoupon("SAVE", 10000);
    expect(r.discountCents).toBe(500);
  });

  it("caps the discount at maxDiscountAmount", async () => {
    state.rows = [coupon({ discountType: "percentage", discountValue: "50", maxDiscountAmount: "10.00" })];
    const r = await applyCoupon("SAVE", 10000); // 50% = $50, capped to $10
    expect(r.discountCents).toBe(1000);
  });

  it("rejects when below the minimum order amount", async () => {
    state.rows = [coupon({ minOrderAmount: "200.00" })];
    const r = await applyCoupon("SAVE", 10000); // $100 < $200
    expect(r.discountCents).toBe(0);
    expect(r.reason).toMatch(/minimum/i);
  });

  it("rejects an expired coupon", async () => {
    state.rows = [coupon({ validUntil: new Date(Date.now() - 86_400_000) })];
    const r = await applyCoupon("SAVE", 10000);
    expect(r.discountCents).toBe(0);
    expect(r.reason).toMatch(/expired/i);
  });

  it("never discounts more than the subtotal", async () => {
    state.rows = [coupon({ discountType: "fixed", discountValue: "200.00" })];
    const r = await applyCoupon("SAVE", 5000); // $50 subtotal, $200 coupon
    expect(r.discountCents).toBe(5000);
  });

  it("rejects when usage limit is reached", async () => {
    state.rows = [coupon({ maxUses: 5, currentUses: 5 })];
    const r = await applyCoupon("SAVE", 10000);
    expect(r.discountCents).toBe(0);
    expect(r.reason).toMatch(/usage limit/i);
  });
});
