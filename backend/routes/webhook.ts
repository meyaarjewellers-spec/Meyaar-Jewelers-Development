/**
 * POST /api/v1/stripe/webhook — Stripe's signed callback; the source of truth
 * for payment state. Requires the RAW request body for signature verification
 * (captured by express.json's `verify` into req.rawBody).
 */
import { Router } from "express";
import { constructWebhookEvent } from "../services/stripe";
import { handlePaymentSucceeded, handlePaymentFailed } from "../services/fulfillment";
import { log } from "../logger";

export const webhookRouter = Router();

webhookRouter.post("/stripe/webhook", async (req, res) => {
  const signature = req.headers["stripe-signature"];
  if (!signature || typeof signature !== "string") {
    return res.status(400).json({ error: { message: "Missing Stripe signature" } });
  }

  const rawBody = (req as any).rawBody as Buffer | undefined;
  if (!rawBody) {
    return res.status(400).json({ error: { message: "Missing raw body" } });
  }

  let event;
  try {
    event = constructWebhookEvent(rawBody, signature);
  } catch (err) {
    log(`webhook signature verification failed: ${(err as Error).message}`, "stripe");
    return res.status(400).json({ error: { message: "Invalid signature" } });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as any);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as any);
        break;
      default:
        // Unhandled events are acknowledged so Stripe stops retrying.
        break;
    }
    res.json({ received: true });
  } catch (err) {
    // Returning 500 makes Stripe retry — appropriate for transient failures.
    log(`webhook handler error for ${event.type}: ${(err as Error).message}`, "stripe");
    res.status(500).json({ error: { message: "Webhook handler error" } });
  }
});
