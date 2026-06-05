# Priority 6 — Admin Dashboard & Enhancements

**Date:** 2026-06-03
**Branch:** `Foundation`

Backend + frontend typecheck clean · 23 tests pass · build succeeds · bundle secret-free · admin routes auth-gated (verified 401 without a token).

---

## What shipped

### Admin dashboard (the operational backbone — OPS-2)
A role-gated `/admin` dashboard so you can run the store without touching the database.

| Tab | Capabilities |
|-----|--------------|
| **Overview** | Live stats: total orders, revenue (paid), product count, subscribers, pending reviews |
| **Orders** | All orders with customer, item count, total, date; change status (pending → paid → processing → shipped → delivered / cancelled / refunded) |
| **Products** | Inline edit price, toggle Active / Featured, see stock per product |
| **Reviews** | Moderate — approve / reject (pending reviews are held until approved) |
| **Subscribers** | View newsletter list + **Export CSV** |

- **Access control:** every `/api/v1/admin/*` route requires a valid Supabase JWT **and** an email in `ADMIN_EMAILS`. Non-admins get 403; the UI shows a friendly "no access" screen. An "Open Admin Dashboard" button appears on the account page only for admins.
- **Files:** `backend/routes/admin.ts`, `backend/middleware/auth.ts` (`requireAdmin`), `frontend/src/pages/Admin.tsx`, `frontend/src/lib/adminApi.ts`.

### Accessibility
- **Skip-to-content** link (keyboard users jump past the nav) targeting `#main-content`.
- Combined with earlier wins: zoom re-enabled, lazy images, `aria-label`s on icon buttons, semantic landmarks.

---

## ⚠️ Owner steps to use the admin dashboard

1. In `.env.server`, set:
   ```
   ADMIN_EMAILS=your-email@example.com
   SUPABASE_URL=https://<project>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<your service role key>
   ```
   (The service-role key + URL are required so the server can verify JWTs and read/write above RLS. `ADMIN_EMAILS` can be a comma-separated list.)
2. Restart `npm run dev`.
3. **Sign in** to the store with that email (create the account via the normal sign-up if needed), then go to **`/admin`** (or Account → "Open Admin Dashboard").

---

## API added (P6)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/admin/me` | Is the caller an admin? |
| GET | `/api/v1/admin/stats` | Dashboard counters |
| GET / PATCH | `/api/v1/admin/orders[/:id]` | List orders / update status |
| GET / PATCH | `/api/v1/admin/products[/:id]` | List / toggle active+featured, edit price |
| GET / PATCH | `/api/v1/admin/reviews[/:id]` | List / moderate reviews |
| GET | `/api/v1/admin/subscribers` | Newsletter list |

All require `requireAdmin`.

---

## Remaining "nice-to-haves" (not built — genuinely optional)
- Gifting (gift message / wrap / gift cards), loyalty/referrals, multi-currency.
- Cart-abandonment **email automation** (needs the P2 email provider + a scheduled worker; events + captured emails are already in place to power it).
- Wishlist **server-sync** for signed-in users (currently per-device localStorage).
- Heatmaps/session analytics (Microsoft Clarity/Hotjar — drop-in script).
- Product **variants** UI on the PDP (size/length/metal — schema + admin support exist; PDP selector is the remaining piece).
- Full **axe** accessibility audit + image re-encoding to WebP/AVIF + CDN (infra).

---

## Where the whole project stands
P1 secure checkout · P2 emails/reviews/newsletter/account/CI · P3 performance · P4 SEO · P5 analytics + wishlist · **P6 admin dashboard + a11y** — all implemented and locally verified. The database is live (migrations applied), the storefront is DB-driven, and the remaining work is owner-config (email/GA4/Stripe keys, `ADMIN_EMAILS`, correct `DATABASE_URL` password) plus optional enhancements above. See the other handoff docs in [docs/audit/](.).
