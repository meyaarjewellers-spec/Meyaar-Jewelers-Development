/**
 * Payment section — renders the Stripe Payment Element flow (which now also
 * collects/selects the shipping address). The single Payment Element surfaces
 * cards plus Apple Pay / Google Pay automatically on supported devices.
 */
import { StripeCheckout } from "./StripeCheckout";

interface PaymentMethodsSectionProps {
  couponCode?: string;
  /** Receives the created order on success (orderNumber drives the confirmation). */
  onPaymentSuccess?: (info: { orderNumber: string; orderId: string }) => void;
  onPaymentError?: (error: string) => void;
}

export function PaymentMethodsSection({ couponCode, onPaymentSuccess, onPaymentError }: PaymentMethodsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl">Shipping & Payment</h2>
      <p className="text-sm text-muted-foreground">
        Enter your shipping address, then pay securely with a card or, on supported devices, Apple Pay / Google Pay.
      </p>
      <StripeCheckout
        couponCode={couponCode}
        onSuccess={(info) => onPaymentSuccess?.(info)}
        onError={(msg) => onPaymentError?.(msg)}
      />
    </div>
  );
}
