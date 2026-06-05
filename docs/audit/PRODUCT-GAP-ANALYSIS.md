# Product Gap Analysis — User-Flow Walkthrough

**Lens:** product manager + product analyst, walking the site as a shopper (and as the owner).
**Date:** 2026-06-03
**Method:** journey-stage walkthrough grounded in the actual code. Each gap notes user impact, severity, and rough effort.

Severity: **P0** breaks the journey / broken promise · **P1** high friction or lost revenue · **P2** meaningful improvement · **P3** nice-to-have.
Effort: **S** <1d · **M** 1–3d · **L** 4–8d.

---

## 0. The "broken promises" (fix-first — they actively mislead shoppers)

| ID | Gap | Why it hurts | Sev | Effort |
|----|-----|--------------|-----|--------|
| **BP-1** | **No coupon field anywhere.** The backend computes discounts from `couponCode`, but no input exists in cart or checkout, and `CheckoutMethod` never passes one. | The welcome popup promises **"15% off with WELCOME15"** that a shopper literally cannot redeem. Every promo you run is unusable. Direct lost conversions. | P0 | M |
| **BP-2** | **The `WELCOME15` coupon doesn't exist in the DB** and isn't created by the popup. | Even with a field (BP-1), the code would be rejected. | P0 | S |
| **BP-3** | **Fake testimonials** ("Sarah M.", "Emma J.") hardcoded on the homepage. | Trust risk + FTC/ASA issue once you advertise. | P1 | S |
| **BP-4** | **Newsletter/popup say "15% off"**, but there's no working discount to back it. | Same as BP-1/2 — promise without mechanism. | P0 | S |

---

## 1. Discovery & browsing

| ID | Gap | Impact | Sev | Effort |
|----|-----|--------|-----|--------|
| D-1 | **No "Shop All" / full catalog page.** Only 3 fixed category routes. | Shoppers can't browse everything in one place; limits exploration. | P1 | M |
| D-2 | **No collections** beyond the 3 categories (New Arrivals, Bestsellers, Gifts under $X, Sale). | No merchandising hooks; harder to run campaigns. | P2 | M |
| D-3 | **Sale prices invisible.** `discount_price` exists in the DB but `ProductCard` never shows a strikethrough/"Sale" badge. | Discounts don't drive urgency or clicks; you can't visibly run a sale. | P1 | S |
| D-4 | **Search has no filters/sort** and is a basic substring match (no typo tolerance, no facets, no "no results → suggestions"). | Poor findability; search users convert highest when it works. | P2 | M |
| D-5 | **No "New Arrivals" signal** (badge/sort by `created_at`). | No freshness cue for returning visitors. | P3 | S |

## 2. Product detail page (PDP)

| ID | Gap | Impact | Sev | Effort |
|----|-----|--------|-----|--------|
| P-1 | **No variant selection (ring size / chain length / metal).** `product_variants` exists in the schema but the PDP has no selector. | For jewelry this is critical — a buyer can't choose a ring size. Either they don't buy or they buy the wrong thing → returns. | **P0** | M |
| P-2 | **No stock/availability indicator.** Inventory is tracked but never surfaced ("In stock / Low stock / Made to order"). | No urgency; oversell confusion; lost "only 2 left" conversions. | P1 | S |
| P-3 | **No delivery estimate** ("Order by X for delivery by Y"). | Reduces purchase confidence. | P2 | S |
| P-4 | **No "notify me when back in stock."** | Lost demand capture on sold-out items. | P2 | M |
| P-5 | **Related products are random** ("from other categories"), not "complete the look"/recommendations. | Weak cross-sell, lower AOV. | P2 | M |
| P-6 | **Reviews can be submitted by anyone** (guest, auto-approved) → spam risk; **no photo reviews, no Q&A.** | Trust + moderation load. (Admin moderation exists, but default is auto-approve.) | P2 | M |
| P-7 | **Size/care guide is a button with no content.** | Unanswered question = hesitation. | P3 | S |
| P-8 | **No recently-viewed / no social share.** | Lost re-engagement + organic sharing. | P3 | S |

## 3. Cart

| ID | Gap | Impact | Sev | Effort |
|----|-----|--------|-----|--------|
| C-1 | **No coupon entry** (see BP-1). | Lost promos. | P0 | M |
| C-2 | **No "save for later" / move to wishlist** from the cart. | Forces all-or-nothing; abandonment. | P2 | S |
| C-3 | **No gift options** (gift message, gift wrap). | Jewelry is gift-heavy; lost AOV + occasion sales. | P2 | M |
| C-4 | **Cart not synced to account** (localStorage only). | Lose cart when switching device; abandonment. | P3 | M |

## 4. Checkout

| ID | Gap | Impact | Sev | Effort |
|----|-----|--------|-----|--------|
| CO-1 | **Shipping address** — ✅ just added (saved/new + auto-save). | — | done | — |
| CO-2 | **No coupon field at checkout** (BP-1). | Lost promos at the highest-intent moment. | P0 | M |
| CO-3 | **No itemized order review at the pay step.** Totals show, but not the line items. | Lower confidence right before paying. | P1 | S |
| CO-4 | **No shipping-method choice** (standard vs express). Server applies one flat/free rule. | No upsell to faster shipping; rigid. | P2 | M |
| CO-5 | **No "create an account" upsell for guests** post-purchase. | Misses repeat-customer capture. | P2 | S |
| CO-6 | **No express wallet button at the top** (Apple/Google Pay before the address step). | Slower path for wallet users. | P3 | S |
| CO-7 | **No order notes / special instructions.** | Minor friction for special requests. | P3 | S |

