# SEO Review

Covers metadata, structured data, links/redirects, sitemap, robots, internal linking, product/collection SEO, and page-speed-for-ranking.

Effort: **S** <1d · **M** 1–3d · **L** 4–8d.

---

## Root cause: client-rendered SPA with one static `<head>`

The app is a Vite React SPA using `wouter` with **no SSR/SSG and no dynamic head management** (`react-helmet` is not installed). Every route serves the same [index.html](../../frontend/index.html): one `<title>` ("Meyaar Jewellers"), one meta description, no Open Graph, no canonical, no structured data. Crawlers that don't execute JS see a near-empty `<div id="root">`. This caps the store's organic potential to near zero.

| ID | Finding | Sev | Detail | Fix | Effort |
|----|---------|-----|--------|-----|--------|
| SEO-1 | No per-page metadata | High | Single static title/description for all routes. Product and category pages can't rank for their terms. | Add dynamic `<head>` per route (react-helmet-async) with unique title/description; ideally adopt SSR/SSG (Next.js or vite-ssg/prerender) for crawlability. | L |
| SEO-2 | No structured data (JSON-LD) | High | No `Product`, `Organization`, `BreadcrumbList`, `Offer`, `AggregateRating`, `LocalBusiness`. No rich results eligibility. | Add JSON-LD: Organization (site-wide), Product+Offer+AggregateRating (PDP), BreadcrumbList, Website+SearchAction. | M |
| SEO-3 | No `sitemap.xml` | High | `public/` has only `favicon.png`. Search engines can't discover product/category URLs. | Generate sitemap (static or server route) including all products/categories; submit to Search Console. | S |
| SEO-4 | No `robots.txt` | Medium | Missing. No crawl directives; dev routes like `/admin/seed`, `/todo` are crawlable. | Add `robots.txt` (allow site, disallow `/admin`, `/checkout`, point to sitemap). | S |
| SEO-5 | No Open Graph / Twitter cards | Medium | Links shared on social/WhatsApp render with no image/title/description. | Add OG + Twitter tags per page (esp. products). | S |
| SEO-6 | No canonical URLs | Medium | Risk of duplicate-content dilution; no canonical tags. | Add `<link rel="canonical">` per page. | S |
| SEO-7 | Weak internal linking & no breadcrumbs | Medium | No breadcrumb trails; few cross-links between products/categories. | Breadcrumbs (UX-N2), related products links, category cross-links. | S |
| SEO-8 | Non-descriptive URLs & image filenames | Medium | Products use `/product/:id` (UUID) not slugs; images named `Place_the_jewelry_on_a_linen_or-0 (11)_...jpg` with no alt strategy. | Use slug URLs (`/product/gold-layered-necklace`); descriptive filenames; meaningful `alt` text. | M |
| SEO-9 | Product/collection SEO fields unused | Medium | `products.meta_title/meta_description/meta_keywords` exist in schema but aren't deployed/used. | Populate and render per-product meta. | M |
| SEO-10 | Page speed (ranking factor) | Medium | Large unoptimized PNG/JPG assets (e.g., 324 KB favicon, multi-hundred-KB hero images), no responsive images, no CDN. See Performance review. | Optimize images (WebP/AVIF, responsive `srcset`), CDN, lazy-load. | M |
| SEO-11 | No analytics/Search Console wiring | Medium | Can't measure or submit. See Analytics review. | GA4 + Search Console + Bing Webmaster. | S |
| SEO-12 | Missing semantic/heading structure audit | Low | Verify single H1 per page, logical heading order. | Audit + fix headings. | S |

## Broken links / redirects

- No redirect strategy (e.g., `/shop` → category, trailing-slash handling, old→new URL maps). With UUID→slug migration (SEO-8) you'll need 301s.
- 404 handling exists ([not-found.tsx](../../frontend/src/pages/not-found.tsx)) but returns 200 (SPA) — search engines need a real 404 status for non-existent products. **Fix:** server returns proper 404 for unknown product/category slugs (requires SSR or a server route).

## Recommended SEO foundation (Priority 4)

1. Decide rendering strategy — **strongest option: migrate to Next.js** (SSR/ISR) for true crawlable per-page SEO; lighter option: `vite-plugin-ssr`/prerendering for static routes + react-helmet-async for the rest.
2. Per-page meta + canonical + OG/Twitter.
3. JSON-LD (Organization, Product, Breadcrumb, Website/SearchAction).
4. Slug URLs + 301 map + proper 404 status.
5. sitemap.xml + robots.txt + Search Console.
6. Image optimization + CDN (overlaps Performance).
7. Internal linking + breadcrumbs.

> Note: SEO-1 (rendering strategy) is the gating decision. If organic search is a primary acquisition channel, prioritize the Next.js migration during Priority 3–4; if not, prerender + helmet is a cheaper interim.
