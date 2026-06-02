# Design — Priority 1: Launch-Blocker Remediation

Architecture, data flow, and security design for the Priority 1 build. Pairs with [spec.md](spec.md).

---

## 1. Target architecture (P1)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BROWSER (React + Vite SPA)                                               │
│                                                                          │
│  Catalog reads ──anon key (RLS, read-only)──────────────► Supabase PG    │
│                                                                          │
│  Cart (client state) ──{productId,variantId,qty}[]──┐                    │
│  Stripe Payment Element (card data stays in iframe)─┼──► Stripe          │
│                                                     │                    │
└─────────────────────────────────────────────────────┼────────────────────┘
                                                      │ JWT (optional)
                                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│ SERVER API (Express, /api/v1)        secrets: STRIPE_SECRET, SVC_ROLE    │
│                                                                          │
│  POST /checkout/quote   ─ recompute price+discount+tax from DB           │
│  POST /orders           ─ create pending order + reserve inventory       │
│  POST /payments/intent  ─ Stripe PaymentIntent(metadata.order_id, idem)  │
│  POST /stripe/webhook    ─ verify sig → mark paid, write payment, stock  │
│  GET  /health                                                            │
│                                                                          │
│  ├─ service-role client ──writes/money──► Supabase PG (RLS-bypassing)    │
│  └─ Stripe SDK ──────────────────────────► Stripe  ◄──webhook────────────┤
└────────────────────────────────────────────────────────────────────────┘

Trust boundary: the browser is never trusted for price, stock, or auth decisions.
```

## 2. Checkout & payment sequence (the core fix)

```
Browser                    Server                     Stripe            Supabase
   │  POST /checkout/quote     │                          │                 │
   │  {items,coupon,address}   │                          │                 │
   │ ─────────────────────────►│ read prices/variants ───────────────────► │
   │                           │ validate coupon ◄──────────────────────────│
   │                           │ Stripe Tax calc ────────►│                 │
   │  signed quote {total,...} │◄─────────────────────────│                 │
   │◄──────────────────────────│                          │                 │
   │  POST /orders {quoteId}   │                          │                 │
   │ ─────────────────────────►│ create order(pending) + reserve stock ───► │
   │  {orderId}                │◄───────────────────────────────────────────│
   │◄──────────────────────────│                          │                 │
   │  POST /payments/intent    │                          │                 │
   │  {orderId}                │ create PI(amount=server total,             │
   │ ─────────────────────────►│   metadata.order_id, idempotencyKey) ────►│
   │  {client_secret}          │◄─────────────────────────│                 │
   │◄──────────────────────────│                          │                 │
   │  confirmPayment(Element)  │                          │                 │
   │ ─────────────────────────────────────────────────────►│ (3DS/SCA)      │
   │                           │   payment_intent.succeeded │                 │
   │                           │◄─── webhook ──────────────│                 │
   │                           │ verify sig; mark order paid;                │
   │                           │ write payments row; decrement stock ──────►│
   │  poll/redirect confirmation (order=paid)              │                 │
