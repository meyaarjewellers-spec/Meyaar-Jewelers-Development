# Conversion Optimization Review (CRO) + Business & E-commerce

Covers product catalog structure, jewelry-specific experience, inventory, cart abandonment, trust signals, reviews, returns, shipping, upsell/cross-sell, email capture, and analytics-driven conversion.

Effort: **S** <1d · **M** 1–3d · **L** 4–8d.

---

## Conversion-critical gaps

| ID | Finding | Sev | Business impact | Fix | Effort |
|----|---------|-----|-----------------|-----|--------|
| CRO-1 | No products on the homepage | High | The primary landing page gives visitors nothing to buy → bounce. | Featured products + categories above the fold (UX-1). | M |
| CRO-2 | No search | High | Visitors who can't find a piece leave; search users convert far higher. | Add search (UX-S1). | M |
| CRO-3 | No real social proof | High | Jewelry is trust-driven; fake testimonials/reviews erode confidence and risk penalties. | Real reviews + ratings with verified-purchase badges (UX-2, UX-4). | M |
| CRO-4 | No trust signals at decision points | High | No secure-checkout badge, returns guarantee, authenticity/craftsmanship proof, or contact visibility. | Trust bar + PDP reassurance + visible policies (UX-T1, UX-P5). | S |
| CRO-5 | Email capture is fake | High | Newsletter discards emails → no list, no remarketing, no abandoned-cart recovery. | Real ESP capture + welcome flow + first-order incentive (UX-3). | M |
| CRO-6 | No cart abandonment recovery | High | Most carts abandon; with no captured email + no recovery, that revenue is gone. | Persisted carts + abandoned-cart email series (needs CRO-5 + accounts). | M |
| CRO-7 | Broken/again-untrustworthy checkout | High | Custom raw-card form + fake Apple Pay + any-coupon-10%-off undermines trust and loses sales. | Stripe Payment Element, real wallets, validated coupons (C2, C3, C6). | L |
| CRO-8 | No urgency/scarcity or stock signals | Medium | "Limited edition / handmade" positioning isn't reinforced with stock or scarcity cues. | Low-stock/made-to-order indicators (UX-P3); honest scarcity. | S |
| CRO-9 | No upsell/cross-sell | Medium | No "complete the look", "frequently bought", or bundles → lower AOV. | Related products (component exists), "complete the set", post-add-to-cart recommendations. | M |
| CRO-10 | No incentive for first purchase | Medium | No welcome offer to convert first-time visitors. | First-order discount via email capture popup (a `FirstTimePopup` exists — wire it to a real offer). | S |
| CRO-11 | No wishlist / save-for-later | Medium | High-consideration jewelry buyers often return; nothing lets them save. | Wishlist (schema exists). | M |
| CRO-12 | No order tracking / account history | Medium | Post-purchase anxiety hurts repeat rate and inflates support load. | Account order history + tracking page. | M |

## Jewelry-specific experience

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| JWL-1 | No variants (ring size, chain length, metal) | Medium | Essential for jewelry purchase confidence; schema supports it. | Variant picker on PDP (UX-P2). | M |
| JWL-2 | Materials/certification not surfaced | Medium | Buyers want purity, carat, certification, provenance. | Specs table + certificates (UX-P4) + Product schema (SEO-2). | S |
| JWL-3 | No size/care guide content | Medium | `SizeGuideButton` exists with no guide; care builds perceived value. | Ring-size + care guide pages/modals. | S |
| JWL-4 | No gifting features | Low | Jewelry is gift-heavy: gift wrap, gift message, gift cards absent. | Add gifting options at cart/checkout. | M |
| JWL-5 | Imagery not zoom/lifestyle complete | Low | `ImageZoomViewer` exists; ensure multiple angles + on-model shots per product. | Standardize product photography set. | M |

## Inventory & operations

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| OPS-1 | No inventory tracking/enforcement | High | Oversell risk; no stock truth (ARCH-D3). | Inventory reserve/decrement via order/payment flow. | M |
| OPS-2 | No admin/order management | High | No way to view/fulfill orders, manage products, or process refunds (the public seed page is not this). | Build a minimal authenticated admin (orders, products, inventory, refunds). | L |
| OPS-3 | No returns workflow | Medium | Return *policy* page exists, but no RMA/return request flow. | Return request flow tied to orders. | M |
| OPS-4 | Shipping is undefined | Medium | No shipping rates/zones/methods; checkout has no real shipping calc. | Define shipping options + rates; show ETA. | M |

## Analytics (its own audit area)

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| AN-1 | **No analytics installed** | High | No GA4, GTM, or pixel anywhere. You are flying blind — no traffic, funnel, or revenue data. | Install GA4 + GTM. | S |
| AN-2 | No e-commerce event tracking | High | No `view_item`, `add_to_cart`, `begin_checkout`, `purchase` events. | Implement GA4 ecommerce events across the funnel. | M |
| AN-3 | No conversion/funnel tracking | High | Can't see where users drop. | Configure funnels + conversions in GA4. | S |
| AN-4 | No revenue attribution | Medium | No channel/campaign attribution; can't measure marketing ROI. | UTM strategy + GA4 attribution; server-side purchase event for accuracy. | M |
| AN-5 | No consent management | Medium | Analytics/marketing tags need consent (GDPR/PECR/CCPA). | Add a consent banner gating non-essential tags. | S |
| AN-6 | No product/behavior analytics | Low | No heatmaps/session insight. | Optional: Microsoft Clarity/Hotjar. | S |

---

## CRO priority sequence

1. **Foundational (depends on backend P1–P2):** CRO-1, CRO-3, CRO-5, CRO-7, OPS-1, OPS-2, AN-1/2/3.
2. **Revenue lift (P5):** CRO-2, CRO-6, CRO-9, CRO-10, CRO-11, CRO-12, JWL-1/2/3.
3. **Margin/AOV polish:** JWL-4/5, OPS-3/4, AN-4/5/6.

> Most CRO wins are blocked by the backend and trust fixes. Sequence them after Priorities 1–2 so the "conversion" you optimize is real and measurable.
