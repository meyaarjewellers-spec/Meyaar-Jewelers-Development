-- ============================================================================
-- RLS verification — run as the ANON role to prove the browser path is locked.
--   psql "$DATABASE_URL" -f backend/migrations/rls/verify.sql
-- Expectations:
--   * categories/products: returns rows (public read) ✅
--   * orders/payments/coupon_codes/product_inventory: returns 0 rows ✅
-- ============================================================================
SET ROLE anon;

-- Should succeed (public catalog read):
SELECT 'categories visible to anon' AS check, count(*) AS rows FROM categories;
SELECT 'active products visible to anon' AS check, count(*) AS rows FROM products;

-- Should each return 0 rows (locked to server / owner only):
SELECT 'orders leaked to anon (expect 0)' AS check, count(*) AS rows FROM orders;
SELECT 'payments leaked to anon (expect 0)' AS check, count(*) AS rows FROM payments;
SELECT 'coupons leaked to anon (expect 0)' AS check, count(*) AS rows FROM coupon_codes;
SELECT 'inventory leaked to anon (expect 0)' AS check, count(*) AS rows FROM product_inventory;

RESET ROLE;
