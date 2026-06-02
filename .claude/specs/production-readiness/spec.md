# Spec — Priority 1: Launch-Blocker Remediation

**Slug:** `production-readiness`
**Phase:** Priority 1 (Critical / launch blockers) from [docs/audit/09-MASTER-ROADMAP.md](../../../docs/audit/09-MASTER-ROADMAP.md)
**Status:** DRAFT — awaiting owner approval before build
**Owner of business decisions:** Murtaza (site owner)

This spec covers ONLY Priority 1. Priorities 2–6 get their own specs after R1 passes.

---

## 1. Problem statement

The store is a prototype that cannot safely take payments or hold customer data:

- The Supabase **service-role key is in the browser** (full DB compromise).
- **Prices and the charged amount come from the client** (buy anything for $0.01; any coupon = 10% off).
- **Raw card data flows through the server** (PCI SAQ D; Stripe ToS risk).
- **Payment and order are disconnected**; no payment record, no inventory.
- **Secrets are in git history.**
- A **public `/admin/seed`** route can tamper with data; **Apple Pay is fake**.
- Server state is **in-memory**; the deployed schema doesn't match the code.

Reference findings: C1–C7, SEC-Z1/Z2/S1/S2, ARCH-B2/B3/B4/B5, ARCH-D1/D2/D3.

## 2. Goals (in scope)

1. No secret that grants DB or payment authority is reachable from the client bundle.
2. All money math (price, discount, tax, total) is computed and enforced **server-side** from database values.
3. Card data never touches our servers (Stripe Payment Element + PaymentIntents).
4. One atomic, observable flow: **order (pending) → PaymentIntent → Stripe webhook → order paid + payment row + inventory decrement**.
5. Secrets rotated (owner) and purged from git history; client/server env split; secret scanning in place.
6. Public admin/dev routes removed or gated; fake Apple Pay removed.
7. A real, migrated Postgres schema (trimmed from `schema.sql`) is the single source of truth, with Supabase **RLS** enforced.

## 3. Non-goals (explicitly deferred)

- SEO rendering migration, analytics, CRO features, search/filter, wishlist, admin dashboard UI beyond what's needed to verify orders, performance/CDN work, full test matrix. (These are P2–P6.)
- Multi-currency, gifting, loyalty.
- A full custom admin panel (P2 builds the minimal admin; P1 only needs DB-level verification + Stripe dashboard).

## 4. Constraints & decisions

- **Keep the stack:** React + Vite SPA, Express server, Supabase (Postgres + Auth + Storage), Stripe, Drizzle. No framework migration in P1 (Next.js is a P4 decision).
- **Catalog reads** stay client-side via the **anon key under RLS** (fast, cacheable). **All writes and all money** go through the server.
- **Server holds** `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` only; client gets only `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`.
- **Pricing authority:** server reads `products.base_price`/`discount_price` and `product_variants`; client sends `{ productId, variantId?, quantity }[]` only.
- **Coupons:** validated against `coupon_codes` (type, value, validity, min order, usage limits). No coupon table entry = no discount.
- **Tax:** server uses the existing Stripe Tax integration at order finalization.
- **Payments:** Stripe **PaymentIntents** with `automatic_payment_methods`, `metadata.order_id`, idempotency keys. **Payment Element** on the client. Webhook is the source of truth for "paid".
- **Inventory:** decrement on `payment_intent.succeeded`; reserve at order creation with a short TTL to reduce oversell; release on expiry/failure.

## 5. Data model (MVP subset of `backend/schema.sql`)

Deploy and enforce these tables via Drizzle migrations (others from `schema.sql` deferred):
`categories`, `products`, `product_variants`, `product_inventory`, `product_images`, `orders`, `order_items`, `payments`, `coupon_codes`, and Supabase-managed `auth.users` (we do **not** keep our own password table).

Key rules:
- `orders` uses `order_items` (FK to products, price snapshot) — **not** a JSONB blob.
- `payments` always references an `order` and stores `stripe_payment_intent_id`.
- `order.status`: `pending → paid → processing → shipped → delivered` (+ `cancelled`, `refunded`).
- Monetary values stored as integer minor units (cents) server-side to avoid float drift (or `DECIMAL(12,2)` consistently — decided in design.md).

## 6. API surface (new/changed)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/checkout/quote` | optional JWT | Server computes subtotal/discount/tax/total from `{items, couponCode?, shippingAddress?}`; returns a server-signed quote. |
| POST | `/api/v1/orders` | optional JWT | Create `pending` order from a server quote; reserve inventory; returns `orderId`. |
| POST | `/api/v1/payments/intent` | optional JWT | Create/confirm PaymentIntent for an order's server total; idempotent; returns `client_secret`. |
| POST | `/api/v1/stripe/webhook` | Stripe sig | Source of truth: on success → order `paid`, write `payments`, decrement inventory, send email (email is P2). |
| GET | `/api/v1/health` | none | Liveness/readiness. |
| POST | `/api/v1/contact` | rate-limited | Existing contact (sanitized). |

Removed: `/api/create-payment-intent` (raw card), `/api/process-google-pay`, `/api/validate-apple-pay`, `/api/process-apple-pay` (replaced by Payment Element / wallets via PaymentIntents).

## 7. Acceptance criteria (gate R1)

1. **Grep proof:** zero `VITE_SUPABASE_SERVICE_ROLE_KEY` references in `frontend/`; production bundle contains no service-role key.
2. **Tamper test:** modifying client-sent prices/amounts/coupons cannot reduce the charged total; server recomputes and rejects mismatches.
3. **No raw card data** reaches the server (verified by code + network); PCI scope reduced to SAQ A.
4. **Atomicity:** a paid PaymentIntent always yields exactly one `paid` order + one `payments` row + correct inventory decrement (verified via webhook replay test).
5. **Secrets:** all four secrets rotated (owner-confirmed); `.env.local` absent from git history; gitleaks pre-commit active; env split.
6. **Routes:** `/admin/seed` and `/todo` return 404 in production (or require verified admin); no `window` usage in server code.
7. **RLS:** anon key cannot read another user's order or write catalog tables (verified by test queries).
8. **E2E happy path:** add to cart → checkout → pay (Stripe test card) → webhook → order shows `paid` with correct totals + inventory decremented.

## 8. Risks

- **Git history rewrite** (filter-repo) is disruptive if collaborators exist — coordinate; force-push once.
- **RLS lockout** — policies must be authored carefully so the server (service key) and anon read paths both work; stage on a non-prod Supabase project first.
- **Inventory race conditions** — use DB transactions / row locks for decrement.
- **Stripe webhook reliability** — verify signatures, make handlers idempotent, handle retries.

## 9. Open questions for the owner (see chat)

1. Confirm secret rotation done / repo push history.
2. Wallets: keep Apple/Google Pay (via Stripe Payment Element, supported automatically) or card-only for launch?
3. Shipping for P1: flat-rate / free over threshold / none yet? (affects total math)
4. Guest checkout: keep enabled at launch? (recommended yes)
