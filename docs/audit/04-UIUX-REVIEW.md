# UI/UX Review

Covers UI/UX, design consistency, mobile responsiveness, accessibility, navigation, user journeys, trust, missing pages/CTAs, product page, checkout, search/filtering, and homepage.

Effort: **S** <1d · **M** 1–3d · **L** 4–8d.

---

## Highest-impact UX findings

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| UX-1 | **Homepage shows no products** | High | [Home.tsx:20-24](../../frontend/src/pages/Home.tsx#L20-L24) hardcodes `setCategories([])`; `FeaturedCategories` only renders `if categories.length > 0`. The hero's value prop has nothing to shop beneath it. | Fetch real categories/featured products and render them above the fold. | M |
| UX-2 | **Fake testimonials** | High | [Home.tsx:28-49](../../frontend/src/pages/Home.tsx#L28) hardcodes "Sarah Mitchell / Emma Johnson / Olivia Chen" 5★ reviews. Fabricated reviews are a trust risk and violate FTC/ASA advertising rules. | Replace with real, verifiable reviews (or remove until you have them). | S |
| UX-3 | **Newsletter captures nothing** | High | [Newsletter.tsx:11-16](../../frontend/src/components/home/Newsletter.tsx#L11) `console.log`s the email and shows "Thank you for subscribing" — no storage, no ESP. Every signup is lost and the user is misled. | Persist to DB + ESP (Klaviyo/Mailchimp) with double opt-in. | M |
| UX-4 | **Reviews are fake-"verified" and not saved** | High | [CustomerReviews.tsx:52](../../frontend/src/components/product/CustomerReviews.tsx#L52) sets `isVerifiedPurchase: true` for every submission; reviews live in local state only and vanish on refresh. Uses `alert()` for validation. | Persist reviews server-side; only flag verified when tied to a real order; replace `alert` with inline errors. | M |
| UX-5 | No cart review step (cart → straight to checkout) | Medium | There's no cart page/drawer to review/edit before committing; the journey jumps to `/checkout`. | Add a cart drawer/page with quantity edit, remove, subtotal, and "continue shopping". | M |
| UX-6 | Misleading success messaging | Medium | Checkout toast says "confirmation sent to your email" but no email is sent ([useCheckout.ts:162](../../frontend/src/components/checkout/useCheckout.ts#L162)). | Only claim what actually happens; send the email (P2). | S |

## Navigation & journeys

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| UX-N1 | Only 3 fixed categories, hardcoded in router | Medium | [App.tsx:31-39](../../frontend/src/App.tsx#L31) hardcodes `/shop/necklaces|bracelets|earrings`. No "Shop All", no dynamic categories, no collections. | Dynamic category routes from DB; add a "Shop All" / collections landing. | M |
| UX-N2 | No breadcrumbs | Medium | A `breadcrumb` UI component exists but isn't used on product/category pages. | Add breadcrumbs (also aids SEO — see SEO-7). | S |
| UX-N3 | Dev/admin pages reachable | Medium | `/todo`, `/admin/seed` in the nav graph (C6). | Remove from prod. | S |
| UX-N4 | OAuth always lands on checkout | Low | SEC-A3 — signing in from the header dumps users at `/checkout-method`. | Honor `returnTo`. | S |

## Product page

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| UX-P1 | No real review data / counts | Medium | Rating + reviews are placeholder; no social proof from real buyers. | Wire to persisted reviews; show count + distribution. | M |
| UX-P2 | No variant selection (size/length/metal) | Medium | Schema supports `product_variants`, but the PDP has no variant picker (ring size, chain length, metal). Essential for jewelry. | Add variant selection driving price/SKU/stock. | M |
| UX-P3 | No stock/availability signal | Medium | No "in stock / low stock / made to order" indicator. | Show availability from inventory. | S |
| UX-P4 | Jewelry detail surface underused | Low | Schema has material, purity, carat, certification, care — likely not all surfaced. | Render a structured specs table (also Product schema for SEO). | S |
| UX-P5 | No delivery/returns reassurance on PDP | Medium | Returns/shipping policies exist as pages but aren't summarized at the point of decision. | Add shipping ETA + returns blurb near the buy box. | S |

## Checkout

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| UX-C1 | Card entry is a custom form | High | Raw card fields (C3) rather than Stripe Elements — looks less trustworthy and is non-compliant. | Stripe Payment Element (also fixes C3). | L |
| UX-C2 | No order summary persistence / address validation | Medium | Guest form has no address validation/autocomplete; totals are client-side. | Server totals + address validation (Stripe/Google). | M |
| UX-C3 | Promo UX accepts any code as 10% off | Medium | C2 — fake discounts. | Validate against `coupon_codes`. | S |
| UX-C4 | No progress/steps indicator | Low | Multi-step checkout lacks a visible stepper. | Add a 3-step progress indicator. | S |

## Search & filtering

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| UX-S1 | **No search at all** | High | No search box anywhere; users cannot find products by name/material/price. | Add search (client filter for MVP, server/Algolia later). | M |
| UX-S2 | No filtering/sorting on category pages | Medium | No filter by price/material/gemstone, no sort. | Add faceted filters + sort using existing product fields. | M |

## Accessibility

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| UX-A1 | Zoom disabled | Medium | [index.html:5](../../frontend/index.html#L5) `maximum-scale=1` blocks pinch-zoom — WCAG 1.4.4 fail. | Remove `maximum-scale`. | S |
| UX-A2 | No skip-link / landmark review | Low | No "skip to content"; verify heading order and landmarks. | Add skip link; audit headings. | S |
| UX-A3 | Icon-only buttons need labels | Low | Cart/user icon buttons — confirm `aria-label`s. | Add `aria-label`s; run axe. | S |
| UX-A4 | Color contrast unverified | Low | Muted text on muted backgrounds (e.g., testimonials) needs contrast check. | Verify AA contrast. | S |

## Design consistency / trust

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| UX-T1 | No trust signals | Medium | No secure-checkout badges, no return guarantee, no contact/phone, no "handmade" provenance proof, no certifications surfaced. | Add a trust bar (secure payments, free returns, handmade, ships from X). | S |
| UX-T2 | "Established 2025" + empty social proof | Low | New brand with fabricated reviews reads as untrustworthy. | Lead with authentic craftsmanship story + real proof. | S |
| UX-T3 | Duplicate asset dirs / inconsistent imagery | Low | `frontend/assets` and `frontend/src/assets` duplicated; AI-generated product images of varying style. | Consolidate assets; consistent photography. | S |

## Missing pages

- FAQ, Size/Care guide (a `SizeGuideButton` exists but no guide), Order tracking / account order history, Wishlist, Search results, "Shop All"/Collections, 404 polish. (Returns/Shipping/Privacy/Terms pages **do** exist — good.)

---

## Summary

The design system and component structure are solid, but the homepage and product pages are **merchandising-empty** and several "working" features (newsletter, reviews, testimonials, order email) are **cosmetic illusions**. Fixing UX-1 through UX-6 plus search (UX-S1) will make the store feel real and trustworthy; they pair naturally with the backend work in Priority 1–2.
