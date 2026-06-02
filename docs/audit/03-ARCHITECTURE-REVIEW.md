# Architecture Review

Covers backend architecture, code quality, database design, API design, error handling, logging, and technical debt.

Effort: **S** <1d · **M** 1–3d · **L** 4–8d · **XL** >8d.

---

## Current architecture (as-built)

```
Browser (React SPA, wouter routing, TanStack Query)
   │
   ├──────────────►  Supabase  (DIRECT from client)
   │                 • anon key for products/categories/orders
   │                 • SERVICE-ROLE key for seed/branding/category  ⚠️ C1
   │                 • Auth (email + Google/Apple OAuth)
   │
   └──────────────►  Express server (backend/index.ts)
                     • /api/contact          (Gmail nodemailer)
                     • /api/calculate-tax     (Stripe Tax) ✅
                     • /api/create-payment-intent (raw card → Charges) ⚠️ C3
                     • /api/process-google-pay
                     • /api/validate-apple-pay  (mock) ⚠️ C6
                     • /api/process-apple-pay
                     • storage = MemStorage (in-memory) ⚠️ C7
                     • Vite middleware serves the SPA
```

**Core architectural problem:** there is no server-authoritative application layer. The browser is the application; the "backend" is a thin payment proxy. Business rules (price, discount, tax, inventory, order state) live in the client where they cannot be trusted. The database is reachable directly from the browser.

## Target architecture (recommended)

```
Browser (React SPA)  ──JWT──►  Server API (Express/Node)  ──►  Postgres (Supabase)
                                  • Zod-validated endpoints        • RLS on every table
                                  • server-computed pricing/tax     • migrations (Drizzle)
                                  • order state machine             • real schema (from schema.sql)
                                  • Stripe PaymentIntents + webhook
                                  • inventory reservation/decrement
                                  • transactional email (Resend/SES)
                                  • structured logging + metrics
   Stripe Elements (card data never touches the server) ─────────► Stripe
```

The client keeps reading **public** catalog data via the anon key under RLS (fast, cache-friendly), but **all writes and all money** go through the server.

---

## Backend findings

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| ARCH-B1 | No real API/data layer | Critical | Only payment/contact endpoints exist; no products/orders/inventory API. | Build a server API per target architecture. | XL |
| ARCH-B2 | In-memory storage | Critical | C7 — `MemStorage` loses data on restart. | Replace with Postgres + Drizzle. | L |
| ARCH-B3 | Three conflicting data models | High | C7 — Drizzle `users`, `schema.sql`, live Supabase tables disagree. | Single reconciled schema + migrations. | L |
| ARCH-B4 | Global error handler re-throws after responding | High | [index.ts:59-65](../../backend/index.ts#L59-L65) calls `res.json(...)` then `throw err` → unhandled rejection, possible crash. | Log, respond once, do not re-throw. | S |
| ARCH-B5 | `window` used in server code | High | C6 — [routes.ts:344](../../backend/routes.ts#L344). | Remove browser globals from server. | S |
| ARCH-B6 | Fire-and-forget email with no retry/queue | Medium | [routes.ts:72-116](../../backend/routes.ts#L72) sends email in a detached async IIFE; failures are only logged. | Use a job queue or provider with retries; capture failures. | M |
| ARCH-B7 | No environment/config validation | Medium | Missing env vars degrade silently (`getStripe()` returns null → 500 at request time). | Validate required env at boot; fail fast. | S |
| ARCH-B8 | Single-file route module | Low | All endpoints in one `routes.ts`. | Split into route modules + controllers/services as it grows. | S |

## Database design findings

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| ARCH-D1 | Designed schema not deployed/used | High | [schema.sql](../../backend/schema.sql) is comprehensive and good, but the app writes to different ad-hoc tables. | Deploy a trimmed MVP of this schema; wire the app to it. | L |
| ARCH-D2 | Orders stored as JSONB blob | High | Live `orders.items` is a JSON array — no FK to products, no line-item integrity, no reporting. | Use `orders` + `order_items` (already in schema.sql) with FKs and price snapshots. | M |
| ARCH-D3 | No inventory enforcement | High | `product_inventory` exists on paper; nothing reserves/decrements stock. Oversell risk. | Reserve on checkout, decrement on payment via webhook, release on expiry. | M |
| ARCH-D4 | Denormalized rating fields never maintained | Medium | `products.average_rating`/`total_reviews` exist but no triggers/aggregation. | Maintain via trigger or scheduled job when reviews change. | M |
| ARCH-D5 | No migration tooling applied | Medium | `drizzle-kit` is present; no migrations committed. Schema changes are manual. | Adopt Drizzle migrations as the single change path. | S |

## API design findings

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| ARCH-API1 | Inconsistent response shapes | Medium | Some endpoints return `{error}`, others `{success,message}`, others `{message}`. | Standardize `{ data }` / `{ error: { code, message } }`. | S |
| ARCH-API2 | No versioning | Low | `/api/...` unversioned. | `/api/v1/...`. | S |
| ARCH-API3 | Endpoint naming misleads | Low | `create-payment-intent` doesn't create a PaymentIntent (uses Charges). | Rename when rebuilt. | S |

## Code quality / technical debt

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| ARCH-Q1 | No tests anywhere | High | Zero unit/integration/e2e tests. | Add Vitest (unit) + Playwright (e2e checkout). Gate CI on them. | L |
| ARCH-Q2 | Dead/dev code shipped | Medium | `TodoList` page, `AdminSeed`, `seedDatabase.ts`, duplicate asset folders (`frontend/assets` & `frontend/src/assets`), `CLEANUP.sh`. | Remove dev code from prod; de-dupe assets. | S |
| ARCH-Q3 | Duplicate docs | Low | Same docs at repo root and in `docs/`. | Keep one canonical `docs/`. | S |
| ARCH-Q4 | `any`-typed Supabase client | Medium | [supabase.ts](../../frontend/src/lib/supabase.ts) types client as `any`; loses type safety across all data access. | Generate Supabase types; type the client. | S |
| ARCH-Q5 | Hardcoded business constants in UI | Medium | 10% tax, 10% discount, free-shipping logic embedded in components. | Move to server config / DB. | S |

## Logging & observability

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| ARCH-L1 | `console.*` only | High | No structured logging, no request IDs, no log levels, no aggregation. | Adopt `pino` (structured) + ship to a log service. | M |
| ARCH-L2 | No error monitoring | High | No Sentry/Rollbar; client and server errors are invisible in production. | Add Sentry (client + server). | S |
| ARCH-L3 | Custom log truncates at 80 chars | Low | [index.ts:44](../../backend/index.ts#L44) truncates API logs, hiding detail. | Remove truncation; use structured logs. | S |

---

## Summary

The frontend is a competent SPA; the backend barely exists. The single most valuable architectural move is to **introduce a server-authoritative API + deploy the real schema + enable RLS**, then move pricing, ordering, payment, and inventory behind it. Everything in the security and scalability reports depends on this foundation.
