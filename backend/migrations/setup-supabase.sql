-- ============================================================================
-- Meyaar Jewellers — one-shot Supabase setup (idempotent).
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Safe to run multiple times. Creates only what's missing; never drops data.
-- Covers Priority 1 (commerce) + Priority 2 (reviews, newsletter) + RLS.
-- ============================================================================

-- ---------- Enums (guarded: CREATE TYPE has no IF NOT EXISTS) ----------------
DO $$ BEGIN CREATE TYPE "coupon_type"   AS ENUM('percentage','fixed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "order_status"  AS ENUM('pending','paid','processing','shipped','delivered','cancelled','refunded'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "payment_status" AS ENUM('pending','completed','failed','refunded','cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "review_status" AS ENUM('pending','approved','rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------- Tables ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS "categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL,
  "description" text,
  "image_url" text,
  "display_order" integer DEFAULT 0,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "categories_name_unique" UNIQUE("name"),
  CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "category_id" uuid NOT NULL,
  "sku" varchar(100) NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text,
  "long_description" text,
  "base_price" numeric(12, 2) NOT NULL,
  "discount_price" numeric(12, 2),
  "currency" varchar(3) DEFAULT 'USD',
  "material" varchar(100),
  "material_purity" varchar(50),
  "gemstone_type" varchar(100),
  "gemstone_carat" numeric(10, 2),
  "certification" varchar(100),
  "care_instructions" text,
  "average_rating" numeric(3, 2) DEFAULT '0',
  "total_reviews" integer DEFAULT 0,
  "is_active" boolean DEFAULT true,
  "is_featured" boolean DEFAULT false,
  "meta_title" varchar(255),
  "meta_description" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  "deleted_at" timestamp with time zone,
  CONSTRAINT "products_sku_unique" UNIQUE("sku")
);

CREATE TABLE IF NOT EXISTS "product_variants" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "sku_variant" varchar(100) NOT NULL,
  "name" varchar(255) NOT NULL,
  "attributes" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "price_override" numeric(12, 2),
  "image_url" text,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "product_variants_sku_variant_unique" UNIQUE("sku_variant")
);

CREATE TABLE IF NOT EXISTS "product_inventory" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "variant_id" uuid,
  "quantity_available" integer DEFAULT 0 NOT NULL,
  "quantity_reserved" integer DEFAULT 0 NOT NULL,
  "reorder_level" integer DEFAULT 10,
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "product_images" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid,
  "variant_id" uuid,
  "image_url" text NOT NULL,
  "alt_text" varchar(255),
  "display_order" integer DEFAULT 0,
  "is_primary" boolean DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "coupon_codes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "code" varchar(100) NOT NULL,
  "discount_type" "coupon_type" NOT NULL,
  "discount_value" numeric(12, 2) NOT NULL,
  "max_discount_amount" numeric(12, 2),
  "valid_from" timestamp with time zone,
  "valid_until" timestamp with time zone,
  "min_order_amount" numeric(12, 2),
  "max_uses" integer,
  "current_uses" integer DEFAULT 0,
  "max_uses_per_user" integer DEFAULT 1,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "coupon_codes_code_unique" UNIQUE("code")
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid,
  "order_number" varchar(50) NOT NULL,
  "guest_email" varchar(255),
  "guest_name" varchar(255),
  "guest_phone" varchar(20),
  "shipping_address" jsonb,
  "subtotal" numeric(12, 2) NOT NULL,
  "tax_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
  "shipping_cost" numeric(12, 2) DEFAULT '0' NOT NULL,
  "discount_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
  "total" numeric(12, 2) NOT NULL,
  "status" "order_status" DEFAULT 'pending' NOT NULL,
  "currency" varchar(3) DEFAULT 'USD',
  "coupon_code" varchar(100),
  "order_notes" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);

CREATE TABLE IF NOT EXISTS "order_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL,
  "product_id" uuid NOT NULL,
  "variant_id" uuid,
  "product_name" varchar(255) NOT NULL,
  "product_sku" varchar(100) NOT NULL,
  "unit_price" numeric(12, 2) NOT NULL,
  "quantity" integer NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "payments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL,
  "stripe_payment_intent_id" varchar(255),
  "stripe_charge_id" varchar(255),
  "amount" numeric(12, 2) NOT NULL,
  "currency" varchar(3) DEFAULT 'USD',
  "status" "payment_status" DEFAULT 'pending' NOT NULL,
  "payment_type" varchar(50),
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "payments_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "user_id" uuid,
  "author_name" varchar(120) NOT NULL,
  "rating" integer NOT NULL,
  "title" varchar(200),
  "content" text NOT NULL,
  "status" "review_status" DEFAULT 'approved' NOT NULL,
  "is_verified_purchase" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar(255) NOT NULL,
  "source" varchar(50) DEFAULT 'site',
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);

