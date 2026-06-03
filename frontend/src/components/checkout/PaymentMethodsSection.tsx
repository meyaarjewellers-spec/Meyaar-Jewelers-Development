/**
 * Payment section — renders the Stripe Payment Element flow. The single Payment
 * Element surfaces cards plus Apple Pay / Google Pay automatically on supported
 * devices, so there are no separate (and previously fake) wallet buttons.
 */
import { StripeCheckout } from "./StripeCheckout";
import type { ShippingAddress } from "@/lib/checkoutApi";

interface PaymentMethodsSectionProps {
  couponCode?: string;
  shippingAddress?: ShippingAddress;
  /** Receives the created order on success (orderNumber drives the confirmation). */
  onPaymentSuccess?: (info: { orderNumber: string; orderId: string }) => void;
  onPaymentError?: (error: string) => void;
}

export function PaymentMethodsSection({
  couponCode,
  shippingAddress,
  onPaymentSuccess,
  onPaymentError,
}: PaymentMethodsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">💳 Payment</h2>
      <p className="text-sm text-gray-600">
        Pay securely with a card or, on supported devices, Apple Pay / Google Pay.
      </p>
      <StripeCheckout
        couponCode={couponCode}
        shippingAddress={shippingAddress}
        onSuccess={(info) => onPaymentSuccess?.(info)}
        onError={(msg) => onPaymentError?.(msg)}
      />
    </div>
  );
}
