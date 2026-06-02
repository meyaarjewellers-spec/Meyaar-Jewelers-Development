import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StripePaymentFormProps {
  amount: number;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export function StripePaymentForm({ amount, onSuccess, onError }: StripePaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate inputs
      if (!cardNumber.replace(/\s/g, "") || cardNumber.replace(/\s/g, "").length !== 16) {
        throw new Error("Please enter a valid 16-digit card number");
      }
      if (!expiryDate || expiryDate.split("/").join("").length !== 4) {
        throw new Error("Please enter a valid expiry date (MM/YY)");
      }
      if (!cvc || cvc.length < 3) {
        throw new Error("Please enter a valid CVC code");
      }

      // Create payment intent on backend
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
          cardNumber: cardNumber.replace(/\s/g, ""),
          expiryDate: expiryDate,
          cvc: cvc,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }

      // Success
      if (onSuccess) {
        onSuccess(data.paymentId);
      }

      // Reset form
      setCardNumber("");
      setExpiryDate("");
      setCvc("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment processing failed";
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="text-2xl">💳</span>
          Debit or Credit Card
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-600 space-y-4">
        <div className="flex items-center justify-between gap-2">
          {/* VISA */}
          <div className="flex-1 p-4 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg text-white font-bold text-center text-sm shadow-md hover:shadow-lg transition">
            VISA
          </div>
          {/* Mastercard */}
          <div className="flex-1 p-4 bg-gray-100 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition">
            <div className="w-7 h-7 rounded-full bg-red-600 shadow-sm"></div>
            <div className="w-7 h-7 rounded-full bg-orange-500 shadow-sm -ml-3"></div>
          </div>
          {/* American Express */}
          <div className="flex-1 p-4 bg-gradient-to-br from-blue-900 to-blue-950 rounded-lg text-white font-bold text-center text-xs shadow-md hover:shadow-lg transition">
            AMEX
          </div>
          {/* Discover */}
          <div className="flex-1 p-4 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg text-white font-bold text-center text-sm shadow-md hover:shadow-lg transition">
            DISCOVER
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-900"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={handleExpiryChange}
              maxLength={5}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-900"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
              maxLength={4}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-900"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-900 hover:bg-amber-800 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
