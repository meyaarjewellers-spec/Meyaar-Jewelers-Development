import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowRight, X } from "lucide-react";
import { calculateTaxWithStripe } from "@/lib/taxService";

interface OrderTotalSidebarProps {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  promoApplied: boolean;
  checkoutMode: "select" | "guest" | "auth" | "signin";
  isLoading: boolean;
  user: any;
  guestForm: { guestEmail: string; guestName: string };
  onGuestOrderSubmit: () => void;
  onAuthOrderSubmit: () => void;
}

export function OrderTotalSidebar({
  subtotal,
  discount,
  total,
  promoApplied,
  checkoutMode,
  isLoading,
  user,
  guestForm,
  onGuestOrderSubmit,
  onAuthOrderSubmit,
}: OrderTotalSidebarProps) {
  const [, setLocation] = useLocation();
  const [zipCode, setZipCode] = useState("");
  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  const [isTaxLoading, setIsTaxLoading] = useState(false);
  const [taxError, setTaxError] = useState<string | null>(null);

  const handleCheckTax = async () => {
    if (!zipCode.trim() || zipCode.length < 5) {
      setTaxError("Please enter a valid 5-digit ZIP code");
      return;
    }

    setIsTaxLoading(true);
    setTaxError(null);

    try {
      const result = await calculateTaxWithStripe(zipCode, subtotal);
      if (result.success) {
        setCalculatedTax(result.tax);
        setTaxError(null);
      } else {
        setTaxError(result.error || "Failed to calculate tax");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to calculate tax";
      setTaxError(errorMsg);
    } finally {
      setIsTaxLoading(false);
    }
  };

  const handleClearTax = () => {
    setZipCode("");
    setCalculatedTax(null);
    setTaxError(null);
  };

  const finalTax = calculatedTax !== null ? calculatedTax : 0;
  const finalTotal = subtotal - discount + finalTax;

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="text-lg">📋 Order Total</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-green-600">
                <span>Discount (10%)</span>
                <span className="font-medium">-${discount.toFixed(2)}</span>
              </div>
            )}
            
            {/* Tax & Zip Code Section */}
            <div className="space-y-2 pt-2">
              {/* Tax Display */}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">
                  {calculatedTax !== null 
                    ? `$${finalTax.toFixed(2)}`
                    : <span className="text-gray-500 text-sm italic">Enter zip code</span>
                  }
                </span>
              </div>

              {/* Zip Code Input or Display */}
              {calculatedTax === null ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.slice(0, 5))}
                    className="flex-1"
                    maxLength={5}
                    disabled={isTaxLoading}
                  />
                  <Button 
                    size="icon"
                    onClick={handleCheckTax}
                    disabled={!zipCode.trim() || isTaxLoading}
                    className="bg-amber-900 hover:bg-amber-900/90"
                    title="Calculate tax"
                  >
                    {isTaxLoading ? (
                      <span className="h-4 w-4 animate-spin inline-block">⚙︎</span>
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border">
                  <span className="text-sm font-semibold text-gray-700">
                    {zipCode}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleClearTax}
                    className="h-6 w-6 hover:bg-red-100"
                    title="Edit ZIP code"
                  >
                    <X className="h-4 w-4 text-gray-500 hover:text-red-600" />
                  </Button>
                </div>
              )}

              {/* Error message */}
              {taxError && (
                <div className="text-sm text-red-600 text-center">{taxError}</div>
              )}
            </div>
          </div>
          
          <Separator />
          <div className="flex justify-between text-lg">
            <span className="font-bold">Total</span>
            <span className="font-bold text-emerald-600">${finalTotal.toFixed(2)}</span>
          </div>

          {checkoutMode === "select" || (checkoutMode === "signin" && !user) ? (
            <Button 
              variant="outline"
              className="w-full flex justify-between"
              onClick={() => setLocation("/checkout-method")}
            >
              <span className="w-4" /> {/* Left spacer */}
              <span className="flex-1 text-center">Checkout</span>
              <span>→</span>
            </Button>
          ) : null}

          {checkoutMode === "guest" && (
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
              onClick={onGuestOrderSubmit}
              disabled={isLoading || !guestForm.guestEmail || !guestForm.guestName}
            >
              {isLoading ? "Processing..." : "✅ Complete Purchase (Guest)"}
            </Button>
          )}

          {user && checkoutMode === "auth" && (
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
              onClick={onAuthOrderSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "✅ Complete Purchase"}
            </Button>
          )}

          <Button variant="outline" className="w-full flex justify-between" onClick={() => setLocation("/")}>
            <span>←</span>
            <span className="flex-1 text-center">Continue Shopping</span>
            <span className="w-4" /> {/* Spacer */}
          </Button>
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <div className="mt-4 space-y-2 text-center text-sm text-gray-600">
        <p>🔒 Secure checkout</p>
        <p>💚 Free returns within 30 days</p>
        <p>🚚 Free shipping on orders over $500</p>
      </div>
    </div>
  );
}
