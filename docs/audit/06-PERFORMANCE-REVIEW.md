# Performance Review

Covers page speed, asset/image optimization, data-fetching patterns, bundle, caching, and backend performance/bottlenecks.

Effort: **S** <1d · **M** 1–3d · **L** 4–8d.

---

## Frontend

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| PERF-F1 | Unoptimized images | High | Raw PNG/JPG assets, many in the hundreds of KB; favicon alone is **324 KB** ([public/favicon.png](../../frontend/public/favicon.png)). No WebP/AVIF, no responsive `srcset`, no width/height (CLS risk). Duplicate asset trees (`frontend/assets` + `frontend/src/assets`). | Convert to WebP/AVIF, generate responsive sizes, set explicit dimensions, lazy-load below the fold, serve via CDN. Shrink favicon to a 32–48px icon. | M |
| PERF-F2 | No CDN / edge caching | High | Assets and app served from a single origin (Express/Replit). | Put static assets + images behind a CDN (Cloudflare/CloudFront); cache-control headers. | M |
| PERF-F3 | Client-side data fetching waterfalls | Medium | Pages fetch Supabase directly on mount (e.g., category data), some via raw clients created per-call (`useCategoryData` builds a client with the service key). No SSR means blank-then-pop. | Server API + caching; create the Supabase client once; consider SSR for first paint. | M |
| PERF-F4 | TanStack Query underused | Medium | Provider is mounted but several pages use ad-hoc `useEffect` fetches without caching/dedup. | Route data through React Query with sane `staleTime`. | S |
| PERF-F5 | No code-splitting per route | Medium | All pages imported eagerly in [App.tsx](../../frontend/src/App.tsx). Single large bundle. | `React.lazy` + route-level `Suspense`. | S |
| PERF-F6 | 47 shadcn/ui components bundled | Low | Many UI primitives present; ensure tree-shaking and that unused ones aren't shipped. | Verify bundle with `vite build --report`; drop unused. | S |
| PERF-F7 | Google Pay script loaded globally | Low | [index.html:12](../../frontend/index.html#L12) loads `pay.js` on every page, even non-checkout. | Load payment SDKs only on checkout. | S |
| PERF-F8 | No font preloading strategy beyond preconnect | Low | Google Fonts via stylesheet; `display=swap` is set (good) but consider self-hosting for speed/privacy. | Self-host fonts or preload key weights. | S |

## Backend

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| PERF-B1 | In-memory storage won't scale past one instance | High | C7 — `MemStorage` is per-process; horizontal scaling impossible; data lost on restart. | Postgres-backed storage. | L |
| PERF-B2 | No caching layer | Medium | Catalog reads hit the DB every time; no Redis/CDN/HTTP caching for product/category data. | Cache catalog responses (HTTP cache + optional Redis); ISR if Next.js. | M |
| PERF-B3 | Stripe Tax call on every estimate | Medium | [routes.ts:128](../../backend/routes.ts#L128) calls Stripe Tax per request with no caching/debounce; adds latency + cost. | Debounce client-side; cache by zip; only finalize tax at payment. | S |
| PERF-B4 | Synchronous external calls in request path | Medium | Email/Stripe calls inline; the contact route mitigates with fire-and-forget but without a queue. | Move side-effects to a queue/worker. | M |
| PERF-B5 | No compression / HTTP caching headers | Low | No `compression` middleware, no `Cache-Control`/`ETag` for static/catalog. | Add gzip/brotli + cache headers. | S |
| PERF-B6 | No connection pooling config | Low | DB access patterns not pooled (no server DB layer yet). | Configure pool (pg/Drizzle) when the server DB layer lands. | S |

## Core Web Vitals risk (pre-fix estimate)

- **LCP:** Poor — large hero images, no CDN, no responsive images, client render.
- **CLS:** At risk — images without dimensions; late-loading content.
- **INP/TBT:** Moderate — single eager bundle; acceptable once split.

> Establish a baseline with Lighthouse/PageSpeed Insights before and after PERF-F1/F2/F5; target LCP < 2.5s, CLS < 0.1, INP < 200ms.

## Priority order

1. **P3:** PERF-F1 (images), PERF-F2 (CDN), PERF-F5 (code-split), PERF-B1 (DB), PERF-B2 (caching).
2. **P3–P4:** PERF-F3/F4, PERF-B3/B4.
3. **Polish:** remaining Low items.