-- ---------- Drift bridge: add any columns the app needs that an older -------
-- ---------- products/categories/product_images table might be missing ------
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "discount_price" numeric(12,2);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "currency" varchar(3) DEFAULT 'USD';
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "is_featured" boolean DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "average_rating" numeric(3,2) DEFAULT '0';
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "total_reviews" integer DEFAULT 0;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "material" varchar(100);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "gemstone_type" varchar(100);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "certification" varchar(100);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "care_instructions" text;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "meta_title" varchar(255);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "meta_description" text;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "image_url" text;
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "display_order" integer DEFAULT 0;
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "product_images" ADD COLUMN IF NOT EXISTS "is_primary" boolean DEFAULT false;
ALTER TABLE "product_images" ADD COLUMN IF NOT EXISTS "alt_text" varchar(255);
ALTER TABLE "product_images" ADD COLUMN IF NOT EXISTS "display_order" integer DEFAULT 0;

-- ---------- Foreign keys (guarded) -----------------------------------------
DO $$ BEGIN ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "product_inventory" ADD CONSTRAINT "product_inventory_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "product_inventory" ADD CONSTRAINT "product_inventory_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "product_images" ADD CONSTRAINT "product_images_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------- Indexes ---------------------------------------------------------
CREATE INDEX IF NOT EXISTS "idx_products_category" ON "products" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_products_active" ON "products" ("is_active");
CREATE INDEX IF NOT EXISTS "idx_products_featured" ON "products" ("is_featured");
CREATE INDEX IF NOT EXISTS "idx_variants_product" ON "product_variants" ("product_id");
CREATE INDEX IF NOT EXISTS "idx_inventory_product" ON "product_inventory" ("product_id");
CREATE UNIQUE INDEX IF NOT EXISTS "uniq_inventory_product_variant" ON "product_inventory" ("product_id","variant_id");
CREATE INDEX IF NOT EXISTS "idx_product_images_product" ON "product_images" ("product_id");
CREATE INDEX IF NOT EXISTS "idx_coupons_code" ON "coupon_codes" ("code");
CREATE INDEX IF NOT EXISTS "idx_orders_user" ON "orders" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "orders" ("status");
CREATE INDEX IF NOT EXISTS "idx_orders_number" ON "orders" ("order_number");
CREATE INDEX IF NOT EXISTS "idx_order_items_order" ON "order_items" ("order_id");
CREATE INDEX IF NOT EXISTS "idx_payments_order" ON "payments" ("order_id");
CREATE INDEX IF NOT EXISTS "idx_payments_intent" ON "payments" ("stripe_payment_intent_id");
CREATE INDEX IF NOT EXISTS "idx_reviews_product" ON "reviews" ("product_id");
CREATE INDEX IF NOT EXISTS "idx_reviews_status" ON "reviews" ("status");

-- ---------- Row-Level Security ---------------------------------------------
ALTER TABLE "categories"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_variants"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_images"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_inventory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "coupon_codes"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reviews"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "newsletter_subscribers" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "catalog_categories_read" ON "categories";
CREATE POLICY "catalog_categories_read" ON "categories" FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "catalog_products_read" ON "products";
CREATE POLICY "catalog_products_read" ON "products" FOR SELECT TO anon, authenticated USING (is_active = true AND deleted_at IS NULL);

DROP POLICY IF EXISTS "catalog_variants_read" ON "product_variants";
CREATE POLICY "catalog_variants_read" ON "product_variants" FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "catalog_images_read" ON "product_images";
CREATE POLICY "catalog_images_read" ON "product_images" FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "orders_owner_read" ON "orders";
CREATE POLICY "orders_owner_read" ON "orders" FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "order_items_owner_read" ON "order_items";
CREATE POLICY "order_items_owner_read" ON "order_items" FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));

DROP POLICY IF EXISTS "reviews_public_read" ON "reviews";
CREATE POLICY "reviews_public_read" ON "reviews" FOR SELECT TO anon, authenticated USING (status = 'approved');

-- inventory, payments, coupon_codes, newsletter_subscribers: RLS on, no policies
-- → anon/authenticated get zero rows; only the server (service_role) can touch them.

-- ---------- Address book (saved shipping addresses) ------------------------
CREATE TABLE IF NOT EXISTS "user_addresses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "full_name" varchar(255) NOT NULL,
  "phone" varchar(30),
  "line1" varchar(255) NOT NULL,
  "line2" varchar(255),
  "city" varchar(120) NOT NULL,
  "state" varchar(120),
  "postal_code" varchar(20) NOT NULL,
  "country" varchar(2) NOT NULL DEFAULT 'US',
  "is_default" boolean NOT NULL DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_user_addresses_user" ON "user_addresses" ("user_id");

ALTER TABLE "user_addresses" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "addresses_owner_select" ON "user_addresses";
CREATE POLICY "addresses_owner_select" ON "user_addresses" FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "addresses_owner_insert" ON "user_addresses";
CREATE POLICY "addresses_owner_insert" ON "user_addresses" FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "addresses_owner_update" ON "user_addresses";
CREATE POLICY "addresses_owner_update" ON "user_addresses" FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "addresses_owner_delete" ON "user_addresses";
CREATE POLICY "addresses_owner_delete" ON "user_addresses" FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ============================================================================
-- Done. Re-running this file is safe.
-- ============================================================================
