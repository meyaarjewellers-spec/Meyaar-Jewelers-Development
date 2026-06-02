import { defineConfig } from "drizzle-kit";

// DATABASE_URL is required for `push`/`migrate` (live DB ops). For `generate`
// (offline SQL generation) a placeholder is fine — no connection is made.
const url = process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/placeholder";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set — OK for `drizzle-kit generate`, required for `push`/`migrate`.");
}

export default defineConfig({
  out: "./backend/migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url },
});
