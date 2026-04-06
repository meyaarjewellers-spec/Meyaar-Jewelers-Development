import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutMethod() {
  const [, setLocation] = useLocation();
  const { items } = useCart();

  const subtotal = items.reduce((sum: number, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <button
            onClick={() => setLocation("/checkout")}
            className="text-2xl hover:opacity-70"
          >
            ←
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
          {/* Checkout Methods */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">👤 Choose Checkout Method</h2>

            {/* Guest Checkout */}
            <Card
              className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition"
              onClick={() => setLocation("/checkout?mode=guest")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🛒</span>
                  Guest Checkout
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p>
                  Quick checkout without creating an account. Perfect for
                  one-time purchases.
                </p>
              </CardContent>
            </Card>

            {/* Sign In */}
            <Card
              className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition"
              onClick={() => setLocation("/checkout?mode=signin")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🔐</span>
                  Sign In to Your Account
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p>
                  Sign in to your Meyaar account to save your information,
                  track orders, and enjoy faster checkout next time.
                </p>
              </CardContent>
            </Card>

            {/* Sign Up */}
            <Card
              className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition"
              onClick={() => setLocation("/checkout?mode=signup")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  Create New Account
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p>
                  Create an account to get exclusive benefits, early access to
                  new collections, and personalized recommendations.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">💳 Payment Method</h2>

            {/* Debit / Credit Card */}
            <Card className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  Debit or Credit Card
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <p>Pay securely using your Visa, Mastercard, American Express, or Discover card.</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-900"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-900"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-900"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Apple Pay */}
            <Card className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🍎</span>
                  Apple Pay
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p>
                  Fast and secure payment with Apple Pay. Pay with your saved cards and identity
                  without entering your payment details.
                </p>
              </CardContent>
            </Card>

            {/* Google Pay */}
            <Card className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🔵</span>
                  Google Pay
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p>
                  Quick checkout with Google Pay. Your payment information stays safe and secure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Total Sidebar - Right Side */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">📋 Order Total</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              {/* Total */}
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <Button 
                className="w-full py-6 bg-amber-900 hover:bg-amber-800 text-white text-lg font-semibold flex justify-between mt-4"
              >
                <span className="w-4" />
                <span className="flex-1 text-center">Place Order</span>
                <span>→</span>
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>

        {/* Continue Shopping Button */}
        <div className="mt-8 max-w-2xl">
          <Button
            variant="outline"
            className="w-full py-6 flex justify-between"
            onClick={() => setLocation("/")}
          >
            <span>←</span>
            <span className="flex-1 text-center">Continue Shopping</span>
            <span className="w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
