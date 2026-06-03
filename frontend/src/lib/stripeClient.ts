/** Stripe.js loader (singleton). Uses the publishable key — safe for the browser. */
import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripePromise(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error("VITE_STRIPE_PUBLISHABLE_KEY is not set — payments are disabled.");
      stripePromise = Promise.resolve(null);
    } else {
      stripePromise = loadStripe(key);
    }
  }
  return stripePromise;
}

export const stripeConfigured = (): boolean => Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
