import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Declare Apple Pay types
declare global {
  interface Window {
    ApplePaySession?: any;
  }
  
  class ApplePaySession {
    constructor(version: number, request: any);
    begin(): void;
    abort(): void;
    completePayment(status: number): void;
    completeMerchantValidation(merchantSession: any): void;
    completePaymentMethodSelection(updates: any): void;
    onvalidatemerchant?: (event: any) => void;
    onpaymentmethodselected?: (event: any) => void;
    onpaymentauthorized?: (event: any) => void;
    oncancel?: () => void;
    static canMakePayments(): boolean;
    static STATUS_SUCCESS: number;
    static STATUS_FAILURE: number;
  }
}

interface ApplePayButtonProps {
  amount: number;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export function ApplePayButton({ amount, onSuccess, onError }: ApplePayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Apple Pay is available
    checkApplePaySupport();
  }, []);

  const checkApplePaySupport = () => {
    try {
      // Check if we're on Safari (user agent detection)
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      // On Safari, assume Apple Pay might be available (domain verification happens at payment time)
      if (isSafari) {
        setIsSupported(true);
        return;
      }

      // Try to detect Apple Pay programmatically
      if (window.ApplePaySession && ApplePaySession.canMakePayments?.()) {
        setIsSupported(true);
      } else {
        setIsSupported(false);
      }
    } catch (err) {
      // Silently fail but don't disable Apple Pay on Safari
      console.warn("Apple Pay detection:", err);
      // On Safari, still show the button even if detection fails
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      setIsSupported(isSafari);
    }
  };

  const handleApplePay = async () => {
    setLoading(true);
    setError("");

    try {
      if (!window.ApplePaySession) {
        throw new Error("Apple Pay is not available in this browser. Please use Safari on iOS or macOS.");
      }

      // Check if we're in development/test mode (localhost)
      const isTestMode = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

      // For test mode, show alert with test information
      if (isTestMode) {
        const testMessage = `
Apple Pay Test Mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amount: $${amount.toFixed(2)}

Using Test Card:
Card: 4111 1111 1111 1111
Expiry: Any future date
CVC: Any 3 digits

Note: Apple Pay requires HTTPS in production.
In development, use the card payment method below.
        `;
        alert(testMessage);
        throw new Error("Apple Pay available in production. Use card payment for testing on localhost.");
      }

      // Create Apple Pay payment request
      const paymentRequest = {
        countryCode: "US",
        currencyCode: "USD",
        supportedNetworks: ["visa", "masterCard", "amex", "discover"],
        merchantCapabilities: ["supports3DS"],
        total: {
          label: "Meyaar Jewellers",
          amount: amount.toFixed(2),
        },
      };

      const session = new ApplePaySession(3, paymentRequest as any);

      // Merchant validation
      session.onvalidatemerchant = async (event: any) => {
        try {
          const validationURL = event.validationURL;
          
          const response = await fetch("/api/validate-apple-pay", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ validationURL }),
          });

          const data = await response.json();
          
          if (response.ok) {
            session.completeMerchantValidation(data.merchantSession);
          } else {
            session.abort();
            throw new Error("Merchant validation failed");
          }
        } catch (err) {
          session.abort();
          throw err;
        }
      };

      // Payment method selected
      session.onpaymentmethodselected = (event: any) => {
        session.completePaymentMethodSelection({
          newTotal: {
            label: "Meyaar Jewellers",
            amount: amount.toFixed(2),
          },
        });
      };

      // Payment authorized
      session.onpaymentauthorized = async (event: any) => {
        try {
          const paymentData = event.payment;
          const token = paymentData.token.paymentData;

          // Send to backend for processing
          const response = await fetch("/api/process-apple-pay", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentToken: token,
              amount: amount,
              currency: "USD",
            }),
          });

          const data = await response.json();

          if (response.ok) {
            session.completePayment((window.ApplePaySession as any).STATUS_SUCCESS);
            if (onSuccess) {
              onSuccess(data.paymentId);
            }
          } else {
            session.completePayment((window.ApplePaySession as any).STATUS_FAILURE);
            throw new Error(data.message || "Payment processing failed");
          }
        } catch (err) {
          session.completePayment((window.ApplePaySession as any).STATUS_FAILURE);
          const errorMessage =
            err instanceof Error ? err.message : "Payment processing failed";
          setError(errorMessage);
          if (onError) {
            onError(errorMessage);
          }
        } finally {
          setLoading(false);
        }
      };

      session.oncancel = () => {
        setLoading(false);
      };

      session.begin();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Apple Pay payment failed";
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="cursor-not-allowed opacity-50 pointer-events-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl">🍎</span>
            Apple Pay
            <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
              Not Available
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          <p>Apple Pay is not available on your device or browser. Use our card payment method instead.</p>
          <p className="text-xs mt-2 text-gray-500">Apple Pay requires HTTPS and Safari on iOS/macOS.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="text-2xl">🍎</span>
          Apple Pay
          {window.location.hostname === "localhost" && (
            <span className="ml-auto text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">
              Test Mode
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-600 space-y-4">
        {window.location.hostname === "localhost" ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
            <p className="font-semibold text-blue-900 mb-2">🧪 Development Mode</p>
            <p className="text-blue-800">Apple Pay requires HTTPS in production. For testing, use the card payment method with:</p>
            <ul className="mt-2 text-xs text-blue-700 space-y-1 ml-4">
              <li>• Card: <span className="font-mono">4111 1111 1111 1111</span></li>
              <li>• Expiry: Any future date (MM/YY)</li>
              <li>• CVC: Any 3 digits</li>
            </ul>
          </div>
        ) : (
          <p>Fast and secure payment with Apple Pay. Pay with your saved cards and identity without entering your payment details.</p>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {window.location.hostname === "localhost" ? (
          <Button
            disabled={true}
            className="w-full py-6 bg-gray-400 text-white font-semibold text-lg cursor-not-allowed"
          >
            <span className="mr-2">🔒</span>
            Use Card Payment for Testing (HTTPS Required)
          </Button>
        ) : (
          <Button
            onClick={handleApplePay}
            disabled={loading}
            className="w-full py-6 bg-black hover:bg-gray-900 text-white font-semibold text-lg"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing with Apple Pay...
              </>
            ) : (
              <>
                <span className="mr-2">🍎</span>
                Pay ${amount.toFixed(2)} with Apple Pay
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
