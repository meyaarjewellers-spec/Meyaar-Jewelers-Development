import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StripePaymentForm } from "./StripePaymentForm";
import { GooglePayButton } from "./GooglePayButton";
import { ApplePayButton } from "./ApplePayButton";

interface PaymentMethodsSectionProps {
  totalAmount?: number;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

export function PaymentMethodsSection({ 
  totalAmount = 0, 
  onPaymentSuccess, 
  onPaymentError 
}: PaymentMethodsSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<"card" | "apple" | "google" | null>(null);

  const handlePaymentSuccess = (paymentId: string) => {
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentId);
    }
  };

  const handlePaymentError = (error: string) => {
    if (onPaymentError) {
      onPaymentError(error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">💳 Payment Method</h2>

      {selectedMethod === "card" ? (
        <div className="space-y-3">
          <button
            onClick={() => setSelectedMethod(null)}
            className="text-sm text-amber-900 hover:underline"
          >
            ← Back to payment methods
          </button>
          <StripePaymentForm 
            amount={totalAmount} 
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      ) : (
        <>
          {/* Debit / Credit Card */}
          <Card 
            className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition"
            onClick={() => setSelectedMethod("card")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                Debit or Credit Card
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              <p>Pay securely using your Visa, Mastercard, American Express, or Discover card.</p>
            </CardContent>
          </Card>

          {/* Apple Pay */}
          {selectedMethod === "apple" ? (
            <div className="space-y-3">
              <button
                onClick={() => setSelectedMethod(null)}
                className="text-sm text-amber-900 hover:underline"
              >
                ← Back to payment methods
              </button>
              <ApplePayButton 
                amount={totalAmount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          ) : (
            <Card 
              className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition"
              onClick={() => setSelectedMethod("apple")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl font-bold" style={{ color: "#000", fontFamily: "system-ui" }}>
                    ⊙ Apple Pay
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p>Fast and secure payment with Apple Pay. Pay with your saved cards and identity without entering your payment details.</p>
              </CardContent>
            </Card>
          )}

          {/* Google Pay */}
          {selectedMethod === "google" ? (
            <div className="space-y-3">
              <button
                onClick={() => setSelectedMethod(null)}
                className="text-sm text-amber-900 hover:underline"
              >
                ← Back to payment methods
              </button>
              <GooglePayButton 
                amount={totalAmount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          ) : (
            <Card 
              className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition"
              onClick={() => setSelectedMethod("google")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="flex gap-1 text-lg font-bold">
                    <span style={{ color: "#4285F4" }}>G</span>
                    <span style={{ color: "#EA4335" }}>o</span>
                    <span style={{ color: "#FBBC04" }}>o</span>
                    <span style={{ color: "#4285F4" }}>g</span>
                    <span style={{ color: "#34A853" }}>l</span>
                    <span style={{ color: "#EA4335" }}>e</span>
                  </div>
                  <span className="ml-1">Pay</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p>Quick and secure payment with Google Pay. Your payment information stays safe and secure.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