```

**Why this is safe:** the amount charged equals the server-computed total bound to `order_id`; the client cannot alter it. The webhook (not the client response) is the source of truth, so a closed tab still completes the order.

## 3. Money math (server-authoritative)

```
subtotal   = Σ (unit_price(productId,variantId) × qty)          // from DB
discount   = applyCoupon(coupon_codes row, subtotal)            // validated rules
taxable    = subtotal − discount + shipping
tax        = stripe.tax.calculations.create(taxable, address)   // existing integration
total      = subtotal − discount + shipping + tax
```
- Store/transmit money as integer cents on the server.
- A quote is short-lived and signed (HMAC or stored `quote` row) so `/orders` and `/payments/intent` can't be fed a fabricated total.

## 4. Database (Drizzle migrations)

- Generate migrations for the MVP subset (spec §5). Decision: use `DECIMAL(12,2)` in Postgres (matches `schema.sql`) but **compute in integer cents in app code**, converting at the boundary.
- `order_items` stores `unit_price` snapshot at order time.
- `product_inventory.quantity_reserved` used for reservation; decrement `quantity_available` on payment success inside a transaction with `SELECT ... FOR UPDATE`.
- Retire `shared/schema.ts` `users` table and `MemStorage`.

## 5. RLS policy design (Supabase)

| Table | anon (client) | authenticated | service-role (server) |
|-------|---------------|---------------|-----------------------|
| categories, products, product_variants, product_images | SELECT (active only) | SELECT | ALL |
| product_inventory | none (or SELECT availability via view) | none | ALL |
| orders, order_items | none | SELECT where `user_id = auth.uid()` | ALL |
| payments | none | none | ALL |
| coupon_codes | none | none | ALL |

Writes to catalog/orders/payments happen only via the server (service-role). Guest orders carry no `user_id`; they're readable only server-side (guest gets a confirmation link/token in P2).

## 6. Secret & env split

```
/.env.server   (NEVER VITE_, server only)
  STRIPE_SECRET_KEY=…              (rotated)
  STRIPE_WEBHOOK_SECRET=…
  SUPABASE_SERVICE_ROLE_KEY=…      (rotated)
  GMAIL_APP_PASSWORD=…  (→ provider in P2)

/frontend/.env  (client-safe public values only)
  VITE_SUPABASE_URL=…
  VITE_SUPABASE_ANON_KEY=…         (rotated)
  VITE_STRIPE_PUBLISHABLE_KEY=…
```
- `git filter-repo --path .env.local --invert-paths` to purge history; re-add `.gitignore` guard; install `gitleaks` pre-commit hook.
- Boot-time env validation (zod) — server refuses to start if a required secret is missing or if a `VITE_`-prefixed secret-looking var is detected.

## 7. Routing / dead-code cleanup

- Remove `/admin/seed` and `/todo` routes from [frontend/src/App.tsx](../../../frontend/src/App.tsx); delete `AdminSeed.tsx`, `TodoList.tsx`, `seedDatabase.ts`, `brandingDatabase.ts` service-key paths (move branding read to anon/RLS or server).
- Remove `window` usage and the four legacy payment endpoints from [backend/routes.ts](../../../backend/routes.ts).
- Fix the global error handler ([backend/index.ts](../../../backend/index.ts)) to not re-throw after responding.

## 8. Security controls added in P1

`helmet`, strict CORS (prod origin), env validation, Zod validation on the new endpoints, Stripe webhook signature verification, idempotency keys, RLS. (Rate limiting, full input-validation sweep, JWT-everywhere, monitoring = P2.)

## 9. Test strategy (P1)

- **Unit:** money math (subtotal/discount/tax/total), coupon validation, cents conversion.
- **Integration:** quote→order→intent happy path with Stripe test mode; webhook handler idempotency (replay same event twice → one decrement).
- **Security tests:** tamper test (client lowers price → server rejects); RLS test (anon reads other user's order → denied); bundle grep for service key.
- **E2E (Playwright):** add-to-cart → checkout → pay 4242 4242 4242 4242 → confirmation shows paid.

## 10. Rollout

1. Stage all P1 changes against a **non-prod Supabase project** + Stripe **test** mode.
2. Verify acceptance criteria (R1) on staging.
3. Apply migrations + RLS to prod; switch Stripe to live only after R1 PASS and owner sign-off.
4. Keep the legacy endpoints removed; monitor webhook delivery in Stripe dashboard.

## 11. Architecture decision records (summary)

- **ADR-1:** Keep Vite SPA for P1; defer SSR/Next.js to P4. *Rationale:* SEO isn't a launch blocker; payment/data safety is.
- **ADR-2:** Server-authoritative pricing via quote→order→intent. *Rationale:* eliminates client price tampering; binds charge to order.
- **ADR-3:** Webhook as source of truth for payment. *Rationale:* resilient to client disconnects; idempotent.
- **ADR-4:** Catalog stays client-read via anon+RLS. *Rationale:* performance/caching without exposing writes.
- **ADR-5:** Supabase Auth only; drop custom password table. *Rationale:* removes plaintext-password risk; less surface.
