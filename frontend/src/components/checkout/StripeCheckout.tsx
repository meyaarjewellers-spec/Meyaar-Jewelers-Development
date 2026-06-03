/**
 * Stripe Payment Element checkout flow (replaces the raw-card form + fake wallets).
 *
 * Flow:
 *   1. Build cart items as { productId, quantity } — NO prices leave the browser.
 *   2. POST /api/v1/orders → server computes authoritative totals + creates a
 *      pending order.
 *   3. POST /api/v1/payments/intent → PaymentIntent for the order's total.
 *   4. Render <PaymentElement/> (cards + Apple/Google Pay) and confirm payment.
 *
 * Card data is collected inside Stripe's iframe and never touches our servers.
 */
import { useEffect, useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { getStripePromise, stripeConfigured } from "@/lib/stripeClient";
import { createOrder, createPaymentIntent, type OrderResponse, type ShippingAddress } from "@/lib/checkoutApi";
import { trackPurchase } from "@/lib/analytics";

interface StripeCheckoutProps {
  couponCode?: string;
  shippingAddress?: ShippingAddress;
  onSuccess: (info: { orderNumber: string; orderId: string }) => void;
  onError?: (message: string) => void;
}

/** Inner form: rendered once we have a PaymentIntent client secret. */
function PaymentForm({ order, onSuccess, onError }: { order: OrderResponse; onSuccess: StripeCheckoutProps["onSuccess"]; onError?: StripeCheckoutProps["onError"] }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError("");

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: { return_url: `${window.location.origin}/confirmation` },
    });

    if (stripeError) {
      const msg = stripeError.message || "Payment failed. Please try again.";
      setError(msg);
      onError?.(msg);
      setSubmitting(false);
      return;
    }

    if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
      // The webhook is the source of truth for fulfillment; the UI just advances.
      trackPurchase(order.orderNumber, order.total);
      onSuccess({ orderNumber: order.orderNumber, orderId: order.orderId });
    } else {
      const msg = "Payment could not be completed.";
      setError(msg);
      onError?.(msg);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="stripe-payment-form">
      <PaymentElement />
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
      )}
      <Button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full py-3 bg-amber-900 hover:bg-amber-800 text-white font-semibold"
      >
        {submitting ? "Processing…" : `Pay $${order.total.toFixed(2)}`}
      </Button>
      <p className="text-xs text-gray-500 text-center">
        🔒 Secured by Stripe. Your card details never touch our servers.
      </p>
    </form>
  );
}

export function StripeCheckout({ couponCode, shippingAddress, onSuccess, onError }: StripeCheckoutProps) {
  const { items } = useCart();
  const { user } = useAuth();
  const stripePromise = useMemo(() => getStripePromise(), []);

  const [guestEmail, setGuestEmail] = useState("");
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset the intent if the cart changes after an order was created.
  useEffect(() => {
    setOrder(null);
    setClientSecret("");
  }, [items]);

  const startPayment = async () => {
    setError("");
    if (!user && !guestEmail.trim()) {
      setError("Please enter your email to continue.");
      return;
    }
    setLoading(true);
    try {
      const createdOrder = await createOrder({
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        couponCode,
        guest: user ? undefined : { email: guestEmail.trim() },
        shippingAddress,
      });
      const { clientSecret: secret } = await createPaymentIntent(createdOrder.orderId);
      setOrder(createdOrder);
      setClientSecret(secret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not start checkout.";
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!stripeConfigured()) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-md text-sm">
        Payments are not configured yet. Set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> to enable checkout.
      </div>
    );
  }

  // Once we have a client secret, mount Elements with the PaymentElement.
  if (order && clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
        <div className="space-y-4">
          <OrderTotals order={order} />
          <PaymentForm order={order} onSuccess={onSuccess} onError={onError} />
        </div>
      </Elements>
    );
  }

  // Pre-payment: collect guest email (if needed) and start the order.
  return (
    <div className="space-y-4" data-testid="checkout-start">
      {!user && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email for your receipt</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            data-testid="guest-email"
          />
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
      )}
      <Button
        onClick={startPayment}
        disabled={loading || items.length === 0}
        className="w-full py-3 bg-amber-900 hover:bg-amber-800 text-white font-semibold"
        data-testid="proceed-to-payment"
      >
        {loading ? "Preparing secure checkout…" : "Proceed to payment"}
      </Button>
    </div>
  );
}

/** Server-computed totals shown above the Payment Element. */
function OrderTotals({ order }: { order: OrderResponse }) {
  return (
    <div className="rounded-md border p-4 space-y-1 text-sm">
      <Row label="Subtotal" value={order.subtotal} />
      {order.discount > 0 && <Row label="Discount" value={-order.discount} />}
      <Row label="Shipping" value={order.shipping} />
      <Row label="Tax" value={order.tax} />
      <div className="border-t pt-2 mt-2 flex justify-between font-bold">
        <span>Total</span>
        <span>${order.total.toFixed(2)}</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-gray-600">
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );
}
