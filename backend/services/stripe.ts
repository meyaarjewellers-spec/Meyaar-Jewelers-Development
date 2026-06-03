/**
 * Stripe integration (server). Card data never reaches us — the browser uses
 * Stripe Elements and we only ever handle PaymentIntents, webhooks, and tax.
 */
import Stripe from "stripe";
import { env } from "../config/env";
import { log } from "../logger";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  _stripe = new Stripe(env.STRIPE_SECRET_KEY);
  return _stripe;
}

export function stripeAvailable(): boolean {
  return Boolean(env.STRIPE_SECRET_KEY);
}

/**
 * Create a PaymentIntent for a server-computed amount, bound to an order.
 * Uses an idempotency key so retries cannot double-charge.
 */
export async function createPaymentIntent(params: {
  amountCents: number;
  currency: string;
  orderId: string;
  orderNumber: string;
  idempotencyKey: string;
  receiptEmail?: string;
}): Promise<Stripe.PaymentIntent> {
  const stripe = getStripe();
  return stripe.paymentIntents.create(
    {
      amount: params.amountCents,
      currency: params.currency,
      metadata: { order_id: params.orderId, order_number: params.orderNumber },
      receipt_email: params.receiptEmail,
      automatic_payment_methods: { enabled: true }, // enables cards + Apple/Google Pay
    },
    { idempotencyKey: params.idempotencyKey },
  );
}

/** Verify and parse a Stripe webhook payload. Throws on bad signature. */
export function constructWebhookEvent(rawBody: Buffer | string, signature: string): Stripe.Event {
  const stripe = getStripe();
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
  }
  return stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
}

/**
 * Compute sales tax for a taxable amount + shipping address via Stripe Tax.
 * Returns tax in cents (0 if Stripe Tax is unavailable or address is missing).
 */
export async function calculateTaxCents(params: {
  taxableCents: number;
  currency: string;
  postalCode?: string;
  country?: string;
}): Promise<number> {
  if (!stripeAvailable() || !params.postalCode || params.taxableCents <= 0) return 0;
  try {
    const stripe = getStripe();
    const calc = await stripe.tax.calculations.create({
      currency: params.currency,
      customer_details: {
        address: { postal_code: params.postalCode, country: params.country ?? "US" },
        address_source: "shipping",
      },
      line_items: [{ amount: params.taxableCents, reference: "order_total" }],
    });
    return calc.tax_amount_exclusive ?? 0;
  } catch (err) {
    log(`Stripe Tax calculation failed; defaulting tax to 0: ${(err as Error).message}`, "stripe");
    return 0;
  }
}
