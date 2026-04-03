# Meyaar Jewelers - Database Architecture & Schema

## System Architecture Overview

### Core Design Principles
1. **Normalization**: Eliminate redundancy while maintaining query performance
2. **Extensibility**: Support future features without major migrations
3. **Scalability**: Use appropriate indexing and foreign keys for growth
4. **Auditability**: Track all state changes with timestamps and soft deletes
5. **Security**: Role-based access, encrypted sensitive data, proper constraints

### Entity Model

```
USERS & AUTH LAYER
├── users (core identity)
├── user_profiles (extended info)
├── addresses (multiple per user)
└── roles (admin, customer, vendor, etc.)

PRODUCT LAYER
├── categories
├── products
├── product_variants (size, color, etc.)
├── product_inventory (stock management)
└── product_images

REVIEW & RATING LAYER
├── reviews
├── ratings (1-5 stars)
└── review_images (user-uploaded)

COMMERCE LAYER
├── carts & cart_items
├── orders & order_items
├── order_statuses (audit trail)
└── shipments

PAYMENT LAYER
├── payments (Stripe integration)
├── payment_methods
└── refunds

OPTIONAL/FUTURE
├── wishlists
├── discounts & coupon_codes
├── product_recommendations
└── vendor_profiles
```

### Key Design Decisions

1. **UUID for all IDs**: Better for distributed systems, prevents guessing
2. **Separate tables for sensitive data**: Reviews, payments kept organized
3. **Audit trail**: `created_at`, `updated_at`, `deleted_at` on all entities
4. **Polymorphic relationships**: Images table handles products/reviews/users
5. **Enumerated types**: User roles, order status use ENUM type
6. **Soft deletes**: `deleted_at` for compliance/recovery
7. **Denormalization carefully**: Cart stores current prices (snapshots)
8. **Foreign key constraints**: Maintain referential integrity

---

## Full PostgreSQL Schema

