import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingCart, CreditCard, Apple, Gift, Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple-pay">("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // Mock cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Gold Necklace ✨",
      price: 299.99,
      quantity: 1,
      image: "🔗",
    },
    {
      id: "2",
      name: "Diamond Ring 💍",
      price: 599.99,
      quantity: 1,
      image: "💎",
    },
    {
      id: "3",
      name: "Pearl Earrings 👑",
      price: 199.99,
      quantity: 2,
      image: "👂",
    },
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0; // 10% discount
  const tax = (subtotal - discount) * 0.1; // 10% tax
  const total = subtotal - discount + tax;

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setPromoApplied(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header cartItemCount={3} />

      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🛒 Checkout</h1>
          <p className="text-gray-600">Review your order and complete purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary ({cartItems.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{item.image}</div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gift className="h-5 w-5" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code (e.g., SAVE10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    className="placeholder:text-gray-400"
                  />
                  {!promoApplied ? (
                    <Button onClick={handleApplyPromo} className="bg-emerald-600 hover:bg-emerald-700">
                      Apply
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={handleRemovePromo}>
                      Remove
                    </Button>
                  )}
                </div>
                {promoApplied && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                    ✅ Promo code applied! 10% discount activated
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">💳 Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "card" | "apple-pay")}>
                  <div className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-4 w-4" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="apple-pay" id="apple-pay" />
                    <Label htmlFor="apple-pay" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Apple className="h-4 w-4" />
                      Apple Pay
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Form - Conditional */}
            {paymentMethod === "card" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">💳 Card Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardname">Cardholder Name</Label>
                    <Input
                      id="cardname"
                      placeholder="John Doe"
                      className="mt-1.5 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardnumber">Card Number</Label>
                    <Input
                      id="cardnumber"
                      placeholder="1234 5678 9012 3456"
                      className="mt-1.5 placeholder:text-gray-400 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        className="mt-1.5 placeholder:text-gray-400 font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        className="mt-1.5 placeholder:text-gray-400 font-mono"
                        type="password"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Apple Pay Info */}
            {paymentMethod === "apple-pay" && (
              <Card className="mt-6 bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Apple className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">Apple Pay Selected</p>
                      <p className="text-sm text-blue-700">👤 Logged in as: john@example.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Total */}
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

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg">
                  ✅ Complete Purchase
                </Button>
                <Button variant="outline" className="w-full">
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