## 5. Post-purchase

| ID | Gap | Impact | Sev | Effort |
|----|-----|--------|-----|--------|
| PP-1 | **Confirmation page shows only the order number — not the items/receipt.** | Anticlimactic; no on-screen proof of what was bought. | P1 | S |
| PP-2 | **No order detail / tracking view.** Account shows a list; you can't open an order to see items, status timeline, or tracking. **Guests can't view their order at all.** | High post-purchase anxiety; support tickets; guests left in the dark. | **P1** | M |
| PP-3 | **No "buy again" / re-order.** | Lost repeat purchases. | P2 | S |
| PP-4 | **No returns/RMA request flow.** A return *policy* page exists, but nothing actionable. | Friction + support load; trust. | P2 | M |
| PP-5 | **No tracking number management/display.** Schema has it; admin can't add it and customers can't see it. | Can't actually fulfill/communicate shipping. | P1 | M |
| PP-6 | **No lifecycle emails** beyond order confirmation (shipping, delivered, review request, **abandoned cart**, back-in-stock). | Big retention + recovery revenue left on the table. | P1 | M–L |

## 6. Account

| ID | Gap | Impact | Sev | Effort |
|----|-----|--------|-----|--------|
| A-1 | **No profile edit** (name/phone/password). Read-only. | Can't self-serve basic changes. | P2 | S |
| A-2 | **Address book** — ✅ just added. | — | done | — |
| A-3 | **Wishlist not synced server-side** (per-device localStorage). | Lost across devices; can't remarket. | P2 | M |
| A-4 | **No saved payment methods** (Stripe Customer) for faster repeat checkout. | Slower repeat purchase. | P2 | M |
| A-5 | **No email preferences / unsubscribe management.** | Compliance + UX. | P3 | S |
| A-6 | **No "delete my account" / data export.** | GDPR/CCPA. | P3 | M |

## 7. Trust & content

| ID | Gap | Impact | Sev | Effort |
|----|-----|--------|-----|--------|
| T-1 | **No FAQ page.** | Repeated questions → hesitation + support load. | P2 | S |
| T-2 | **No size/care/materials guides** (content). | Unanswered jewelry-specific questions. | P2 | M |
| T-3 | **No blog/editorial.** | Misses SEO + engagement. | P3 | L |
| T-4 | **No live chat / support widget**, limited contact info (no phone/hours surfaced site-wide). | Lower trust for high-consideration purchases. | P3 | S |

## 8. Owner / admin (can you actually run the store?)

| ID | Gap | Impact | Sev | Effort |
|----|-----|--------|-----|--------|
| AD-1 | **Admin can't create or fully edit products** (only toggle active/featured + price). No add product, image upload, description/material/variant editing. | You still need raw Supabase to merchandise. Biggest ops gap. | **P1** | L |
| AD-2 | **Admin can't manage inventory** (stock is read-only). | Can't restock/adjust without SQL. | P1 | M |
| AD-3 | **Admin can't create coupons.** | Can't run promos without SQL — ties to BP-1/2. | P1 | M |
| AD-4 | **Admin can't add tracking numbers / fulfill** (status change only) or **view full order detail / customer info.** | Can't operate fulfillment from the UI. | P1 | M |
| AD-5 | **No real sales analytics** beyond basic counters. | Limited business insight. | P3 | M |

## 9. Platform / reach

| ID | Gap | Impact | Sev | Effort |
|----|-----|--------|-----|--------|
| PL-1 | **USD-only, US-centric** (tax + country default US, no intl shipping rules). | Caps addressable market. | P3 | L |
| PL-2 | **No gift cards / loyalty / referral.** | Misses retention + acquisition levers. | P3 | L |
| PL-3 | **No mobile sticky add-to-cart** on PDP. | Minor mobile conversion friction. | P3 | S |

---

## Top 10 highest-impact gaps (my recommended fix order)

1. **BP-1/BP-2/CO-2/C-1 — Coupons end-to-end** (field in cart+checkout, validation, + admin coupon creation). Unlocks every promo and makes the welcome offer real. *(P0)*
2. **P-1 — PDP variant selection** (ring size / length / metal). Core to selling jewelry correctly. *(P0)*
3. **PP-2 + PP-5 — Order detail + tracking view** (incl. guest order lookup) and admin tracking entry. Kills post-purchase anxiety + enables fulfillment. *(P1)*
4. **AD-1/AD-2/AD-3/AD-4 — Real admin** (create/edit products, inventory, coupons, fulfill orders + tracking). So you can run the store without SQL. *(P1)*
5. **PP-1 — Itemized confirmation/receipt** on screen. *(P1)*
6. **P-2 — Stock/availability on PDP** (+ urgency). *(P1)*
7. **D-3 — Show sale prices** (strikethrough + badge) wherever `discount_price` is set. *(P1)*
8. **PP-6 — Lifecycle emails** (shipping, review request, abandoned-cart recovery). *(P1)*
9. **BP-3 — Replace fake testimonials** with real reviews. *(P1)*
10. **D-1 — "Shop All" + collections** (and search filters). *(P2)*

---

## Suggested next "functionality" sprint (cohesive, high ROI)
A tight bundle that fixes the worst friction and makes promos + jewelry-buying actually work:

- **Coupons end-to-end** (cart/checkout field + admin coupon manager + seed `WELCOME15`).
- **PDP variants + stock display.**
- **Order detail + tracking** (customer view incl. guest lookup; admin tracking entry).
- **Itemized confirmation + sale-price display.**

These are mostly **functional** (your goal) and unblock revenue + operations. Tell me which to start with — or I can take the bundle top-to-bottom.
