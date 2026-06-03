/**
 * Optional Supabase JWT auth. If a valid bearer token is present, `req.userId`
 * is set to the authenticated user's id; otherwise the request proceeds as a
 * guest. Token verification uses a server-side Supabase admin client.
 */
import type { Request, Response, NextFunction } from "express";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

let _admin: SupabaseClient | null = null;
function admin(): SupabaseClient | null {
  if (_admin) return _admin;
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  _admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return next();

  const client = admin();
  if (!client) return next();

  try {
    const { data, error } = await client.auth.getUser(token);
    if (!error && data.user) req.userId = data.user.id;
  } catch {
    // Invalid token → treat as guest; do not block the request.
  }
  next();
}

/** Require a valid Supabase JWT; 401 otherwise. Sets req.userId. */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: { message: "Authentication required" } });
    return;
  }
  const client = admin();
  if (!client) {
    res.status(503).json({ error: { message: "Auth is not configured" } });
    return;
  }
  try {
    const { data, error } = await client.auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({ error: { message: "Invalid or expired session" } });
      return;
    }
    req.userId = data.user.id;
    next();
  } catch {
    res.status(401).json({ error: { message: "Invalid or expired session" } });
  }
}
