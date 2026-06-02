# Security Report

Maps findings to OWASP categories. Critical items C1–C7 are detailed in [01-CRITICAL-ISSUES.md](01-CRITICAL-ISSUES.md); this report covers the full security posture including authentication, authorization, API, data exposure, secrets, payments, input validation, rate limiting, and session management.

Effort: **S** <1d · **M** 1–3d · **L** 4–8d · **XL** >8d.

---

## 1. Authentication

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| SEC-A1 | Dead plaintext-password user table | High | [shared/schema.ts:9](../../shared/schema.ts#L9) stores `password` as plaintext `text`; [storage.ts](../../backend/storage.ts) never hashes. Unused but dangerous if ever wired up. | Delete the backend user/password model; auth is Supabase's responsibility (it hashes + manages sessions). | S |
| SEC-A2 | No email verification gate | Medium | Supabase `signUp` is called but nothing enforces `email_verified` before checkout/account actions. | Require verified email for account orders; allow guest checkout separately. | S |
| SEC-A3 | OAuth redirect hardcoded to checkout | Low | [AuthContext.tsx:100,111](../../frontend/src/contexts/AuthContext.tsx#L100) always redirects to `/checkout-method`. Breaks "sign in from header" journeys. | Pass through a `returnTo` param. | S |

## 2. Authorization

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| SEC-Z1 | **No Row-Level Security** | Critical | All DB access is client-side with the anon key (or worse, the service key). Without RLS, the anon key can read/write any row — any user can read other users' orders. | Enable RLS on every table; policies so users see only their own orders/addresses; products/categories read-only public. | L |
| SEC-Z2 | Public admin route | Critical | `/admin/seed` (C6) — no role check. | Remove from prod or gate behind server-verified admin role. | S |
| SEC-Z3 | No role enforcement | High | `schema.sql` defines `user_role` enum + `user_roles` table, but nothing checks roles anywhere. | Implement role checks server-side for any admin/vendor action. | M |

## 3. API security

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| SEC-API1 | No authentication on any API endpoint | High | All `/api/*` routes in [routes.ts](../../backend/routes.ts) are unauthenticated. Anyone can hit `/api/create-payment-intent`, `/api/calculate-tax`, `/api/contact`. | Require a valid Supabase JWT (verify server-side) for state-changing calls; keep tax/contact rate-limited. | M |
| SEC-API2 | No rate limiting anywhere | High | No `express-rate-limit` or equivalent. `/api/contact` can be used to spam your inbox / Stripe Tax can be abused for cost. | Add IP-based rate limiting + per-endpoint quotas; CAPTCHA on contact. | S |
| SEC-API3 | No CORS / security headers | High | No `helmet`, no CORS policy, no CSP, no HSTS. The Vite dev server serves everything. | Add `helmet`, a strict CSP, HSTS, and a locked-down CORS origin in production. | S |
| SEC-API4 | No request body size limits / schema validation | Medium | `express.json()` with no limit; endpoints destructure `req.body` without schema validation (Zod is a dependency but unused at the API boundary). | Add body size limits + Zod validation on every endpoint. | M |
| SEC-API5 | Error messages leak internals | Medium | Endpoints return `error.message` directly (e.g. [routes.ts:181](../../backend/routes.ts#L181)); the global handler **re-throws after responding** ([index.ts:64](../../backend/index.ts#L64)), which crashes the request lifecycle. | Return generic client messages; log details server-side; never `throw` after `res.send`. | S |

## 4. Data exposure

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| SEC-D1 | Service key → full DB exposure | Critical | C1. | See C1. | M |
| SEC-D2 | Customer PII readable via anon key (no RLS) | Critical | Orders contain names, emails, addresses; without RLS the anon key reads them all. | RLS (SEC-Z1). | L |
| SEC-D3 | `serviceAccountKey.json` (Firebase/GCP) present in working tree | High | Legacy Firebase service-account private key file at repo root. Gitignored now, but a live private key sitting on disk and referenced by old tooling. | Confirm it's unused, delete it, and **rotate/disable** that GCP service account. | S |
| SEC-D4 | Verbose `console.log` of secrets-adjacent state | Low | [supabase.ts](../../frontend/src/lib/supabase.ts) logs init details to the browser console. | Remove noisy logs in production builds. | S |

## 5. Secret management

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| SEC-S1 | Secrets in git history | Critical | C5. | Rotate + scrub history + gitleaks pre-commit. | S |
| SEC-S2 | Secrets mixed client/server in one `.env.local` | High | Server secrets (`STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) live alongside `VITE_` client vars, inviting accidental exposure. | Split: server `.env` (never `VITE_`) vs client `.env` (only safe public values: anon key, publishable Stripe key). | S |
| SEC-S3 | `GMAIL_APP_PASSWORD` for transactional email | Medium | Gmail app password ([routes.ts:16](../../backend/routes.ts#L16)) is fragile and rate-limited; not production email infra. | Move to a transactional provider (Resend/SES/Postmark) with a verified domain. | M |

## 6. Payment processing

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| SEC-P1 | Raw card handling (PCI SAQ D) | Critical | C3. | Stripe Elements + PaymentIntents → SAQ A. | L |
| SEC-P2 | Client-set charge amount | Critical | C2. | Server-authoritative totals. | L |
| SEC-P3 | No Stripe webhook / signature verification | High | Payment settlement is assumed from the synchronous response; no `/api/stripe/webhook` with signature check. | Add webhook endpoint verifying `Stripe-Signature`; drive order state from it. | M |
| SEC-P4 | No idempotency keys | High | Retried payment requests can double-charge. | Pass `idempotencyKey` on PaymentIntent creation. | S |
| SEC-P5 | Fake Apple Pay session | High | C6 — `TEST_SIGNATURE`. | Implement properly or remove. | S–M |

## 7. Input validation (OWASP A03 Injection / A04)

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| SEC-V1 | Contact form HTML injection into email | Medium | [routes.ts:85-93](../../backend/routes.ts#L85) interpolates `name`/`email`/`message` into HTML email with only `\n`→`<br>`. Enables HTML/email-injection and header issues. | Sanitize/escape all fields; validate email; use templating with escaping. | S |
| SEC-V2 | No validation schemas at API boundary | High | SEC-API4. | Zod on every endpoint. | M |
| SEC-V3 | Tax/payment numeric inputs unchecked | Medium | `subtotal`, `amount` parsed without bounds/precision checks ([routes.ts:130,192](../../backend/routes.ts#L130)). | Validate numeric ranges & precision server-side. | S |

## 8. Session management

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| SEC-SM1 | No server sessions; tokens only client-side | Medium | `express-session`/`passport` are dependencies but unused. Supabase JWT lives in browser storage; server never verifies it. | Verify Supabase JWT server-side on protected routes; rely on Supabase session refresh; avoid `localStorage` for sensitive tokens where possible. | M |
| SEC-SM2 | No CSRF strategy | Medium | State-changing POSTs have no CSRF protection (mitigated only by being JSON + future JWT). | Use bearer-token auth (not cookies) for APIs, or add CSRF tokens if cookie-based. | S |

---

## OWASP Top 10 (2021) coverage summary

| OWASP | Status | Worst offender |
|-------|--------|----------------|
| A01 Broken Access Control | ❌ Critical | No RLS, public admin route, client-side authz |
| A02 Cryptographic Failures | ❌ High | Plaintext password column, secrets in history |
| A03 Injection | ⚠️ Medium | Email HTML injection, no input schemas |
| A04 Insecure Design | ❌ Critical | Client-trusted prices, payment≠order |
| A05 Security Misconfiguration | ❌ High | No helmet/CSP/CORS, service key in client, debug routes |
| A06 Vulnerable Components | ⚠️ Review | Run `npm audit`; legacy Stripe Charges API |
| A07 Auth Failures | ⚠️ Medium | No email-verify gate, no server JWT verify |
| A08 Data Integrity Failures | ❌ Critical | No webhook verification, no idempotency, schema drift |
| A09 Logging/Monitoring Failures | ❌ High | `console.log` only, no centralized logs/alerts |
| A10 SSRF | ✅ Low | No obvious SSRF surface |

---

## Priority security sequence

1. **Now (owner):** rotate Stripe + Supabase keys; disable the Firebase service account (SEC-D3).
2. **P1 build:** C1, C2, C3, C4, C6, C7 + SEC-Z1 (RLS) + SEC-S2 (split env).
3. **P2 build:** SEC-API1/2/3/4/5, SEC-P3/P4, SEC-V1/2/3, SEC-SM1/2, SEC-S3.
4. **Continuous:** `npm audit` in CI, gitleaks pre-commit, dependency pinning.
