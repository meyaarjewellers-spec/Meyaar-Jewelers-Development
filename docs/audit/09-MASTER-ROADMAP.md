# Master Roadmap — Meyaar Jewellers → Production-Grade

Sequenced, dependency-aware plan to take the store from prototype to a secure, scalable, high-converting platform. Each priority lists the finding IDs it resolves (see the domain reports), gated by a review checkpoint.

Effort: **S** <1d · **M** 1–3d · **L** 4–8d · **XL** >8d. Calendar estimates assume one focused engineer (or the agent team) and run faster in parallel.

---

## Priority 0 — Owner actions (today, before any code ships)

These are not code tasks; they need you:

1. **Rotate** the Stripe secret key (Stripe dashboard).
2. **Rotate** the Supabase `service_role` and `anon` keys (Supabase dashboard).
3. **Disable** the legacy Firebase/GCP service account (`serviceAccountKey.json`).
4. Confirm whether the repo was **ever pushed to a remote**; if yes, treat all secrets as public (already rotating).
5. Confirm Stripe is in **test mode** until Priority 1 lands. Do not accept live payments yet.

---

## Priority 1 — Critical: launch blockers (STOP THE BLEEDING)

**Goal:** Eliminate financial-loss and data-breach risks; make money + orders trustworthy.
**Resolves:** C1–C7, SEC-Z1, SEC-Z2, SEC-S1, SEC-S2, ARCH-B2/B3/B4/B5, ARCH-D1/D2/D3, UX-N3.

| # | Workstream | Findings | Effort | Depends on |
|---|-----------|----------|--------|-----------|
| 1.1 | Rotate secrets, scrub `.env.local` from git history, split client/server env, add gitleaks pre-commit | C5, SEC-S1, SEC-S2 | S | P0 |
| 1.2 | Remove service-role key from all client code; remove `/admin/seed` & `/todo` from prod router | C1, C6, UX-N3 | M | 1.1 |
| 1.3 | Stand up server-authoritative API skeleton (Express, Zod, helmet, env validation, `/health`, fixed error handler) | ARCH-B4/B5/B7, SEC-API3 | M | 1.1 |
| 1.4 | Deploy reconciled MVP schema (from `schema.sql`) via Drizzle migrations; generate types; retire `MemStorage` + plaintext users | C7, ARCH-B2/B3, ARCH-D1, SEC-A1 | L | 1.3 |
| 1.5 | Enable Supabase RLS on all tables (public read for catalog; per-user for orders/addresses; writes server-only) | SEC-Z1, SEC-Z2, SEC-D2 | L | 1.4 |
| 1.6 | Server-authoritative pricing/tax/discount: server computes totals from DB prices, validates coupons, calls Stripe Tax | C2, UX-C3, ARCH-Q5 | L | 1.4 |
| 1.7 | Rebuild payments on Stripe PaymentIntents + Payment Element (Elements); idempotency keys; remove raw-card endpoint | C3, SEC-P1/P4, UX-C1 | L | 1.3 |
| 1.8 | Atomic order→payment→inventory flow + Stripe webhook (signature-verified) marks paid, writes `payments`, decrements stock | C4, ARCH-D2/D3, SEC-P3, OPS-1 | L | 1.6, 1.7 |
| 1.9 | Remove/replace fake Apple Pay; keep only working wallets | C6, SEC-P5 | S | 1.7 |

**Review checkpoint R1 (must PASS before P2):** No secret in client bundle; RLS verified; price/charge tamper test fails to under-charge; payment↔order linked with webhook; no raw card data server-side; e2e "happy path" purchase works end-to-end in Stripe test mode.
**Estimated:** ~2–3 weeks.

---

## Priority 2 — Security & reliability

