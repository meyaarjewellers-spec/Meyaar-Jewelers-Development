/**
 * Server-side database client (Drizzle + node-postgres).
 *
 * Connects with DATABASE_URL using the Supabase service role, so server code
 * operates with full authority *behind* the API. Row-Level Security protects
 * the anon (browser) path; the server is the only writer of orders/payments.
 *
 * `db` is lazily created so the app can boot in environments without a database
 * (e.g. local UI work); any query then throws a clear, actionable error.
 */
import pkg from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../shared/schema";
import { env } from "../config/env";

const { Pool } = pkg;

let _pool: pkg.Pool | null = null;
let _db: NodePgDatabase<typeof schema> | null = null;

export function getPool(): pkg.Pool {
  if (_pool) return _pool;
  if (!env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Set it in .env.server to enable database access.",
    );
  }
  const isLocal = env.DATABASE_URL.includes("localhost") || env.DATABASE_URL.includes("127.0.0.1");
  _pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    // Supabase serves CA-signed certificates: require TLS with verification.
    // (Local Postgres typically has no TLS.) If you ever need a custom CA,
    // pass it via ssl.ca rather than disabling verification.
    ssl: isLocal ? false : { rejectUnauthorized: true },
  });
  return _pool;
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (_db) return _db;
  _db = drizzle(getPool(), { schema });
  return _db;
}

/** True when a database connection string is configured. */
export const dbAvailable = (): boolean => Boolean(env.DATABASE_URL);

export { schema };
