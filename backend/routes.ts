/**
 * API surface for Meyaar Jewellers. Server-authoritative commerce:
 *   POST /api/v1/checkout/quote   — price preview (server-computed)
 *   POST /api/v1/orders           — create pending order (+inventory reserve)
 *   POST /api/v1/payments/intent  — Stripe PaymentIntent for an order's total
 *   POST /api/v1/stripe/webhook   — source of truth for payment → fulfillment
 *   POST /api/v1/contact          — sanitized contact form
 *   GET  /api/v1/health           — liveness/readiness
 *
 * The legacy raw-card / mock Apple Pay / Google Pay endpoints have been removed;
 * card data is now handled entirely by Stripe Elements in the browser.
 */
import type { Express } from "express";
import { createServer, type Server } from "http";
import { apiLimiter } from "./middleware/security";
import { healthRouter } from "./routes/health";
import { checkoutRouter } from "./routes/checkout";
import { ordersRouter } from "./routes/orders";
import { paymentsRouter } from "./routes/payments";
import { webhookRouter } from "./routes/webhook";
import { contactRouter } from "./routes/contact";
import { newsletterRouter } from "./routes/newsletter";
import { reviewsRouter } from "./routes/reviews";
import { sitemapRouter } from "./routes/sitemap";
import { adminRouter } from "./routes/admin";
import { addressesRouter } from "./routes/addresses";

export async function registerRoutes(app: Express): Promise<Server> {
  const v1 = "/api/v1";

  // Root-level SEO route (must be registered before the SPA catch-all).
  app.use(sitemapRouter);

  // Baseline rate limit across the API (sensitive routes add stricter limits).
  app.use("/api", apiLimiter);

  app.use(v1, healthRouter);
  app.use(v1, checkoutRouter);
  app.use(v1, ordersRouter);
  app.use(v1, paymentsRouter);
  app.use(v1, webhookRouter);
  app.use(v1, contactRouter);
  app.use(v1, newsletterRouter);
  app.use(v1, reviewsRouter);
  app.use(v1, adminRouter);
  app.use(v1, addressesRouter);

  return createServer(app);
}

