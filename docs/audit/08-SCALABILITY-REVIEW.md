# Scalability & DevOps Review

Covers deployment architecture, CI/CD, environment management, backups, monitoring, alerting, logging, infrastructure scalability, and disaster recovery.

Effort: **S** <1d · **M** 1–3d · **L** 4–8d.

---

## Current state

- **Hosting:** Replit ([.replit](../../.replit)) — `deploymentTarget = "autoscale"`, single `npm run start` process serving API + SPA via Express. Port 5000 in Replit, 3000 locally.
- **CI/CD:** None. No `.github/workflows`, no pipeline, no automated tests/lint/build gates.
- **Containers:** None (no Dockerfile).
- **Environments:** Single `.env.local`; no dev/staging/prod separation; server + client secrets mixed.
- **State:** In-memory (`MemStorage`) for server; Supabase for data (managed Postgres — the one scalable piece).
- **Observability:** `console.log` only; no metrics, no error tracking, no uptime monitoring, no alerting.
- **Backups/DR:** Undefined (relies implicitly on Supabase defaults).

## Scalability findings

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| OPS-S1 | Stateful single-instance server | High | `MemStorage` (C7) makes the server non-horizontally-scalable and data ephemeral. | Stateless server + Postgres + (optional) Redis for sessions/cache. | L |
| OPS-S2 | No CDN / static offload | High | Origin serves all assets/images (PERF-F2). | CDN in front of static + images. | M |
| OPS-S3 | Direct client→DB coupling limits control | Medium | Client hits Supabase directly; rate limits, caching, and scaling policy can't be centrally enforced. | Server API mediates DB; cache + rate-limit there. | M |
| OPS-S4 | No autoscaling policy / capacity plan | Medium | Replit autoscale is a black box; no defined limits/targets. | Define target infra (see below) with autoscaling + health checks. | M |

## CI/CD & quality gates

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| OPS-CI1 | No pipeline | High | No automated build/test/lint/deploy. Manual deploys are error-prone. | GitHub Actions: install→typecheck→lint→test→build→deploy; required checks on PRs. | M |
| OPS-CI2 | No tests to gate on | High | ARCH-Q1. | Add Vitest + Playwright; run in CI. | L |
| OPS-CI3 | No secret scanning / dependency audit in CI | Medium | Secrets already leaked (C5); no guard against recurrence. | gitleaks + `npm audit`/Dependabot in CI. | S |
| OPS-CI4 | No lint/format config enforced | Low | No ESLint/Prettier config committed. | Add ESLint + Prettier; enforce in CI. | S |

## Environment management

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| OPS-E1 | No env separation | High | One env; prod testing risk; no staging. | dev / staging / prod with separate Supabase projects + Stripe (test/live) + env files. | M |
| OPS-E2 | Mixed client/server secrets | High | SEC-S2 — `VITE_` and server secrets together. | Split env files; only public values get `VITE_`. | S |
| OPS-E3 | No config validation at boot | Medium | ARCH-B7. | Validate env on startup; fail fast. | S |

## Monitoring, alerting, logging

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| OPS-M1 | No error monitoring | High | ARCH-L2 — invisible production errors. | Sentry (client+server) with alerting. | S |
| OPS-M2 | No uptime/health monitoring | High | No `/health` endpoint, no uptime checks, no alerts. | Add `/health`; uptime monitor (BetterStack/Pingdom) + on-call alerts. | S |
| OPS-M3 | No structured logging/aggregation | Medium | ARCH-L1. | `pino` → log aggregator (Logtail/Datadog). | M |
| OPS-M4 | No business/payment alerting | Medium | Failed payments, webhook failures, low stock go unnoticed. | Alerts on payment/webhook failures, low inventory. | M |

## Backups & disaster recovery

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| OPS-DR1 | No documented backup strategy | High | Relies on Supabase defaults; no tested restores, no PITR plan documented. | Enable/verify Supabase PITR + scheduled backups; document RPO/RTO; test restores. | S |
| OPS-DR2 | No DR runbook | Medium | No documented recovery for DB loss, key compromise, or provider outage. | Write DR runbook (restore, key rotation, failover). | M |
| OPS-DR3 | No data export / portability | Low | No way to export catalog/orders for migration or audit. | Add export tooling. | S |

## Recommended target infrastructure

Two viable directions — pick based on the SEO rendering decision (SEO-1) and operational appetite:

**Option A — Managed PaaS (fastest, recommended for MVP):**
- Frontend+SSR on **Vercel** (if migrating to Next.js) or static SPA on Vercel/Netlify + a small API service.
- **Supabase** for Postgres + Auth + Storage (already in use), with RLS, PITR, and proper service-key handling server-side.
- **Cloudflare** CDN/WAF in front; **Stripe** for payments; **Resend/Postmark** for email; **Sentry** + uptime monitor.
- CI/CD via GitHub Actions → Vercel/Supabase.

**Option B — AWS (more control, higher ops cost):**
- Frontend on S3+CloudFront (or Amplify Hosting); API on Lambda/API Gateway or ECS Fargate; RDS Postgres or keep Supabase; Secrets Manager; CloudWatch + alarms; WAF. Aligns with the org AWS security guidelines but is heavier than this store needs at launch.

> Recommendation: **Option A** to launch; revisit AWS only if scale/compliance later demands it.

## Priority order

1. **P2:** OPS-E1/E2/E3, OPS-M1/M2, OPS-DR1, OPS-CI1/CI2/CI3.
2. **P3:** OPS-S1/S2/S3, OPS-M3/M4, OPS-DR2.
3. **Polish:** OPS-CI4, OPS-S4, OPS-DR3.
