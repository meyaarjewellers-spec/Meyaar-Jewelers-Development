-- ============================================================================
-- MEYAAR JEWELERS - PRODUCTION DATABASE SCHEMA
-- PostgreSQL 14+
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS (Predefined Constants)
-- ============================================================================

-- User roles for authorization
CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin', 'moderator');

-- Order status tracking
CREATE TYPE order_status AS ENUM ('cart', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned');

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'cancelled');

-- Review status (for moderation)
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- Users table (Supabase auth integration)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  encrypted_password VARCHAR(255),
  display_name VARCHAR(255),
  phone_number VARCHAR(20),
  avatar_url TEXT,
  
  -- Account status
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  
  -- Audit trails
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT users_email_not_null CHECK (email IS NOT NULL)
);

-- User profiles (extended information)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  bio TEXT,
  birth_date DATE,
  gender VARCHAR(50),
  preferred_language VARCHAR(10) DEFAULT 'en',
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles (for RBAC)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  
  -- Role metadata
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id, role)
);

-- User addresses (multiple per user)
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Address details
  type VARCHAR(50) NOT NULL, -- 'home', 'work', 'billing', etc.
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  street_address_1 VARCHAR(255) NOT NULL,
  street_address_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  
  -- Flags
  is_default_billing BOOLEAN DEFAULT FALSE,
  is_default_shipping BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- PRODUCTS & CATALOG
-- ============================================================================

-- Product categories (hierarchical)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  parent_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Display
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  
  -- Product info
  sku VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  long_description TEXT,
  
  -- Pricing
  base_price DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  discount_price DECIMAL(12, 2),
  
  -- JEWELRY-SPECIFIC FIELDS
  material VARCHAR(100), -- Gold, Silver, Platinum, etc.
  material_purity VARCHAR(50), -- 14K, 18K, 925, 950, etc.
  metal_weight_grams DECIMAL(10, 2), -- Weight of metal
  gemstone_type VARCHAR(100), -- Diamond, Ruby, Emerald, etc.
  gemstone_carat DECIMAL(10, 2), -- Carat weight
  gemstone_clarity VARCHAR(50), -- VVS1, VS1, SI1, etc.
  gemstone_color VARCHAR(50), -- D, E, F, etc.
  certification VARCHAR(100), -- GIA, IGI, etc.
  care_instructions TEXT, -- How to care for the jewelry
  
  -- Rating & Reviews (denormalized for performance)
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Product variants (size, color, material, etc.)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- Variant identification
  sku_variant VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL, -- e.g., "Gold - Size 7"
  description TEXT,
  
  -- Variant attributes (JSON for flexibility)
  attributes JSONB NOT NULL, -- {"color": "gold", "size": "7", "material": "14K Gold"}
  
  -- Pricing override
  price_override DECIMAL(12, 2),
  
  -- Media
  image_url TEXT,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product inventory (stock management)
CREATE TABLE IF NOT EXISTS product_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  
  -- Stock levels
  quantity_available INT NOT NULL DEFAULT 0,
  quantity_reserved INT NOT NULL DEFAULT 0, -- Reserved in carts
  quantity_on_order INT NOT NULL DEFAULT 0,
  reorder_level INT DEFAULT 10,
  
  warehouse_location VARCHAR(100),
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product images (polymorphic - can attach to products or variants)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  display_order INT DEFAULT 0,
  
  is_primary BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- REVIEWS & RATINGS
-- ============================================================================

-- Reviews (user feedback)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Review content
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  
  -- Moderation
  status review_status DEFAULT 'pending',
  moderation_comment TEXT,
  
  -- Engagement
  helpful_count INT DEFAULT 0,
  unhelpful_count INT DEFAULT 0,
  
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(product_id, user_id) -- One review per product per user
);

-- Review images (user-uploaded photos)
CREATE TABLE IF NOT EXISTS review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review helpful votes (upvote/downvote)
CREATE TABLE IF NOT EXISTS review_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  vote_type VARCHAR(20) NOT NULL, -- 'helpful' or 'unhelpful'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(review_id, user_id) -- One vote per user per review
);

-- ============================================================================
-- SHOPPING CART
-- ============================================================================

