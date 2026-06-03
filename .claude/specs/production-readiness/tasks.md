# Tasks — Priority 1: Launch-Blocker Remediation

> **Status (2026-06-02):** Groups 1–6 **code-complete and locally verified** (frontend+backend typecheck, 23 unit tests, production bundle has zero secrets, server live). Owner-gated items remain: secret rotation, `DATABASE_URL` + applying migrations/RLS to Supabase, Stripe webhook + Apple Pay domain verification, shipping numbers, git-history scrub. Full handoff: [docs/audit/PRIORITY-1-HANDOFF.md](../../../docs/audit/PRIORITY-1-HANDOFF.md). R1 review checkpoint passes once the owner steps + e2e in Stripe test mode are done.


Parallel groups run sequentially; tasks within a group run concurrently and never write the same file. Each task: `[role] verb what | files | acceptance. Run: <cmd>`. Reviews gate progression.

Legend: roles `[coding] [devops]`; reviews by `review-agent` (+`sa-agent` for infra). Effort S/M/L.

---

## Group 0 — Owner prerequisites (BLOCKING, manual)

- [ ] [owner] Rotate Stripe secret key, Supabase service-role + anon keys; disable Firebase service account; confirm repo push history. *(No code; gates everything.)*

---

## Group 1 — Secrets, env, secret-scanning (foundation)

- [ ] **T1.1** `[devops]` Purge `.env.local` from git history + add gitleaks pre-commit | `.gitignore`, `.gitleaks.toml`, `.husky/pre-commit` (or hook script), `docs/audit/secret-rotation.md` | `git log --all -- .env.local` returns empty; gitleaks runs on commit. Run: `gitleaks detect --no-banner` `[skip-verify]` if gitleaks unavailable in env (document instead).
- [ ] **T1.2** `[devops]` Split env into server (`.env.server`) vs client (`frontend/.env`); add zod boot-time env validation that rejects `VITE_`-prefixed secrets | `backend/config/env.ts`, `.env.server.example`, `frontend/.env.example` | Server refuses to boot if a service-role/secret var is `VITE_`-prefixed or missing. Run: `npx tsx backend/config/env.ts --check`

> Review checkpoint after Group 1.

## Group 2 — De-key client + remove dead/admin routes

- [ ] **T2.1** `[coding]` Remove all `VITE_SUPABASE_SERVICE_ROLE_KEY` usage; re-route those reads via anon+RLS or server | `frontend/src/lib/seedDatabase.ts` (delete), `frontend/src/lib/brandingDatabase.ts`, `frontend/src/components/category/useCategoryData.ts` | `grep -r VITE_SUPABASE_SERVICE_ROLE_KEY frontend/` → 0 matches; app still renders categories/branding. Run: `bash -c "! grep -rq VITE_SUPABASE_SERVICE_ROLE_KEY frontend/src"`
- [ ] **T2.2** `[coding]` Remove `/admin/seed` and `/todo` routes + delete `AdminSeed.tsx`, `TodoList.tsx` | `frontend/src/App.tsx`, `frontend/src/pages/AdminSeed.tsx` (del), `frontend/src/pages/TodoList.tsx` (del) | Routes 404 in prod build; `tsc` clean. Run: `cd frontend && npx tsc --noEmit`
- [ ] **T2.3** `[coding]` Remove legacy payment endpoints + `window` usage + fix error handler re-throw | `backend/routes.ts`, `backend/index.ts` | `/api/create-payment-intent`, google/apple-pay endpoints gone; no `window` in backend; handler responds once. Run: `bash -c "! grep -nq 'window' backend/routes.ts"`

> Review checkpoint after Group 2 (security-focused: confirm no service key in `vite build` output).

## Group 3 — Schema, migrations, RLS (infra)

- [ ] **T3.1** `[devops]` Author Drizzle schema for MVP subset + migrations (categories, products, product_variants, product_inventory, product_images, orders, order_items, payments, coupon_codes) | `shared/schema.ts` (rewrite), `backend/migrations/*`, `backend/drizzle.config.ts` | `drizzle-kit generate` produces migrations; apply to staging DB succeeds. Run: `npx drizzle-kit generate`
- [ ] **T3.2** `[devops]` Author RLS policies per design §5 (catalog public-read; orders per-user; writes service-only) | `backend/migrations/rls/*.sql`, `docs/audit/rls-policies.md` | anon cannot read other users' orders nor write catalog (test queries documented). Run: `psql "$STAGING_DB_URL" -f backend/migrations/rls/verify.sql` `[skip-verify]` if no staging DB; provide SQL + manual verification notes.
- [ ] **T3.3** `[coding]` Remove `MemStorage` + plaintext user table; add Postgres-backed data access (Drizzle) | `backend/storage.ts` (rewrite), `shared/schema.ts` | no in-memory storage; server reads/writes via Drizzle. Run: `cd backend && npx tsc --noEmit`

