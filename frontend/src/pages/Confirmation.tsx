import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";

export default function Confirmation() {
  const [location, setLocation] = useLocation();
  const { itemCount } = useCart();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Get order ID from URL parameters
    const params = new URLSearchParams(location.split("?")[1]);
    const id = params.get("orderId");
    if (id) {
      setOrderId(id);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header cartItemCount={itemCount} />

      <div className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        {/* Success Message */}
        <div className="text-center space-y-6 mb-8">
          <div className="text-6xl">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>✅</span>
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-mono text-lg font-semibold text-gray-900">
                  {orderId}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold text-green-700">
                  Payment Received ✓
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Confirmation Email</p>
                <p className="text-lg font-semibold text-gray-900">
                  Sent to your email address
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">📋 What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="text-2xl">📧</div>
                <div>
                  <p className="font-semibold text-gray-900">Check Your Email</p>
                  <p className="text-sm text-gray-600">
                    A confirmation email has been sent with your order details and tracking information.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-2xl">📦</div>
                <div>
                  <p className="font-semibold text-gray-900">Shipping Information</p>
                  <p className="text-sm text-gray-600">
                    Your order will be shipped within 1-2 business days. You'll receive a tracking number via email.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-2xl">💬</div>
                <div>
                  <p className="font-semibold text-gray-900">Need Help?</p>
                  <p className="text-sm text-gray-600">
                    If you have any questions, contact us at <span className="font-semibold">support@meyaarjewellers.com</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            className="w-full py-6 bg-amber-900 hover:bg-amber-800 text-white font-semibold text-lg"
            onClick={() => setLocation("/")}
          >
            ← Continue Shopping
          </Button>
          
          <Button
            variant="outline"
            className="w-full py-6 font-semibold text-lg"
            onClick={() => setLocation("/shop/necklaces")}
          >
            Browse Jewelry Collection →
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-semibold text-blue-900">Your Transaction is Secure</p>
              <p className="text-sm text-blue-700 mt-1">
                All payments are encrypted and processed securely through Stripe. Your payment information is safe with us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