-- Shopping carts
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- For guest users
  
  -- Cart totals (denormalized)
  subtotal DECIMAL(12, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  shipping_cost DECIMAL(12, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) DEFAULT 0,
  
  -- Cart metadata
  currency VARCHAR(3) DEFAULT 'USD',
  coupon_code VARCHAR(100),
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  
  -- Snapshots of product data at cart time
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100) NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  
  -- Line total
  line_total DECIMAL(12, 2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ORDERS
-- ============================================================================

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL for guest orders
  
  -- Order info
  order_number VARCHAR(50) NOT NULL UNIQUE,
  
  -- Billing & Shipping
  billing_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  shipping_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  
  -- For guest orders
  guest_email VARCHAR(255),
  guest_name VARCHAR(255),
  guest_phone VARCHAR(20),
  
  -- Order totals
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  shipping_cost DECIMAL(12, 2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  
  -- Order status & tracking
  status order_status NOT NULL DEFAULT 'pending',
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Special notes
  order_notes TEXT,
  internal_notes TEXT,
  
  -- Shipping
  tracking_number VARCHAR(100),
  estimated_delivery_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  
  -- Product snapshot at time of order
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100) NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  
  -- Line total
  line_total DECIMAL(12, 2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order status history (audit trail)
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  old_status order_status,
  new_status order_status NOT NULL,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PAYMENTS & REFUNDS
-- ============================================================================

-- Payments (Stripe integration)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  
  -- Stripe integration
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_charge_id VARCHAR(255),
  
  -- Payment info
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status payment_status NOT NULL DEFAULT 'pending',
  
  -- Payment method
  payment_method_id VARCHAR(255),
  payment_type VARCHAR(50), -- 'card', 'apple_pay', 'google_pay', etc.
  
  -- Metadata
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refunds
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  
  -- Refund info
  amount DECIMAL(12, 2) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  
  -- Stripe integration
  stripe_refund_id VARCHAR(255) UNIQUE,
  
  status payment_status NOT NULL DEFAULT 'pending',
  
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SHIPPING & FULFILLMENT
-- ============================================================================

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Shipping details
  carrier VARCHAR(100),
  tracking_number VARCHAR(100),
  tracking_url TEXT,
  
  -- Timeline
  shipped_date DATE,
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  
  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, shipped, in_transit, delivered, exception
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- FUTURE: DISCOUNTS & PROMOTIONS
-- ============================================================================

-- Coupon codes (for promotions)
CREATE TABLE IF NOT EXISTS coupon_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) NOT NULL UNIQUE,
  
  -- Discount rules
  discount_type VARCHAR(50) NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(12, 2) NOT NULL,
  max_discount_amount DECIMAL(12, 2),
  
  -- Validity
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  
  -- Restrictions
  min_order_amount DECIMAL(12, 2),
  max_uses INT,
  current_uses INT DEFAULT 0,
  max_uses_per_user INT DEFAULT 1,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- FUTURE: WISHLISTS
-- ============================================================================

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL DEFAULT 'My Wishlist',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist items
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(wishlist_id, product_id)
);

-- ============================================================================
-- INDEXES FOR COMMON QUERIES
-- ============================================================================

-- Category indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_category_id);

-- Product indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_material ON products(material);
CREATE INDEX idx_products_price ON products(base_price);
CREATE INDEX idx_products_category_active ON products(category_id, is_active);

-- Product variant indexes
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku_variant);

-- Product inventory indexes
CREATE INDEX idx_inventory_product ON product_inventory(product_id);
CREATE INDEX idx_inventory_variant ON product_inventory(variant_id);

-- Product image indexes
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_variant ON product_images(variant_id);

-- Review indexes
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_product_rating ON reviews(product_id, rating DESC);

-- Review image indexes
CREATE INDEX idx_review_images_review ON review_images(review_id);

-- Review vote indexes
CREATE INDEX idx_review_votes_review ON review_votes(review_id);
CREATE INDEX idx_review_votes_user ON review_votes(user_id);

-- Cart indexes
CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);

-- Cart item indexes
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);
CREATE INDEX idx_cart_items_product_variant ON cart_items(product_id, variant_id);

-- Order indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);

-- Order item indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Order status history indexes
CREATE INDEX idx_status_history_order ON order_status_history(order_id);

-- Payment indexes
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_stripe_id ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Refund indexes
CREATE INDEX idx_refunds_payment ON refunds(payment_id);
CREATE INDEX idx_refunds_order ON refunds(order_id);

-- Shipment indexes
CREATE INDEX idx_shipments_order ON shipments(order_id);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);

-- Coupon indexes
CREATE INDEX idx_coupons_code ON coupon_codes(code);
CREATE INDEX idx_coupons_active ON coupon_codes(is_active);

-- Wishlist indexes
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_wishlist_items_wishlist ON wishlist_items(wishlist_id);

-- User role indexes
CREATE INDEX idx_user_roles_user ON user_roles(user_id);

-- ============================================================================
-- VIEWS (Optional - for common queries)
-- ============================================================================

-- Active products view
CREATE OR REPLACE VIEW active_products AS
SELECT 
  p.id,
  p.sku,
  p.name,
  p.base_price,
  p.discount_price,
  p.average_rating,
  p.total_reviews,
  c.name AS category_name,
  c.slug AS category_slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = TRUE AND p.deleted_at IS NULL;

-- User order summary view
CREATE OR REPLACE VIEW user_order_summary AS
SELECT 
  u.id AS user_id,
  u.email,
  u.display_name,
  COUNT(DISTINCT o.id) AS total_orders,
  SUM(o.total) AS total_spent,
  MAX(o.created_at) AS last_order_date,
  AVG(r.rating) AS avg_review_rating
FROM users u
LEFT JOIN orders o ON u.id = o.user_id AND o.deleted_at IS NULL
LEFT JOIN reviews r ON u.id = r.user_id AND r.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email, u.display_name;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
