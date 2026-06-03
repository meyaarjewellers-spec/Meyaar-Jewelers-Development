/**
 * Centralized, validated environment configuration for the server.
 *
 * Responsibilities:
 *  1. Load server env from `.env.server` (canonical) with `.env.local` as a
 *     legacy fallback during the migration away from the old mixed file.
 *  2. Refuse to expose secrets to the browser: any `VITE_`-prefixed variable
 *     whose name or value looks like a secret is a hard error in production
 *     (and a loud warning in development).
 *  3. Provide a single typed `env` object so the rest of the server never
 *     reads `process.env` ad hoc, and fails fast on misconfiguration.
 *
 * Run standalone to validate without booting the app:
 *     npx tsx backend/config/env.ts --check
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

// Canonical server secrets first, legacy mixed file as fallback (does not
// override values already set). `.env.local` is being retired.
dotenv.config({ path: path.join(repoRoot, ".env.server") });
dotenv.config({ path: path.join(repoRoot, ".env.local") });

const isProd = process.env.NODE_ENV === "production";

/**
 * Detect `VITE_`-prefixed variables that carry secret material. Such values are
 * compiled into the public client bundle by Vite and must never hold secrets.
 */
export function detectViteSecretLeaks(source: NodeJS.ProcessEnv = process.env): string[] {
  const secretNamePattern = /(service[_-]?role|secret|password|private[_-]?key|webhook_secret)/i;
  const secretValuePattern = /^(sk_live_|sk_test_|whsec_|rk_live_|rk_test_)/;
  const offenders: string[] = [];
  for (const [key, value] of Object.entries(source)) {
    if (!key.startsWith("VITE_")) continue;
    if (secretNamePattern.test(key) || (value && secretValuePattern.test(value))) {
      offenders.push(key);
    }
  }
  return offenders;
}

/** Required only in production; optional (warn) in development. */
const requiredInProd = (label: string) =>
  z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      if (isProd && (!val || val.trim() === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${label} is required in production` });
      }
    });

const centsSchema = (fallback: number) =>
  z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? Number.parseInt(v, 10) : fallback))
    .pipe(z.number().int().nonnegative());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z
    .string()
    .optional()
    .transform((v) => (v ? Number.parseInt(v, 10) : 3000))
    .pipe(z.number().int().positive()),

  // Database / Supabase (server)
  DATABASE_URL: requiredInProd("DATABASE_URL"),
  SUPABASE_URL: requiredInProd("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: requiredInProd("SUPABASE_SERVICE_ROLE_KEY"),

  // Stripe (server)
  STRIPE_SECRET_KEY: requiredInProd("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: requiredInProd("STRIPE_WEBHOOK_SECRET"),

  // Email (Gmail for dev, Resend recommended for production)
  GMAIL_USER: z.string().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // Public base URL (used in email links / redirects)
  APP_URL: z.string().optional(),

  // Observability (optional)
  SENTRY_DSN: z.string().optional(),

  // Commerce config (integer cents)
  SHIPPING_FLAT_RATE_CENTS: centsSchema(900),
  SHIPPING_FREE_THRESHOLD_CENTS: centsSchema(10_000),
  DEFAULT_CURRENCY: z.string().default("usd"),

  // CORS
  CORS_ALLOWED_ORIGINS: z
    .string()
    .optional()
    .transform((v) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [])),
});

export type Env = z.infer<typeof envSchema>;

interface ValidationResult {
  env?: Env;
  errors: string[];
  warnings: string[];
}

function runValidation(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1) Hard safety check: no secret may be VITE_-prefixed.
  const leaks = detectViteSecretLeaks();
  if (leaks.length > 0) {
    const msg = `Secret(s) exposed to the client bundle via VITE_ prefix: ${leaks.join(", ")}. ` +
      `Move these to .env.server WITHOUT the VITE_ prefix.`;
    if (isProd) errors.push(msg);
    else warnings.push(`⚠️  ${msg}`);
  }

  // 2) Schema validation.
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const line = `${issue.path.join(".") || "(env)"}: ${issue.message}`;
      // In dev, missing prod-required values are warnings, not errors.
      if (isProd) errors.push(line);
      else warnings.push(`⚠️  ${line}`);
    }
  }

  return { env: parsed.success ? parsed.data : undefined, errors, warnings };
}

const result = runValidation();

if (result.errors.length > 0) {
  console.error("❌ Invalid server environment:\n  - " + result.errors.join("\n  - "));
  // Fail fast: never boot a misconfigured production server.
  throw new Error("Environment validation failed");
}
if (result.warnings.length > 0) {
  console.warn("Environment warnings:\n  - " + result.warnings.join("\n  - "));
}

/** Validated, typed environment. Import this instead of reading process.env. */
export const env: Env = result.env ?? (envSchema.parse({ ...process.env }) as Env);

// Standalone check mode: `npx tsx backend/config/env.ts --check`
const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (invokedDirectly || process.argv.includes("--check")) {
  if (result.errors.length === 0) {
    console.log("✅ Environment OK" + (result.warnings.length ? " (with warnings)" : ""));
    process.exit(0);
  } else {
    process.exit(1);
  }
}
