/**
 * Stripe Payment Element checkout flow.
 *
 * Flow:
 *   1. Collect a shipping address (logged-in users pick a saved one or add a new
 *      one that auto-saves for next time; guests enter one + email).
 *   2. POST /api/v1/orders → server computes authoritative totals from the cart
 *      item IDs (no prices leave the browser) and the address (for tax).
 *   3. POST /api/v1/payments/intent → PaymentIntent for the order's total.
 *   4. Render <PaymentElement/> (cards + Apple/Google Pay) and confirm payment.
 *
 * Card data is collected inside Stripe's iframe and never touches our servers.
 */
import { useEffect, useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddressForm from "@/components/AddressForm";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { getStripePromise, stripeConfigured } from "@/lib/stripeClient";
import { createOrder, createPaymentIntent, type OrderResponse } from "@/lib/checkoutApi";
import { addressApi, type Address, type AddressInput } from "@/lib/addressApi";
import { trackPurchase } from "@/lib/analytics";

interface StripeCheckoutProps {
  couponCode?: string;
  onSuccess: (info: { orderNumber: string; orderId: string }) => void;
  onError?: (message: string) => void;
}

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
      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <Button type="submit" disabled={!stripe || submitting} className="w-full rounded-full py-6">
        {submitting ? "Processing…" : `Pay $${order.total.toFixed(2)}`}
      </Button>
      <p className="text-center text-xs text-muted-foreground">🔒 Secured by Stripe. Your card details never touch our servers.</p>
    </form>
  );
}

function addressToShipping(a: Address | AddressInput) {
  return {
    fullName: a.fullName,
    line1: a.line1,
    line2: a.line2 ?? undefined,
    city: a.city,
    state: a.state ?? undefined,
    postalCode: a.postalCode,
    country: a.country,
  };
}

export function StripeCheckout({ couponCode, onSuccess, onError }: StripeCheckoutProps) {
  const { items } = useCart();
  const { user } = useAuth();
  const stripePromise = useMemo(() => getStripePromise(), []);

  const [guestEmail, setGuestEmail] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [saveNew, setSaveNew] = useState(true);

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setOrder(null);
    setClientSecret("");
  }, [items]);

  // Load saved addresses for signed-in users.
  useEffect(() => {
    if (!user) {
      setAddingNew(true);
      return;
    }
    addressApi
      .list()
      .then((list) => {
        setAddresses(list);
        if (list.length > 0) setSelectedId(list.find((a) => a.isDefault)?.id ?? list[0].id);
        else setAddingNew(true);
      })
      .catch(() => setAddingNew(true));
  }, [user]);

  const proceed = async (address: Address | AddressInput, opts?: { saveNew?: boolean }) => {
    setError("");
    if (!user && !guestEmail.trim()) {
      setError("Please enter your email to continue.");
      return;
    }
    setLoading(true);
    try {
      // Auto-save a new address for signed-in users (so it's there next time).
      if (user && opts?.saveNew && !("id" in address)) {
        try {
          const saved = await addressApi.create(address as AddressInput);
          setAddresses((p) => [saved, ...p]);
        } catch {
          /* non-blocking — proceed with the order regardless */
        }
      }

      const createdOrder = await createOrder({
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        couponCode,
        guest: user ? undefined : { email: guestEmail.trim(), name: address.fullName, phone: address.phone ?? undefined },
        shippingAddress: addressToShipping(address),
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
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Payments are not configured yet. Set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> to enable checkout.
      </div>
    );
  }

  // Payment step.
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

  const usingPicker = Boolean(user) && addresses.length > 0 && !addingNew;
  const selected = addresses.find((a) => a.id === selectedId) || null;

  // Address + email step.
  return (
    <div className="space-y-5" data-testid="checkout-start">
      {!user && (
        <div className="space-y-1">
          <label className="text-sm font-medium">Email for your receipt</label>
          <Input type="email" placeholder="you@example.com" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} data-testid="guest-email" />
        </div>
      )}

      <div>
        <p className="mb-3 text-sm font-medium">Shipping address</p>

        {usingPicker ? (
          <>
            <div className="space-y-2">
              {addresses.map((a) => (
                <label key={a.id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${selectedId === a.id ? "border-primary bg-primary/5" : "border-border"}`}>
                  <input type="radio" name="addr" checked={selectedId === a.id} onChange={() => setSelectedId(a.id)} className="mt-1" />
                  <span>
                    <span className="font-medium">{a.fullName}</span>
                    {a.isDefault && <span className="ml-2 text-xs text-primary">Default</span>}
                    <br />
                    {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}{a.state ? `, ${a.state}` : ""} {a.postalCode}, {a.country}
                  </span>
                </label>
              ))}
            </div>
            <button onClick={() => setAddingNew(true)} className="mt-2 text-sm text-primary underline-offset-4 hover:underline">
              + Use a different address
            </button>
            {error && <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <Button
              onClick={() => selected && proceed(selected)}
              disabled={loading || !selected || items.length === 0}
              className="mt-4 w-full rounded-full py-6"
              data-testid="proceed-to-payment"
            >
              {loading ? "Preparing secure checkout…" : "Continue to payment"}
            </Button>
          </>
        ) : (
          <>
            {user && (
              <label className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={saveNew} onChange={(e) => setSaveNew(e.target.checked)} />
                Save this address for next time
              </label>
            )}
            {error && <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <AddressForm
              submitLabel={loading ? "Preparing secure checkout…" : "Continue to payment"}
              onSubmit={(a) => proceed(a, { saveNew })}
              onCancel={user && addresses.length > 0 ? () => setAddingNew(false) : undefined}
              busy={loading}
            />
          </>
        )}
      </div>
    </div>
  );
}

function OrderTotals({ order }: { order: OrderResponse }) {
  return (
    <div className="space-y-1 rounded-md border p-4 text-sm">
      <Row label="Subtotal" value={order.subtotal} />
      {order.discount > 0 && <Row label="Discount" value={-order.discount} />}
      <Row label="Shipping" value={order.shipping} />
      <Row label="Tax" value={order.tax} />
      <div className="mt-2 flex justify-between border-t pt-2 font-bold">
        <span>Total</span>
        <span>${order.total.toFixed(2)}</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );
}
