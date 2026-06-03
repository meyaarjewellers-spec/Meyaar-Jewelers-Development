# Priority 2–3 — Implementation Status & Owner Handoff

**Date:** 2026-06-02
**Branch:** `Foundation`
**Scope:** Priority 2 (security & reliability) + Priority 3 (performance) functionality.

---

## What was implemented (code complete + locally verified)

Backend + frontend typecheck clean · **23 unit tests pass** · production build succeeds with **route code-splitting** · bundle has **zero secrets**.

### Priority 2 — Reliability & functionality

| Area | What shipped | Files |
|------|--------------|-------|
| **Transactional email** | Provider abstraction (Resend → Gmail/SMTP → console). Branded **order-confirmation** email sent automatically when the Stripe webhook marks an order paid; **newsletter welcome** email. | `backend/services/email.ts`, `backend/services/fulfillment.ts` |
| **Newsletter capture** | `POST /api/v1/newsletter` persists to `newsletter_subscribers` (idempotent) + welcome email. Wired the footer **Newsletter** form and the **first-visit popup** (no more `console.log`). | `backend/routes/newsletter.ts`, `frontend/.../Newsletter.tsx`, `FirstTimePopup.tsx` |
| **Persisted reviews** | `GET/POST /api/v1/products/:id/reviews`. **Verified-purchase** is computed server-side (authenticated user with a *paid* order containing the product) — no longer hard-coded `true`. PDP reviews load + submit through the API. | `backend/routes/reviews.ts`, `frontend/.../CustomerReviews.tsx` |
| **Auth + account** | `requireAuth` middleware (verifies Supabase JWT). `GET /api/v1/orders/mine` returns the signed-in user's order history; the **My Account** page renders it. | `backend/middleware/auth.ts`, `backend/routes/orders.ts`, `frontend/.../Settings.tsx` |
| **Validation/limits** | Zod validation + strict rate-limiting on every new endpoint; helmet/CORS already global from P1. | `backend/middleware/*` |
| **Structured logging** | All backend `console.*` routed through the `logger`; client debug noise removed. | `backend/logger.ts`, various |
| **CI/CD** | GitHub Actions: typecheck (frontend+backend) → test → build → verify-no-secrets, plus gitleaks + `npm audit`. | `.github/workflows/ci.yml` |
| **Schema** | `reviews` + `newsletter_subscribers` tables (Drizzle) + migration `0001` + RLS (reviews public-read approved; newsletter server-only). | `shared/schema.ts`, `backend/migrations/0001_*.sql`, `rls/policies.sql` |

### Priority 3 — Performance

| Area | What shipped | Files |
|------|--------------|-------|
| **Compression** | gzip/brotli on all responses. | `backend/index.ts` |
| **Static caching** | Hashed assets `Cache-Control: immutable, 1yr`; `index.html` `no-cache`. | `backend/vite.ts` |
| **Code-splitting** | Every route lazy-loaded with Suspense; main bundle **488 KB → 341 KB** (gzip 147→110 KB), routes load on demand. | `frontend/src/App.tsx` |
| **Image lazy-load** | Product imagery `loading="lazy"` + explicit aspect ratios (done in the UI pass). | `ProductCard.tsx`, etc. |

---

## ⚠️ Owner steps to make these live

These need your accounts (code is ready and waiting):

1. **Apply the new migration + RLS** to your Supabase (after the P1 schema):
   ```bash
   npm run db:push                                      # applies 0000 + 0001
   psql "$DATABASE_URL" -f backend/migrations/rls/policies.sql
   ```
   Without this, `/newsletter`, `/reviews`, and `/orders/mine` return a handled 500/empty (the UI degrades gracefully).

2. **Email provider** — set ONE in `.env.server`:
   - `RESEND_API_KEY` (recommended; verify your sending domain at resend.com), or
   - `GMAIL_APP_PASSWORD` (dev fallback).
   - Also set `EMAIL_FROM`. Until one is set, emails are logged, not sent.

3. **(Optional) Sentry** — set `SENTRY_DSN` to enable error monitoring (scaffold reads it; wire the SDK when you're ready).

4. **CI secrets** — none required for the default workflow; gitleaks uses the built-in `GITHUB_TOKEN`. Add a deploy job when you choose a host.

5. **Performance (infra)** — code-level perf is done. Still owner/infra:
   - Put a **CDN** (Cloudflare/CloudFront) in front of static + images.
   - **Optimize source images** to WebP/AVIF + responsive sizes (the originals are 150–350 KB JPdGs; lazy-loading + caching are in, re-encoding is a build/asset task) and shrink the 324 KB favicon.

---

## New API surface (P2)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/newsletter` | none (rate-limited) | Subscribe an email |
| GET | `/api/v1/products/:id/reviews` | none | Approved reviews + average |
| POST | `/api/v1/products/:id/reviews` | optional | Submit a review (verified-purchase aware) |
| GET | `/api/v1/orders/mine` | **required** | Authenticated user's order history |

---

## Verification (local)
```bash
npm run check && npm run check:backend && npm test   # types + 23 tests
npm run build && npm run verify:no-secrets           # build + secret scan
```
Endpoint smoke test (server running): invalid newsletter email → 400, `/orders/mine` unauth → 401, reviews bad id → 400, homepage → 200. All pass.

## Still ahead (Priority 4–6)
SEO (SSR/structured data/sitemap), full analytics (GA4 funnel), advanced CRO (cart-abandonment automation, wishlist persistence, upsell engine), admin dashboard, and the infra items above. See [09-MASTER-ROADMAP.md](09-MASTER-ROADMAP.md).
