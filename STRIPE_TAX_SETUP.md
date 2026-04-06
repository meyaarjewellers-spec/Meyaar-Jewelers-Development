# Stripe Tax API Setup Guide

This guide walks you through setting up Stripe Tax API for accurate tax calculations on the Meyaar Jewelers platform.

## ✅ What's Implemented

- Backend endpoint: `POST /api/calculate-tax`
- Frontend service: `frontend/src/lib/taxService.ts`
- UI component: ZIP code input with loading state and error handling
- Tax calculation logic: Uses Stripe Tax API for accurate rates

## 🔧 Setup Steps

### Step 1: Create or Access Your Stripe Account

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Sign up or log in to your Stripe account
3. Activate Stripe Tax (if not already enabled)

### Step 2: Set Up Stripe Tax in Dashboard

1. In Stripe Dashboard, go to **Settings** → **Products**
2. Look for **Stripe Tax** section
3. Click **Enable Stripe Tax** (if not enabled)
4. Complete any required tax configuration

### Step 3: Get Your Stripe Secret Key

1. Go to **Developers** → **API Keys**
2. Find your **Secret Key** (starts with `sk_live_` for production or `sk_test_` for testing)
3. Click the eye icon to reveal the full key or click "copy" button

### Step 4: Add to Environment Variables

Add your Stripe secret key to your `.env.local` file in the project root:

```
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXX
```

> **⚠️ IMPORTANT:** Never commit this key to git. It's already in `.gitignore`.

### Step 5: Restart Development Server

```bash
cd /Users/murtazahassan/Desktop/Projects/Meyaar\ Jewelers\ Development
npm install  # if stripe package not installed yet
npm run dev
```

## 🧪 Testing Tax Calculation

### Via Frontend

1. Go to **Checkout Page** (http://localhost:3000/checkout)
2. Add items to cart or use existing items
3. Enter a 5-digit ZIP code (e.g., `10001` for NYC)
4. Click the arrow button (→)
5. Tax should calculate based on that location

### Example Test ZIP Codes

- `10001` - New York (8.875% tax)
- `90210` - California (7.25% tax)
- `77001` - Texas (6.25% tax)
- `85001` - Arizona (6.5% tax)
- `33101` - Florida (7% tax)

### Via Curl (Optional - Backend Testing)

```bash
curl -X POST http://localhost:3000/api/calculate-tax \
  -H "Content-Type: application/json" \
  -d '{
    "zipCode": "10001",
    "subtotal": 100
  }'
```

Expected response:
```json
{
  "success": true,
  "tax": 8.875,
  "taxRate": "8.875",
  "calculation_id": "txcal_1234..."
}
```

## 📝 How It Works

### Frontend Flow
1. User enters ZIP code in checkout
2. Clicks arrow button to calculate tax
3. `calculateTaxWithStripe()` sends `/api/calculate-tax` request
4. Loading indicator shows while pending
5. Tax amount displays on success or error message on failure

### Backend Flow
1. Receives POST request with `zipCode` and `subtotal`
2. Initializes Stripe client with secret key
3. Calls `stripe.tax.calculations.create()` with:
   - Customer address (ZIP code + country: US)
   - Line item with amount and tax code (`txcd_100000000` for physical goods)
   - Client IP for accuracy
4. Extracts tax amount from response (converted from cents to dollars)
5. Returns tax amount and calculation ID

### Tax Code Used
- `txcd_100000000` - Physical goods (appropriate for jewelry)
- [View other tax codes](https://stripe.com/docs/tax/tax-categories)

## 🚨 Troubleshooting

### Error: "Stripe API key not configured"
**Solution:** Make sure `STRIPE_SECRET_KEY` is set in `.env.local` and server is restarted.

### Error: "Failed to calculate tax"
**Possible causes:**
- Invalid ZIP code format (must be 5 digits)
- Stripe API key expired or revoked
- Network connectivity issue

**Solution:**
- Check ZIP code format
- Verify key in [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Check browser console for detailed error

### Tax showing $0.00
**Possible causes:**
- Subtotal is $0
- Stripe Tax returned zero tax for that region (some states/counties)

**Solution:**
- Use valid test ZIP codes
- Check state tax regulations
- Test with different ZIP code

## 💳 Payment Processing

This setup covers **TAX CALCULATION ONLY**. Payment processing (charging customers) will be implemented in a future phase.

To later add full payment processing:
1. Create Stripe payment intent endpoint
2. Add payment method collection
3. Implement charge processing
4. Add order confirmation

## 📚 Resources

- [Stripe Tax API Docs](https://stripe.com/docs/tax)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Tax Categories Reference](https://stripe.com/docs/tax/tax-categories)
- [API Error Codes](https://stripe.com/docs/error-codes)

## ✨ Next Steps

1. Test tax calculation with various ZIP codes
2. Verify accuracy with state tax rates
3. Monitor Stripe usage in dashboard
4. When ready: implement Stripe payment processing

---

**Status:** ✅ Stripe Tax API integration complete and ready for testing
