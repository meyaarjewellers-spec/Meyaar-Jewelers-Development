/**
 * Drizzle schema — single source of truth for the Meyaar Jewellers database.
 *
 * MVP subset of docs/backend/schema.sql, scoped to Priority 1 (catalog, orders,
 * payments, inventory, coupons). Authentication is handled by Supabase Auth, so
 * there is intentionally NO application-managed user/password table here.
 *
 * Conventions:
 *  - snake_case column names (Postgres idiomatic, matches existing SQL).
 *  - Money stored as numeric(12,2); the application computes in integer cents
 *    and converts at the boundary to avoid floating-point drift.
 */
import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  numeric,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export const orderStatus = pgEnum("order_status", [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
  "cancelled",
]);

export const couponType = pgEnum("coupon_type", ["percentage", "fixed"]);

export const reviewStatus = pgEnum("review_status", ["pending", "approved", "rejected"]);

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    longDescription: text("long_description"),
    basePrice: numeric("base_price", { precision: 12, scale: 2 }).notNull(),
    discountPrice: numeric("discount_price", { precision: 12, scale: 2 }),
    currency: varchar("currency", { length: 3 }).default("USD"),
    // Jewelry-specific
    material: varchar("material", { length: 100 }),
    materialPurity: varchar("material_purity", { length: 50 }),
    gemstoneType: varchar("gemstone_type", { length: 100 }),
    gemstoneCarat: numeric("gemstone_carat", { precision: 10, scale: 2 }),
    certification: varchar("certification", { length: 100 }),
    careInstructions: text("care_instructions"),
    averageRating: numeric("average_rating", { precision: 3, scale: 2 }).default("0"),
    totalReviews: integer("total_reviews").default(0),
    isActive: boolean("is_active").default(true),
    isFeatured: boolean("is_featured").default(false),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => ({
    categoryIdx: index("idx_products_category").on(t.categoryId),
    activeIdx: index("idx_products_active").on(t.isActive),
    featuredIdx: index("idx_products_featured").on(t.isFeatured),
  }),
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    skuVariant: varchar("sku_variant", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    attributes: jsonb("attributes").notNull().default(sql`'{}'::jsonb`),
    priceOverride: numeric("price_override", { precision: 12, scale: 2 }),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({ productIdx: index("idx_variants_product").on(t.productId) }),
);

export const productInventory = pgTable(
  "product_inventory",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
    quantityAvailable: integer("quantity_available").notNull().default(0),
    quantityReserved: integer("quantity_reserved").notNull().default(0),
    reorderLevel: integer("reorder_level").default(10),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    productIdx: index("idx_inventory_product").on(t.productId),
    variantUniq: uniqueIndex("uniq_inventory_product_variant").on(t.productId, t.variantId),
  }),
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    altText: varchar("alt_text", { length: 255 }),
    displayOrder: integer("display_order").default(0),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({ productIdx: index("idx_product_images_product").on(t.productId) }),
);

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------
export const couponCodes = pgTable(
  "coupon_codes",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    code: varchar("code", { length: 100 }).notNull().unique(),
    discountType: couponType("discount_type").notNull(),
    discountValue: numeric("discount_value", { precision: 12, scale: 2 }).notNull(),
    maxDiscountAmount: numeric("max_discount_amount", { precision: 12, scale: 2 }),
    validFrom: timestamp("valid_from", { withTimezone: true }),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    minOrderAmount: numeric("min_order_amount", { precision: 12, scale: 2 }),
    maxUses: integer("max_uses"),
    currentUses: integer("current_uses").default(0),
    maxUsesPerUser: integer("max_uses_per_user").default(1),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({ codeIdx: index("idx_coupons_code").on(t.code) }),
);

// ---------------------------------------------------------------------------
// Orders & payments
// ---------------------------------------------------------------------------
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    // Supabase auth.users id; NULL for guest orders.
    userId: uuid("user_id"),
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
    guestEmail: varchar("guest_email", { length: 255 }),
    guestName: varchar("guest_name", { length: 255 }),
    guestPhone: varchar("guest_phone", { length: 20 }),
    shippingAddress: jsonb("shipping_address"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    shippingCost: numeric("shipping_cost", { precision: 12, scale: 2 }).notNull().default("0"),
    discountAmount: numeric("discount_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    status: orderStatus("status").notNull().default("pending"),
    currency: varchar("currency", { length: 3 }).default("USD"),
    couponCode: varchar("coupon_code", { length: 100 }),
    orderNotes: text("order_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    userIdx: index("idx_orders_user").on(t.userId),
    statusIdx: index("idx_orders_status").on(t.status),
    numberIdx: index("idx_orders_number").on(t.orderNumber),
  }),
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
    productName: varchar("product_name", { length: 255 }).notNull(),
    productSku: varchar("product_sku", { length: 100 }).notNull(),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({ orderIdx: index("idx_order_items_order").on(t.orderId) }),
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }).unique(),
    stripeChargeId: varchar("stripe_charge_id", { length: 255 }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    status: paymentStatus("status").notNull().default("pending"),
    paymentType: varchar("payment_type", { length: 50 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    orderIdx: index("idx_payments_order").on(t.orderId),
    intentIdx: index("idx_payments_intent").on(t.stripePaymentIntentId),
  }),
);

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    // Supabase auth user id (nullable for guest reviews).
    userId: uuid("user_id"),
    authorName: varchar("author_name", { length: 120 }).notNull(),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 200 }),
    content: text("content").notNull(),
    status: reviewStatus("status").notNull().default("approved"),
    isVerifiedPurchase: boolean("is_verified_purchase").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    productIdx: index("idx_reviews_product").on(t.productId),
    statusIdx: index("idx_reviews_status").on(t.status),
  }),
);

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  source: varchar("source", { length: 50 }).default("site"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type ProductInventory = typeof productInventory.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
export type CouponCode = typeof couponCodes.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// Validation schema used by the API when accepting cart line items.
export const cartLineItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().positive().max(100),
});
export type CartLineItem = z.infer<typeof cartLineItemSchema>;

export const insertCouponSchema = createInsertSchema(couponCodes);
