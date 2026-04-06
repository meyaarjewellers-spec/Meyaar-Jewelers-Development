import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import { AlertTriangle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";
import { CartItemsList, TaxSection } from "@/components/checkout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, removeItem, updateQuantity, itemCount } = useCart();
  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<"free" | "standard" | "express" | null>(null);
  
  const subtotal = items.reduce((sum: number, item) => sum + item.price * item.quantity, 0);
  const shippingCost = selectedShipping === "standard" ? 5.99 : selectedShipping === "express" ? 14.99 : 0;
  const total = subtotal + (calculatedTax || 0) + shippingCost;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header cartItemCount={itemCount} />

      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🛒 Your Cart</h1>
          <p className="text-gray-600">Review your items before checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            {items.length > 0 && (
              <CartItemsList
                items={items}
                onRemoveItem={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            )}

            {!items.length && (
              <Alert className="border-gray-300 bg-gray-50">
                <AlertTriangle className="h-4 w-4 text-gray-600" />
                <AlertDescription className="text-gray-800">
                  Your cart is empty. <a href="/shop/necklaces" className="underline font-semibold">Continue shopping</a>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Order Total Sidebar */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">📋 Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Tax Section */}
                  <TaxSection subtotal={subtotal} onTaxCalculated={setCalculatedTax} />

                  {/* Shipping Info */}
                  <div className="space-y-3 border-t pt-4">
                    <h3 className="font-semibold text-gray-700">📦 Shipping Options</h3>
                    {subtotal >= 75 ? (
                      <div 
                        onClick={() => setSelectedShipping("free")}
                        className={`p-3 border rounded-md cursor-pointer transition ${selectedShipping === "free" ? "border-green-700 bg-green-50" : "border-green-500 bg-green-50"}`}
                      >
                        <div className="font-medium text-green-900">FREE Standard Shipping</div>
                        <div className="text-green-700 text-xs">🎉 Free delivery on orders over $75!</div>
                        <div className="text-green-900 font-semibold mt-1">5-7 business days</div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <div 
                          onClick={() => setSelectedShipping("standard")}
                          className={`p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition ${selectedShipping === "standard" ? "border-amber-900 bg-amber-50" : ""}`}
                        >
                          <div className="font-medium text-gray-900">Standard Shipping</div>
                          <div className="text-gray-600 text-xs">5-7 business days</div>
                          <div className="text-amber-900 font-semibold mt-1">$5.99</div>
                        </div>
                        <div 
                          onClick={() => setSelectedShipping("express")}
                          className={`p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition ${selectedShipping === "express" ? "border-amber-900 bg-amber-50" : ""}`}
                        >
                          <div className="font-medium text-gray-900">Express Shipping</div>
                          <div className="text-gray-600 text-xs">2-3 business days</div>
                          <div className="text-amber-900 font-semibold mt-1">$14.99</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full py-3 bg-amber-900 hover:bg-amber-800 text-white font-semibold flex justify-between"
                    onClick={() => setLocation("/checkout-method")}
                  >
                    <span className="w-4" />
                    <span className="flex-1 text-center">Checkout</span>
                    <span>→</span>
                  </Button>

                  {/* Continue Shopping Button */}
                  <Button
                    className="w-full py-3 bg-amber-900 hover:bg-amber-800 text-white font-semibold flex justify-between"
                    onClick={() => setLocation("/")}
                  >
                    <span>←</span>
                    <span className="flex-1 text-center">Continue Shopping</span>
                    <span className="w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