**Goal:** Harden the new backend; make operations observable and trustworthy.
**Resolves:** SEC-API1/2/4/5, SEC-V1/2/3, SEC-SM1/2, SEC-S3, SEC-A2/A3, SEC-D3/D4, ARCH-B6, ARCH-L1/L2, OPS-E1/E2/E3, OPS-M1/M2, OPS-DR1, OPS-CI1/CI2/CI3, ARCH-Q1, UX-3/4/6, OPS-2.

| # | Workstream | Findings | Effort |
|---|-----------|----------|--------|
| 2.1 | JWT verification on protected APIs; authorization checks; email-verify gate; OAuth `returnTo` | SEC-API1, SEC-A2/A3, SEC-SM1/2 | M |
| 2.2 | Rate limiting + body limits + Zod validation on every endpoint; sanitize contact email | SEC-API2/4, SEC-V1/2/3 | M |
| 2.3 | Transactional email provider (Resend/SES); real order-confirmation + newsletter capture | SEC-S3, ARCH-B6, UX-3, UX-6 | M |
| 2.4 | Persisted product reviews with real verified-purchase logic | UX-4 | M |
| 2.5 | Minimal authenticated admin (orders, products, inventory, refunds) | OPS-2 | L |
| 2.6 | Structured logging (pino) + Sentry + `/health` + uptime monitor + alerting | ARCH-L1/L2, OPS-M1/M2 | M |
| 2.7 | Environments (dev/staging/prod), config validation, backups/PITR verified + DR notes | OPS-E1/E2/E3, OPS-DR1 | M |
| 2.8 | CI/CD: GitHub Actions (typecheck/lint/test/build/deploy) + Vitest + Playwright e2e + gitleaks + npm audit | OPS-CI1/2/3, ARCH-Q1 | L |
| 2.9 | Remove `serviceAccountKey.json`, debug logs, dead code; consolidate assets/docs | SEC-D3/D4, ARCH-Q2/Q3 | S |

**Review checkpoint R2:** Pen-test checklist (OWASP) clean of High+; auth/z verified; webhooks + emails reliable; CI green and gating; monitoring receiving events; backup restore tested.
**Estimated:** ~2–3 weeks.

---

## Priority 3 — Performance & scalability

**Resolves:** PERF-F1–F8, PERF-B1–B6, OPS-S1/S2/S3/S4, OPS-M3/M4, OPS-DR2.

| # | Workstream | Findings | Effort |
|---|-----------|----------|--------|
| 3.1 | Image pipeline: WebP/AVIF, responsive `srcset`, dimensions, lazy-load, shrink favicon | PERF-F1, SEO-10 | M |
| 3.2 | CDN for static + images; compression + cache headers | PERF-F2/B5, OPS-S2 | M |
| 3.3 | Route code-splitting; React Query caching; single Supabase client; payment SDKs only on checkout | PERF-F3/F4/F5/F7 | M |
| 3.4 | Backend caching (HTTP/Redis) for catalog; debounce/cache tax; queue side-effects; stateless server | PERF-B1/B2/B3/B4, OPS-S1/S3 | L |
| 3.5 | Log aggregation + business/payment alerting; DR runbook; capacity/autoscale policy | OPS-M3/M4, OPS-DR2, OPS-S4 | M |

**Review checkpoint R3:** Lighthouse LCP<2.5s / CLS<0.1 / INP<200ms on key pages; load test passes target concurrency; server stateless & horizontally scalable.
**Estimated:** ~1.5–2 weeks.

---

## Priority 4 — SEO

**Resolves:** SEO-1–SEO-12, UX-N2, UX-A1, AN-1.

| # | Workstream | Findings | Effort |
|---|-----------|----------|--------|
| 4.1 | **Rendering decision** + implementation: migrate to Next.js (SSR/ISR) *or* prerender + react-helmet-async | SEO-1 | L–XL |
| 4.2 | Per-page meta + canonical + OG/Twitter; fix viewport zoom | SEO-1/5/6, UX-A1 | M |
| 4.3 | JSON-LD: Organization, Product+Offer+AggregateRating, BreadcrumbList, Website/SearchAction | SEO-2 | M |
| 4.4 | Slug URLs + 301 map + real 404 status; descriptive image filenames/alt | SEO-8 | M |
| 4.5 | sitemap.xml + robots.txt + Search Console/Bing; internal linking + breadcrumbs | SEO-3/4/7, UX-N2 | S |
| 4.6 | Populate product/collection meta fields | SEO-9 | M |

