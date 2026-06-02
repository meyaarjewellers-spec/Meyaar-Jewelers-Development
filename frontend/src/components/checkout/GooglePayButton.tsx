import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Declare Google Pay types
declare global {
  interface Window {
    google?: {
      payments?: {
        api?: {
          PaymentsClient: any;
        };
      };
    };
  }
}

interface GooglePayButtonProps {
  amount: number;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export function GooglePayButton({ amount, onSuccess, onError }: GooglePayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Google Pay is available on this device
    checkGooglePaySupport();
  }, []);

  const checkGooglePaySupport = async () => {
    try {
      const request = {
        apiVersion: 2,
        apiVersionMinor: 0,
      };

      if (window.google?.payments?.api?.PaymentsClient) {
        const client = new window.google.payments.api.PaymentsClient({
          environment: "TEST",
        });

        const isReadyToPayRequest = {
          ...request,
          allowedPaymentMethods: [
            {
              type: "CARD",
              parameters: {
                allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX", "DISCOVER"],
              },
            },
          ],
        };

        const response = await client.isReadyToPay(isReadyToPayRequest);
        setIsSupported(response.result);
      }
    } catch (err) {
      console.warn("Google Pay not available:", err);
      setIsSupported(false);
    }
  };

  const handleGooglePay = async () => {
    setLoading(true);
    setError("");

    try {
      if (!window.google?.payments?.api?.PaymentsClient) {
        throw new Error("Google Pay is not available on this device");
      }

      const client = new window.google.payments.api.PaymentsClient({
        environment: "TEST",
      });

      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX", "DISCOVER"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "stripe",
                stripeMerchantId: "acct_1TIEuQDAYcXUBA0y",
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: "BCR2DN5TU3RYRASP",
          merchantName: "Meyaar Jewellers",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPrice: amount.toFixed(2),
          currencyCode: "USD",
        },
        shippingAddressRequired: true,
        shippingAddressParameters: {
          allowedCountryCodes: ["US"],
          phoneNumberRequired: false,
        },
      };

      const paymentData = await client.loadPaymentData(paymentDataRequest);

      // Send payment token to backend
      const response = await fetch("/api/process-google-pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentToken: paymentData.paymentMethodData.tokenizationData.token,
          amount: amount,
          currency: "USD",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google Pay payment failed");
      }

      if (onSuccess) {
        onSuccess(data.paymentId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Google Pay payment failed";
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="cursor-not-allowed opacity-50 pointer-events-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl">🔵</span>
            Google Pay
            <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
              Not Available
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          <p>Google Pay is not available on your device or browser.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="text-2xl">🔵</span>
          Google Pay
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-600 space-y-4">
        <p>Quick and secure payment with Google Pay. Your payment information stays safe and secure.</p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handleGooglePay}
          disabled={loading}
          className="w-full py-6 bg-amber-900 hover:bg-amber-800 text-white font-semibold text-lg"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Processing with Google Pay...
            </>
          ) : (
            <>
              <span className="mr-2">🔵</span>
              Pay ${amount.toFixed(2)} with Google Pay
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
