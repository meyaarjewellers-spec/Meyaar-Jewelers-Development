# Critical Issues Report — Launch Blockers

Each issue below **must** be resolved before the site accepts a real customer or a real payment. Every issue lists severity, business impact, technical impact, recommended solution, and effort.

Effort scale: **S** = <1 day · **M** = 1–3 days · **L** = 4–8 days · **XL** = >8 days.

---

## C1 — Supabase service-role (admin) key exposed in the browser bundle

- **Severity:** Critical
- **Evidence:**
  - [frontend/src/lib/seedDatabase.ts:25](../../frontend/src/lib/seedDatabase.ts#L25)
  - [frontend/src/lib/brandingDatabase.ts:6](../../frontend/src/lib/brandingDatabase.ts#L6)
  - [frontend/src/components/category/useCategoryData.ts:56](../../frontend/src/components/category/useCategoryData.ts#L56)
  - `.env.local` defines `VITE_SUPABASE_SERVICE_ROLE_KEY`. Any `VITE_`-prefixed variable is compiled into the public client bundle by Vite.
- **Business impact:** Total data breach. An attacker reads all customer PII and order history, alters prices, deletes products, or wipes the database. Likely a reportable data-protection breach. Catastrophic to brand trust.
- **Technical impact:** The service-role key bypasses Supabase Row-Level Security entirely. It grants full read/write/delete on every table. It is trivially recoverable from the shipped JavaScript.
- **Recommended solution:** Remove every `VITE_SUPABASE_SERVICE_ROLE_KEY` reference from client code. The service-role key may only ever be used server-side. Move the operations those files perform (category reads, branding reads, seeding) behind server API endpoints that use the anon key + RLS, or a server that holds the service key. Rotate the key after removal (see C5).
- **Effort:** M (removal + re-routing through server). Rotation is S.

---

## C2 — Prices and the charged amount are controlled by the client

- **Severity:** Critical
- **Evidence:**
  - [frontend/src/components/checkout/useCheckout.ts:54-57](../../frontend/src/components/checkout/useCheckout.ts#L54-L57) — `subtotal`, `tax = subtotal*0.1`, `total` all computed in the browser.
  - [useCheckout.ts:64-67](../../frontend/src/components/checkout/useCheckout.ts#L64) — `handleApplyPromo` grants a 10% discount for **any** non-empty string.
  - [useCheckout.ts:149-158](../../frontend/src/components/checkout/useCheckout.ts#L149) — order is written with client-supplied `price` and `totalPrice`.
  - [backend/routes.ts:192](../../backend/routes.ts#L192) — `/api/create-payment-intent` charges `amount` straight from the request body.
- **Business impact:** Direct revenue loss. A customer can buy any item for $0.01, or apply a fake coupon for 10% off every order. Discount logic is unguarded. This is exploitable by anyone with browser dev tools.
- **Technical impact:** There is no server-side source of truth for price. The server trusts the browser for money. Tax is a hardcoded 10% that contradicts the real Stripe Tax endpoint that already exists.
- **Recommended solution:** Server computes the authoritative total: look up each product's price from the database by product ID, validate quantities against inventory, compute discounts from a real `coupon_codes` table, compute tax via the existing Stripe Tax call, and create the PaymentIntent for the server-computed amount. The client sends only product IDs + quantities + address, never prices.
- **Effort:** L

---

## C3 — Raw card data (PAN + CVC) passes through your server

- **Severity:** Critical
- **Evidence:** [backend/routes.ts:190-230](../../backend/routes.ts#L190-L230) — endpoint accepts `cardNumber`, `expiryDate`, `cvc`, calls `stripe.tokens.create({card:{number,...}})` then `stripe.charges.create(...)`.
- **Business impact:** Handling raw card numbers server-side moves you into **PCI-DSS SAQ D** (the most demanding compliance level) and breaches Stripe's API agreement for accounts that aren't PCI Level 1 certified. High risk of Stripe account suspension and legal/financial liability.
- **Technical impact:** Uses the **legacy Charges + Tokens API**, not PaymentIntents. No Strong Customer Authentication (SCA/3-D Secure) — required in many markets and for many cards. No idempotency keys (network retries can double-charge). No card data should ever touch your servers or logs.
- **Recommended solution:** Replace with **Stripe PaymentIntents + Stripe Elements** (or Payment Element). Card details are collected by Stripe's iframe and never reach your server; you only handle a `client_secret` and `payment_intent_id`. Add idempotency keys. This also reduces you to PCI **SAQ A**.
- **Effort:** L

---

## C4 — Payment and order creation are completely disconnected

- **Severity:** Critical
- **Evidence:** Order is created in [useCheckout.ts:149](../../frontend/src/components/checkout/useCheckout.ts#L149) via Supabase insert; the charge happens independently via [backend/routes.ts:190](../../backend/routes.ts#L190). Neither references the other. No `payments` row is ever written (the `payments` table in [schema.sql](../../backend/schema.sql) is unused).
- **Business impact:** You cannot reliably tell which orders are paid. Customers may be charged with no order recorded, or place orders that were never paid. Reconciliation, refunds, and fulfillment are impossible to do safely. The success toast even claims "confirmation sent to your email" — but no email is sent.
- **Technical impact:** No transactional integrity. No `payment_intent_id` stored. No order state machine. No webhook to confirm payment settlement asynchronously.
- **Recommended solution:** One server flow: create order (status `pending`) → create PaymentIntent for the order's server-computed total with `metadata.order_id` → confirm on the client → a **Stripe webhook** marks the order `paid`, writes the `payments` row, decrements inventory, and triggers the confirmation email. Make order+payment writes atomic.
- **Effort:** L

---

## C5 — Secrets committed to git history

- **Severity:** Critical
- **Evidence:** `git log --diff-filter=A -- .env.local` → added in commit `0cc162c`. File contains `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_ANON_KEY`. (It is now gitignored, but history retains it.)
- **Business impact:** If the repo is ever pushed to any remote or shared, these live keys are exposed permanently. Anyone with the Stripe secret key can create charges/refunds; anyone with the service-role key owns the database.
- **Technical impact:** Removing the file from the working tree does not remove it from history. The secret is recoverable from any clone.
- **Recommended solution:** (1) **Rotate all four secrets now** in Stripe and Supabase dashboards — owner action. (2) Scrub history with `git filter-repo` (or BFG) to purge `.env.local`. (3) Confirm `.gitignore` covers it (it does). (4) Add a pre-commit secret scanner (e.g., gitleaks).
- **Effort:** S (rotation + history scrub), owner must do rotation.

---

## C6 — Public admin/dev routes; non-functional Apple Pay

- **Severity:** Critical
- **Evidence:**
  - [frontend/src/App.tsx:46](../../frontend/src/App.tsx#L46) — `/admin/seed` route open to the public; it uses the service-role key to seed/overwrite data.
  - [App.tsx:53](../../frontend/src/App.tsx#L53) — `/todo` developer page shipped to production.
  - [backend/routes.ts:344](../../backend/routes.ts#L344) — Apple Pay validation references `window` (undefined in Node — throws) and returns `signature: "TEST_SIGNATURE"`, a fake merchant session.
- **Business impact:** Anyone can navigate to `/admin/seed` and tamper with catalog/branding data. Apple Pay appears as an option but cannot complete a real payment — lost sales and broken trust at the most critical moment.
- **Technical impact:** No authentication/authorization guard on admin routes. Apple Pay merchant validation is mocked and server code uses a browser global.
- **Recommended solution:** Remove `/todo` and `/admin/seed` from the production router (or gate behind authenticated admin role + server-side checks). Either implement Apple Pay correctly via Stripe (merchant validation with a real certificate) or remove the Apple Pay option until it works.
- **Effort:** S (remove/gate routes) + M (real Apple Pay, or S to remove the button).

---

## C7 — No persistence integrity: in-memory storage + schema drift

- **Severity:** Critical (data integrity)
- **Evidence:**
  - [backend/storage.ts:39](../../backend/storage.ts#L39) — `MemStorage` keeps users in an in-memory `Map`; everything is lost on restart/redeploy.
  - [shared/schema.ts:9](../../shared/schema.ts#L9) — the active Drizzle `users` table stores `password` as plaintext `text`.
  - [backend/schema.sql](../../backend/schema.sql) documents 20+ tables (orders, order_items, payments, inventory…) that are **not** what the app actually writes to. The client writes to ad-hoc `orders`/`guest_orders` tables with a JSONB `items` blob — a shape that does not exist in `schema.sql`.
- **Business impact:** Order data is unstructured and unreliable; no inventory truth; the documented schema gives false confidence. Anything relying on the backend `users` table is ephemeral.
- **Technical impact:** Three competing data models (Drizzle `users`, `schema.sql`, live Supabase tables). No migrations applied. No referential integrity on the data the app actually uses.
- **Recommended solution:** Pick one source of truth. Deploy a reconciled schema (based on `schema.sql`, trimmed to MVP) via migrations, generate Drizzle models from it, and route all reads/writes through the server. Remove `MemStorage` and the plaintext-password table (auth is Supabase's job).
- **Effort:** L

---

## Critical issues summary

| ID | Issue | Severity | Effort |
|----|-------|----------|--------|
| C1 | Admin key in browser bundle | Critical | M |
| C2 | Client-controlled prices/amount | Critical | L |
| C3 | Raw card data through server (PCI) | Critical | L |
| C4 | Payment ⇄ order disconnected | Critical | L |
| C5 | Secrets in git history | Critical | S |
| C6 | Public admin route + fake Apple Pay | Critical | S–M |
| C7 | In-memory storage + schema drift | Critical | L |

**These map to Priority 1 in the master roadmap.**
