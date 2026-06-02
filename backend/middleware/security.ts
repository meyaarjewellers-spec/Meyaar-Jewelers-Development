/** Security middleware: helmet headers, CORS allow-list, and rate limiters. */
import type { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "../config/env";

const isProd = env.NODE_ENV === "production";

/** Apply baseline security headers + CORS. Call before mounting routes. */
export function applySecurity(app: Express): void {
  app.use(
    helmet({
      // The SPA + Vite dev server need a relaxed CSP in dev; lock down in prod.
      contentSecurityPolicy: isProd ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    const allowed = env.CORS_ALLOWED_ORIGINS;
    // In production, only allow configured origins. In dev, reflect origin.
    if (!isProd || (origin && allowed.includes(origin))) {
      if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });
}

/** General API limiter: 100 requests / 15 min / IP. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: "Too many requests, please try again later." } },
});

/** Tighter limiter for sensitive/expensive endpoints (payments, tax, contact). */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: "Too many requests, please slow down." } },
});
