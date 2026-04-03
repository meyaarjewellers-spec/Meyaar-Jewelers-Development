import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";

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
  tax,
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
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-lg">
            <span className="font-bold">Total</span>
            <span className="font-bold text-emerald-600">${total.toFixed(2)}</span>
          </div>

          {checkoutMode === "select" || (checkoutMode === "signin" && !user) ? (
            <Button variant="outline" className="w-full" disabled>
              ← Select checkout method first
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

          <Button variant="outline" className="w-full" onClick={() => setLocation("/")}>
            ← Continue Shopping
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