> Review checkpoint after Group 3 (`sa-agent` validates schema + RLS + scalability).

## Group 4 — Server-authoritative checkout & payments

- [ ] **T4.1** `[coding]` `/api/v1/checkout/quote` — server computes subtotal/discount/tax/total from DB + Stripe Tax; returns signed quote | `backend/routes/checkout.ts`, `backend/services/pricing.ts`, `backend/services/coupons.ts` | tamper test: client-sent prices ignored; coupon validated against `coupon_codes`. Run: `cd backend && npx vitest run pricing`
- [ ] **T4.2** `[coding]` `/api/v1/orders` — create pending order + `order_items` + reserve inventory (txn) | `backend/routes/orders.ts`, `backend/services/orders.ts`, `backend/services/inventory.ts` | order persists with snapshots; stock reserved atomically. Run: `cd backend && npx vitest run orders`
- [ ] **T4.3** `[coding]` `/api/v1/payments/intent` — Stripe PaymentIntent(amount=server total, metadata.order_id, idempotencyKey) | `backend/routes/payments.ts`, `backend/services/stripe.ts` | returns client_secret; amount == server total; idempotent. Run: `cd backend && npx vitest run payments`
- [ ] **T4.4** `[coding]` `/api/v1/stripe/webhook` — verify signature; on success mark order paid + write `payments` + decrement stock (idempotent) | `backend/routes/webhook.ts`, `backend/services/fulfillment.ts` | replaying same event → one decrement, one payment row. Run: `cd backend && npx vitest run webhook`
- [ ] **T4.5** `[coding]` Add `/api/v1/health` + helmet + strict CORS + Zod validation on new endpoints | `backend/index.ts`, `backend/middleware/*` | `/health` 200; helmet headers present. Run: `cd backend && npx vitest run middleware`

> Dependencies: T4.1→T4.2→T4.3→T4.4 (sequential data flow); T4.5 parallel. Needs Group 3.

## Group 5 — Client checkout rebuild (Stripe Element)

- [ ] **T5.1** `[coding]` Replace raw-card form with Stripe Payment Element; drive quote→order→intent→confirm | `frontend/src/components/checkout/StripePaymentForm.tsx`, `frontend/src/components/checkout/useCheckout.ts`, `frontend/src/components/checkout/PaymentMethodsSection.tsx` | no card fields in our DOM; pay with test card succeeds; totals come from server quote. Run: `cd frontend && npx tsc --noEmit`
- [ ] **T5.2** `[coding]` Remove fake Apple Pay button or enable via Payment Element wallets | `frontend/src/components/checkout/ApplePayButton.tsx`, `frontend/src/components/checkout/GooglePayButton.tsx` | no `TEST_SIGNATURE`; wallets (if kept) work via Stripe. Run: `cd frontend && npx tsc --noEmit`
- [ ] **T5.3** `[coding]` Client cart sends only `{productId,variantId,qty}`; show server-quoted totals | `frontend/src/contexts/CartContext.tsx`, `frontend/src/components/checkout/OrderTotalSidebar.tsx` | client never sends prices; UI reflects server quote. Run: `cd frontend && npx tsc --noEmit`

> Dependencies: needs Group 4 endpoints.

## Group 6 — Verification & E2E (gate R1)

- [ ] **T6.1** `[coding]` E2E Playwright: add-to-cart → checkout → pay test card → webhook → order paid + stock decremented | `e2e/checkout.spec.ts`, `playwright.config.ts` | happy path green; totals/inventory correct. Run: `npx playwright test`
- [ ] **T6.2** `[coding]` Security tests: bundle has no service key; price-tamper rejected; RLS denies cross-user order read | `backend/test/security.spec.ts` | all three pass. Run: `cd backend && npx vitest run security`
- [ ] **T6.3** `[devops]` Production build verification: `vite build` output gre`p`ed for secrets; env validation enforced | (CI script) `scripts/verify-no-secrets.sh` | grep finds no secret keys in `dist/`. Run: `bash scripts/verify-no-secrets.sh`

> **Review checkpoint R1** (review-agent + sa-agent): all spec §7 acceptance criteria PASS → unblock Priority 2.

---

## Dependency graph

```
Group0(owner) ─► Group1 ─► Group2 ─┐
                         └► Group3 ─┼─► Group4 ─► Group5 ─► Group6 ─► R1
                                    │
                Group2 & Group3 can run in parallel after Group1
```

## Parallelization notes

- After Group 1: Group 2 (frontend de-key/route cleanup) and Group 3 (infra schema/RLS) run **in parallel** — different files, different roles (`coding` vs `devops`).
- Group 4 needs Group 3 (DB) done. Group 5 needs Group 4 (APIs). Group 6 needs Group 5.
- `review-agent` reviews after each group; `sa-agent` specifically reviews Group 3 + Group 4.

## Completion tracking

Mark `[x]` + `> Done.` note per task as the team completes them. Blockers → `[!]` with detail.