**Review checkpoint R4:** Rich Results test passes for Product/Breadcrumb/Org; Search Console indexing healthy; per-page meta verified; 404s return 404.
**Estimated:** ~2–3 weeks (more if Next.js migration).

---

## Priority 5 — Conversion rate optimization

**Resolves:** CRO-1–CRO-12, JWL-1/2/3, UX-1/2/5/P1–P5/S1/S2, AN-2/3/4/5, OPS-3/4.

| # | Workstream | Findings | Effort |
|---|-----------|----------|--------|
| 5.1 | Homepage merchandising (featured products/categories), trust bar, real testimonials | CRO-1/4, UX-1/2/T1 | M |
| 5.2 | Search + faceted filtering/sort | CRO-2, UX-S1/S2 | M |
| 5.3 | PDP: variants, stock signal, specs/certification, shipping/returns reassurance, related/upsell | JWL-1/2, UX-P1–P5, CRO-9 | L |
| 5.4 | Cart drawer + abandoned-cart recovery + first-order incentive popup | CRO-6/10, UX-5 | M |
| 5.5 | Wishlist + account order history/tracking | CRO-11/12 | M |
| 5.6 | GA4 ecommerce events + funnels + consent banner + attribution | AN-2/3/4/5 | M |
| 5.7 | Size/care guides; returns (RMA) flow; shipping options | JWL-3, OPS-3/4 | M |

**Review checkpoint R5:** Full funnel tracked in GA4; key CRO features live + measured; AOV/conversion baseline established.
**Estimated:** ~3–4 weeks.

---

## Priority 6 — Nice-to-have enhancements

**Resolves:** JWL-4/5, AN-6, OPS-DR3, ARCH-API2/API3, UX-A2/A3/A4, plus polish.

- Gifting (wrap, message, gift cards); richer product photography/video.
- Heatmaps/session analytics (Clarity/Hotjar).
- Loyalty/referrals; multi-currency; advanced merchandising/collections.
- API versioning; accessibility deep-pass (skip links, full axe audit); data export tooling.

**Estimated:** ongoing.

---

## Dependency map (critical path)

```
P0 (rotate keys)
  └─► 1.1 env/secrets ─► 1.2 de-key client + remove admin routes
                         └─► 1.3 server API ─► 1.4 schema/migrations ─► 1.5 RLS
                                                 │
                                                 ├─► 1.6 server pricing ─┐
                                                 └─► 1.7 Stripe Elements ─┴─► 1.8 atomic order+webhook+inventory ─► 1.9 wallets
  R1 ─► P2 (harden: authz, validation, email, admin, monitoring, CI, envs)
        R2 ─► P3 (perf/scale) ─► R3 ─► P4 (SEO) ─► R4 ─► P5 (CRO) ─► R5 ─► P6
```

Everything in P3–P6 depends on the P1 server foundation. SEO's rendering decision (4.1) should be made during P3 because it influences hosting/perf.

---

## Build process (Phase 4 of the mission)

Each priority is built by the agent team and **independently reviewed**:

1. `coding-agent` / `devops-agent` implement tasks from the spec.
2. `review-agent` runs an adversarial review → `review.md` (PASS/FAIL).
3. `sa-agent` validates architecture/scalability where infra is involved.
4. Findings are fixed and re-reviewed until PASS, then the checkpoint (R1–R5) gates the next priority.

Detailed specs, architecture diagrams, and task breakdowns for **Priority 1** are in [`.claude/specs/production-readiness/`](../../.claude/specs/production-readiness/).
