# Priority 1 — Implementation Status & Owner Handoff

**Date:** 2026-06-02
**Branch:** `Foundation`
**Scope:** Priority 1 launch-blockers (C1–C7) from the audit.

---

## What was implemented (code complete + locally verified)

All Priority-1 code is written and passes local verification. The consolidated R1 check is green:

| # | Check | Result |
|---|-------|--------|
| 1 | No service-role key referenced in client | ✅ 0 refs |
| 2 | Raw-card / fake-wallet / `window` endpoints removed | ✅ gone |
| 3 | Frontend typecheck | ✅ pass |
| 4 | Backend business-logic typecheck | ✅ pass |
| 5 | Unit tests | ✅ 23 pass |
| 6 | Env VITE-secret guard runs | ✅ pass |
| 7 | Dead/admin pages removed | ✅ removed |
| 8 | Server live (`/`, `/api/v1/health`) | ✅ 200 |
| 9 | Migrations + RLS authored | ✅ present |
| 10 | **Production bundle has zero secrets** | ✅ **PASS** |

### By finding

- **C1 — admin key in browser:** All `VITE_SUPABASE_SERVICE_ROLE_KEY` usage removed; catalog/branding now read via the anon client under RLS. Production build scanned — **no secrets in the bundle**. A boot-time guard (`backend/config/env.ts`) refuses to start in production if any secret is `VITE_`-prefixed.
- **C2 — client-set prices:** New server-authoritative pricing (`backend/services/pricing.ts`). The browser sends only `{productId, quantity}`; the server computes subtotal/discount/shipping/tax/total from the DB. Unit-tested: client-supplied prices are ignored; invalid coupons give zero discount.
- **C3 — raw card data:** The raw-card endpoint is deleted. Checkout now uses **Stripe Payment Element** (`frontend/.../StripeCheckout.tsx`) — card data stays in Stripe's iframe (PCI SAQ A).
- **C4 — payment ⇄ order disconnected:** New flow: `/api/v1/orders` (creates pending order + reserves inventory) → `/api/v1/payments/intent` (PaymentIntent for the order's DB total, idempotent) → `/api/v1/stripe/webhook` (verified signature → marks order paid, writes the `payments` row, decrements inventory, idempotently).
- **C5 — secrets in git history:** `.gitignore` hardened; `.env.server`/`frontend/.env` split; `.gitleaks.toml` added. **History scrub + key rotation are owner steps (below).**
- **C6 — public admin route / fake Apple Pay:** `/admin/seed` and `/todo` routes + pages deleted; fake Apple/Google Pay components deleted (the Payment Element surfaces real wallets).
- **C7 — in-memory storage / schema drift:** `MemStorage` and the plaintext-password table removed. New Drizzle schema (`shared/schema.ts`, 9 tables) + generated migration + RLS policies are the single source of truth.

### New/changed files (high level)

```
backend/config/env.ts            env validation + VITE-secret guard
backend/db/index.ts              Drizzle (node-postgres) client
backend/logger.ts                structured logger
backend/services/                money, coupons, pricing, inventory, orders, stripe, fulfillment
backend/routes/                  health, checkout, orders, payments, webhook, contact
backend/middleware/              validate (zod), security (helmet/cors/rate-limit), auth (optional JWT)
backend/migrations/              0000_*.sql + rls/policies.sql + rls/verify.sql
shared/schema.ts                 Drizzle schema (catalog, orders, payments, inventory, coupons)
frontend/src/lib/                stripeClient.ts, checkoutApi.ts, productCatalog.ts
frontend/.../StripeCheckout.tsx  Payment Element flow
backend/test/                    money/coupons/pricing specs (23 tests)
scripts/verify-no-secrets.sh     build + secret scan
```

---

## ⚠️ Owner-only steps to finish R1 (cannot be automated)

These need your Stripe/Supabase/Google dashboards and were intentionally left for you.

### 1. Rotate the leaked secrets (do first)
- **Stripe:** Developers → API keys → **roll** the secret key.
- **Supabase:** Settings → API → **reset** the `service_role` key and the `anon` key.
- **Google Cloud:** disable the unused Firebase service account; delete `serviceAccountKey.json`.
- Full walkthrough: see the chat "guide to hide secrets" (rotate → split env → purge history → gitleaks).

### 2. Create the split env files (paste the NEW keys)
- `cp .env.server.example .env.server` → fill `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `DATABASE_URL`, `SHIPPING_FLAT_RATE_CENTS`, `SHIPPING_FREE_THRESHOLD_CENTS`.
- `cp frontend/.env.example frontend/.env` → fill `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`.
- **Delete `.env.local`** once migrated (this clears the remaining dev warning).

### 3. Provide the shipping numbers
You chose **free over a threshold**. Tell me the two values (or set them in `.env.server`):
- `SHIPPING_FLAT_RATE_CENTS` (e.g. `900` = $9.00)
- `SHIPPING_FREE_THRESHOLD_CENTS` (e.g. `10000` = free over $100)

### 4. Apply the schema + RLS to your Supabase (staging first)
```bash
# with DATABASE_URL set in your shell/.env.server
npm run db:push                                   # or: psql "$DATABASE_URL" -f backend/migrations/0000_*.sql
psql "$DATABASE_URL" -f backend/migrations/rls/policies.sql
psql "$DATABASE_URL" -f backend/migrations/rls/verify.sql   # expect catalog rows, 0 orders/payments to anon
```
Then load your real products/categories/inventory/images.

### 5. Configure the Stripe webhook
- Stripe Dashboard → Developers → Webhooks → add endpoint `https://YOURDOMAIN/api/v1/stripe/webhook`, events `payment_intent.succeeded` + `payment_intent.payment_failed`.
- Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
- Local testing: `stripe listen --forward-to localhost:3000/api/v1/stripe/webhook`.

### 6. Apple Pay domain verification (for the wallet)
- Stripe Dashboard → Settings → Payment Methods → Apple Pay → add & verify your domain (Stripe hosts the verification file automatically once configured).

### 7. Scrub git history + add the pre-commit guard
```bash
git filter-repo --path .env.local --invert-paths --force
gitleaks detect --no-banner           # should be clean afterwards
```

---

## Then: finish R1 verification (with your infra)
Once 1–7 are done, run end-to-end in Stripe **test** mode:
```bash
npm run db:push && npm test && npm run verify:no-secrets
npm run dev    # add to cart → checkout → pay 4242 4242 4242 4242 → webhook → order = paid
```
When the e2e happy path passes and `rls/verify.sql` shows orders/payments locked to anon, **R1 is met** and you can move to Priority 2 (and switch Stripe to live mode).

---

## What is NOT in Priority 1 (next phases)
Per the roadmap: full input-validation sweep + JWT-everywhere, transactional email + real order-confirmation, minimal admin dashboard, monitoring/Sentry/uptime, CI/CD, performance/CDN, SEO, analytics, search/reviews/wishlist/CRO. See [09-MASTER-ROADMAP.md](09-MASTER-ROADMAP.md).
