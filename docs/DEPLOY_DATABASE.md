# 🚀 Deploy Database Schema to Supabase

## Quick Start (Recommended)

### Step 1: Get Your Service Role Key
1. Go to: https://app.supabase.com
2. Select your project: **voglupvbegeoowawwsck**
3. Click **Settings** → **API**
4. Under "Project API keys", find **service_role** section
5. Click **Reveal secret** and copy the long key

### Step 2: Add to Your Environment
Edit `.env.local` at the project root and add:
```
SUPABASE_SERVICE_ROLE_KEY=<paste_your_key_here>
```

### Step 3: Run Deploy Script
```bash
cd /Users/murtazahassan/Desktop/Projects/Meyaar\ Jewelers\ Development
node scripts/deploySchema.js
```

---

## Alternative: Manual Deploy (No Script Needed)

If the script doesn't work, do this manually:

1. Go to https://app.supabase.com
2. Select your project **voglupvbegeoowawwsck**
3. Click **SQL Editor** (left sidebar)
4. Click **New Query** (top right)
5. Open this file: `/schema.sql`
6. Copy ALL the SQL code
7. Paste into the SQL editor
8. Click **Run**
9. Wait for "completed successfully" message

---

## Verify Deployment

After deploying, check that tables exist:

1. Go to Supabase Dashboard
2. Click **Table Editor** (left sidebar)
3. You should see all these tables:
   - users
   - user_profiles
   - user_roles
   - products
   - categories
   - reviews
   - carts
   - orders
   - payments
   - And more...

✅ If you see them, your database is ready!

---

## Troubleshooting

**"Invalid service role key"**
- Copy the ENTIRE key, including "eyJ..." prefix
- Don't use the "anon" key - use "service_role"

**"Connection failed"**
- Verify your Supabase project is active
- Check internet connection
- Try manual deploy instead

**"Permission denied"**  
- Make sure you're using service_role, not anon key
- Check project settings for RLS rules

---

## What Tables Get Created?

✓ User Management: users, user_profiles, user_roles, addresses
✓ Products: categories, products, product_variants, product_inventory, product_images
✓ Reviews: reviews, review_images, review_votes
✓ Shopping: carts, cart_items
✓ Orders: orders, order_items, order_status_history
✓ Payments: payments, refunds
✓ Shipping: shipments
✓ Marketing: coupon_codes
✓ Wishlists: wishlists, wishlist_items

Total: **23 tables** for a complete e-commerce platform!
