import { describe, it, expect, vi, beforeEach } from "vitest";

// Control the product rows the "DB" returns.
const state = vi.hoisted(() => ({ products: [] as any[] }));

vi.mock("../db", () => ({
  getDb: () => ({
    select: () => ({ from: () => ({ where: () => Promise.resolve(state.products) }) }),
  }),
}));
// Isolate pricing from Stripe Tax and coupon DB lookups.
vi.mock("../services/stripe", () => ({
  calculateTaxCents: () => Promise.resolve(0),
  stripeAvailable: () => false,
}));
vi.mock("../services/coupons", () => ({
  applyCoupon: () => Promise.resolve({ discountCents: 0, coupon: null }),
}));

import { computeBreakdown, PricingError } from "../services/pricing";

function product(overrides: Record<string, any> = {}) {
  return {
    id: "p1",
    name: "Gold Ring",
    sku: "RING-1",
    basePrice: "189.00",
    discountPrice: null,
    isActive: true,
    deletedAt: null,
    ...overrides,
  };
}

beforeEach(() => {
  state.products = [];
});

describe("computeBreakdown (server-authoritative pricing)", () => {
  it("computes subtotal from the DB price × quantity", async () => {
    state.products = [product({ basePrice: "189.00" })];
    const b = await computeBreakdown([{ productId: "p1", quantity: 2 }]);
    expect(b.subtotalCents).toBe(37800);
    expect(b.lineItems[0].unitPriceCents).toBe(18900);
    expect(b.totalCents).toBe(37800); // free shipping above threshold, tax 0
  });

  it("IGNORES any client-supplied price — only the DB price is used", async () => {
    state.products = [product({ basePrice: "189.00" })];
    // Malicious client tries to set a price of 1 cent.
    const b = await computeBreakdown([{ productId: "p1", quantity: 1, price: 0.01 } as any]);
    expect(b.subtotalCents).toBe(18900);
    expect(b.totalCents).toBeGreaterThanOrEqual(18900);
  });

  it("uses discountPrice when present (precedence over basePrice)", async () => {
    state.products = [product({ basePrice: "189.00", discountPrice: "150.00" })];
    const b = await computeBreakdown([{ productId: "p1", quantity: 1 }]);
    expect(b.subtotalCents).toBe(15000);
  });

  it("adds flat shipping below the free-shipping threshold", async () => {
    state.products = [product({ basePrice: "50.00" })]; // $50 < $100 default threshold
    const b = await computeBreakdown([{ productId: "p1", quantity: 1 }]);
    expect(b.shippingCents).toBe(900);
    expect(b.totalCents).toBe(5900);
  });

  it("throws on an empty cart", async () => {
    await expect(computeBreakdown([])).rejects.toBeInstanceOf(PricingError);
  });

  it("throws when a product does not exist / is inactive", async () => {
    state.products = []; // requested product not returned
    await expect(computeBreakdown([{ productId: "ghost", quantity: 1 }])).rejects.toBeInstanceOf(PricingError);
  });

  it("rejects an inactive product even if returned by the query", async () => {
    state.products = [product({ isActive: false })];
    await expect(computeBreakdown([{ productId: "p1", quantity: 1 }])).rejects.toBeInstanceOf(PricingError);
  });
});
