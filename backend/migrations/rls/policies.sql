-- ============================================================================
-- Row-Level Security policies — Meyaar Jewellers
-- ----------------------------------------------------------------------------
-- Apply AFTER the Drizzle migration that creates the tables:
--     psql "$DATABASE_URL" -f backend/migrations/0000_*.sql
--     psql "$DATABASE_URL" -f backend/migrations/rls/policies.sql
--
-- Model:
--   * The Supabase `service_role` (used only by the server) BYPASSES RLS, so it
--     needs no policies — it is the sole writer of orders, payments, inventory.
--   * The `anon` (browser) and `authenticated` roles are constrained below.
--   * Catalog is public-read. Orders are readable only by their owner. Payments,
--     inventory, and coupons are NEVER exposed to the browser.
-- ============================================================================

-- Enable RLS everywhere (deny-by-default once enabled).
ALTER TABLE categories          ENABLE ROW LEVEL SECURITY;
ALTER TABLE products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants    ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images      ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_inventory   ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_codes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments            ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Catalog: public read of ACTIVE rows (anon + authenticated). No writes.
-- ----------------------------------------------------------------------------
CREATE POLICY catalog_categories_read ON categories
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY catalog_products_read ON products
  FOR SELECT TO anon, authenticated
  USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY catalog_variants_read ON product_variants
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY catalog_images_read ON product_images
  FOR SELECT TO anon, authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- Orders: a signed-in user may read ONLY their own orders. Guests cannot read
-- orders via the browser at all (a server-issued token covers guest lookups in P2).
-- No INSERT/UPDATE/DELETE policies → browser cannot write orders.
-- ----------------------------------------------------------------------------
CREATE POLICY orders_owner_read ON orders
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY order_items_owner_read ON order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND o.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- Inventory, payments, coupons: NO browser policies.
-- With RLS enabled and no permissive policy, anon/authenticated get zero rows.
-- Only the service_role (server) can touch these.
-- ----------------------------------------------------------------------------
-- (intentionally no policies for product_inventory, payments, coupon_codes)

-- ----------------------------------------------------------------------------
-- Reviews: APPROVED reviews are public-read. Writes go through the server only.
-- ----------------------------------------------------------------------------
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY reviews_public_read ON reviews
  FOR SELECT TO anon, authenticated
  USING (status = 'approved');

-- ----------------------------------------------------------------------------
-- Newsletter: never readable from the browser; server-only writes.
-- ----------------------------------------------------------------------------
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
-- (no anon/authenticated policies → browser gets zero rows / cannot write)
