/**
 * GET /sitemap.xml — dynamic sitemap built from the live catalog.
 * Mounted at the app root (NOT under /api/v1) and BEFORE the SPA catch-all.
 * Degrades to static pages if the database is unavailable.
 */
import { Router } from "express";
import { eq } from "drizzle-orm";
import { getDb, dbAvailable } from "../db";
import { products, categories } from "../../shared/schema";
import { env } from "../config/env";
import { log } from "../logger";

export const sitemapRouter = Router();

const BASE = (env.APP_URL || "https://meyaarjewellers.com").replace(/\/$/, "");

const STATIC_PATHS = ["/", "/about", "/contact", "/shop/necklaces", "/shop/bracelets", "/shop/earrings", "/return-policy", "/shipping-policy", "/privacy-policy", "/terms-conditions"];

function urlEntry(path: string, lastmod?: string, priority = "0.7"): string {
  return `  <url><loc>${BASE}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<priority>${priority}</priority></url>`;
}

sitemapRouter.get("/sitemap.xml", async (_req, res) => {
  const entries: string[] = STATIC_PATHS.map((p) => urlEntry(p, undefined, p === "/" ? "1.0" : "0.8"));

  if (dbAvailable()) {
    try {
      const db = getDb();
      const [cats, prods] = await Promise.all([
        db.select({ slug: categories.slug }).from(categories).where(eq(categories.isActive, true)),
        db
          .select({ id: products.id, updatedAt: products.updatedAt })
          .from(products)
          .where(eq(products.isActive, true)),
      ]);
      for (const c of cats) if (!STATIC_PATHS.includes(`/shop/${c.slug}`)) entries.push(urlEntry(`/shop/${c.slug}`, undefined, "0.8"));
      for (const p of prods) entries.push(urlEntry(`/product/${p.id}`, p.updatedAt?.toISOString().slice(0, 10), "0.6"));
    } catch (err) {
      log(`sitemap DB query failed; serving static paths only: ${(err as Error).message}`, "sitemap");
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
});
