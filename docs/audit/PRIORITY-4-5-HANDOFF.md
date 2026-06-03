# Priority 4–5 — Implementation Status & Owner Handoff

**Date:** 2026-06-03
**Branch:** `Foundation`
**Scope:** Priority 4 (SEO) + Priority 5 (analytics & conversion).

Backend + frontend typecheck clean · 23 unit tests pass · build succeeds (code-split) · bundle has zero secrets · sitemap/robots/routes verified 200.

---

## Priority 4 — SEO

| Area | What shipped | Files |
|------|--------------|-------|
| **Per-page metadata** | `react-helmet-async` + a reusable `<Seo>` component sets a unique title, description, canonical, Open Graph and Twitter tags per route (Home, Category, Product, Search, About, Contact, Wishlist…). | `frontend/src/components/Seo.tsx`, `main.tsx`, all key pages |
| **Structured data (JSON-LD)** | `WebSite` + `SearchAction` (Home), `BreadcrumbList` (category + product), and full `Product` + `Offer` + `AggregateRating` on the PDP. `Organization` is in `index.html`. | `Home.tsx`, `CategoryPage.tsx`, `ProductDetail.tsx`, `index.html` |
| **robots.txt** | Allows the store, disallows transactional/private routes, points to the sitemap. | `frontend/public/robots.txt` |
| **Dynamic sitemap.xml** | Server route at `/sitemap.xml` listing static pages **+ every active product and category from the live catalog** (falls back to static paths if the DB is offline). | `backend/routes/sitemap.ts` |
| **a11y/meta (from earlier)** | Zoom re-enabled, theme-color, canonical. | `index.html` |

**Set your domain:** the base URL defaults to `https://meyaarjewellers.com`. Override it by setting `APP_URL` in `.env.server` — sitemap and canonical/OG URLs follow.

### The one remaining SEO lever (owner decision)
This is still a **client-rendered SPA**. Google executes JS so the helmet tags + JSON-LD work, but for maximum crawlability/social-preview reliability the big lever is **server-side rendering** (migrate to Next.js, or add prerendering). That's a larger project flagged as SEO-1 in the audit — recommend deciding before a major marketing push. Everything else (meta, structured data, sitemap, robots, internal linking, breadcrumbs) is done.

---

## Priority 5 — Analytics & Conversion

| Area | What shipped | Files |
|------|--------------|-------|
| **GA4 analytics** | Consent-gated GA4 module — **fully no-op until** `VITE_GA4_ID` is set **and** the visitor accepts the cookie banner. | `frontend/src/lib/analytics.ts` |
| **Consent banner** | GDPR-style accept/decline; only shown when analytics is configured. Choice persisted. | `frontend/src/components/ConsentBanner.tsx` |
| **Ecommerce events** | `page_view` (route change), `view_item` (PDP), `add_to_cart` (cart), `begin_checkout` (cart → checkout), `purchase` (on successful payment). | `App.tsx`, `ProductDetail.tsx`, `CartContext.tsx`, `Checkout.tsx`, `StripeCheckout.tsx` |
| **Wishlist** | `localStorage`-backed wishlist: heart toggle on product cards (fills when saved), header icon with count, and a `/wishlist` page. | `contexts/WishlistContext.tsx`, `ProductCard.tsx`, `Header.tsx`, `pages/Wishlist.tsx` |
| **Upsell/cross-sell** | "You May Also Like" related products already render on the PDP. | (existing) |

---

## ⚠️ Owner steps to make these live

1. **GA4** — create a GA4 property, put its ID in `frontend/.env`:
   ```
   VITE_GA4_ID=G-XXXXXXXXXX
   ```
   Then submit your sitemap in **Google Search Console** (`https://YOURDOMAIN/sitemap.xml`) and verify the property. Until the ID is set, analytics stays off (no cookies, no banner).
2. **Domain** — set `APP_URL` in `.env.server` to your real domain so sitemap/canonical URLs are correct.
3. **(Recommended)** Decide on SSR/Next.js for the SEO ceiling (SEO-1).

## Not yet built (future)
- Cart-abandonment **email automation** (needs the email provider from P2 + a scheduled job/queue) — the events and captured emails are in place to power it.
- Wishlist **server sync** for signed-in users (currently per-device via localStorage).
- A merchandising/admin UI and richer recommendation logic.

## Verification (local)
```bash
npm run check && npm run check:backend && npm test     # types + 23 tests
npm run build && npm run verify:no-secrets             # build + secret scan
curl -s localhost:3000/sitemap.xml | head              # dynamic sitemap
curl -s localhost:3000/robots.txt                      # robots
```
