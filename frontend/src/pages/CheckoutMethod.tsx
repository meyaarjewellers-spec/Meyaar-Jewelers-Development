import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleCheckoutAuth } from "@/hooks/useGoogleCheckoutAuth";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { AuthenticationOptions } from "@/components/checkout/AuthenticationOptions";
import { PaymentMethodsSection } from "@/components/checkout/PaymentMethodsSection";
import { WelcomeMessage } from "@/components/checkout/WelcomeMessage";
import { LoadingState } from "@/components/checkout/LoadingState";
import { ContinueShoppingButton } from "@/components/checkout/ContinueShoppingButton";

export default function CheckoutMethod() {
  const [, setLocation] = useLocation();
  const { items, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { handleGoogleAuth, isLoading: googleLoading, error: googleError } = useGoogleCheckoutAuth();
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
  const [guestShippingComplete, setGuestShippingComplete] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [orderId, setOrderId] = useState('');

  // Display-only estimate. The authoritative subtotal/discount/shipping/tax/total
  // are computed by the server and shown inside the Payment Element step.
  const subtotal = items.reduce((sum: number, item) => sum + item.price * item.quantity, 0);

  // Extract first name from email or user metadata
  const firstName = user?.user_metadata?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Guest';

  // Handle guest checkout selection
  const handleGuestCheckout = () => {
    setIsGuestCheckout(true);
    setGuestShippingComplete(true);
  };

  // Handle payment success — receives the server-created order.
  const handlePaymentSuccess = (info: { orderNumber: string; orderId: string }) => {
    setPaymentStatus('success');
    setPaymentMessage(`Payment successful! Order ${info.orderNumber}`);
    setOrderId(info.orderNumber);
    clearCart();

    // Redirect to confirmation page after 2 seconds
    setTimeout(() => {
      setLocation('/confirmation?' + new URLSearchParams({ orderId: info.orderNumber }).toString());
    }, 2000);
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    setPaymentStatus('error');
    setPaymentMessage(error);
  };

  // If loading, show loading state
  if (authLoading) {
    return <LoadingState />;
  }

  // If user is logged in, show welcome message and payment methods
  if (user && !authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <CheckoutHeader onBackClick={() => setLocation("/checkout")} />
        <main className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <WelcomeMessage firstName={firstName} />
              
              {paymentStatus === 'success' && (
                <Card className="border-2 border-green-500 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">✅</span>
                      <div>
                        <p className="text-green-900 font-semibold">{paymentMessage}</p>
                        <p className="text-green-700 text-sm">Redirecting to confirmation page...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {paymentStatus === 'error' && (
                <Card className="border-2 border-red-500 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">❌</span>
                      <div>
                        <p className="text-red-900 font-semibold">Payment Failed</p>
                        <p className="text-red-700 text-sm">{paymentMessage}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {paymentStatus === 'idle' && (
                <PaymentMethodsSection
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              )}
              
              <ContinueShoppingButton />
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

                  {/* Shipping, discount and tax are calculated by the server
                      and shown on the secure payment step. */}
                  <div className="text-xs text-gray-500">
                    Shipping &amp; tax calculated at payment.
                  </div>

                  {/* Estimated total (server confirms the final amount) */}
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Estimated total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Not logged in - show checkout options
  return (
    <div className="min-h-screen bg-white">
      <CheckoutHeader onBackClick={isGuestCheckout ? () => setIsGuestCheckout(false) : undefined} />
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Checkout Methods - Only show if not logged in */}
            {!user && !authLoading && !isGuestCheckout && (
              <AuthenticationOptions
                onGoogleAuth={handleGoogleAuth}
                googleLoading={googleLoading}
                onGuestCheckout={handleGuestCheckout}
              />
            )}

            {/* Payment Methods - Show if logged in or guest selected */}
            {((user && !authLoading) || (isGuestCheckout && guestShippingComplete)) && (
              <>
                {isGuestCheckout && <h2 className="text-2xl font-bold" style={{ color: 'rgb(167, 98, 68)' }}>Hi, Guest!</h2>}
                
                {paymentStatus === 'success' && (
                  <Card className="border-2 border-green-500 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">✅</span>
                        <div>
                          <p className="text-green-900 font-semibold">{paymentMessage}</p>
                          <p className="text-green-700 text-sm">Redirecting to confirmation page...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {paymentStatus === 'error' && (
                  <Card className="border-2 border-red-500 bg-red-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">❌</span>
                        <div>
                          <p className="text-red-900 font-semibold">Payment Failed</p>
                          <p className="text-red-700 text-sm">{paymentMessage}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {paymentStatus === 'idle' && (
                  <PaymentMethodsSection 
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                )}
                
                <ContinueShoppingButton />
              </>
            )}
            
            {/* Continue Shopping - Only show for initial checkout options */}
            {!user && !authLoading && !isGuestCheckout && <ContinueShoppingButton />}
          </div>

          {/* Order Total Sidebar - Right Sixsde */}
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

                {/* Shipping, discount and tax are calculated by the server
                    and shown on the secure payment step. */}
                <div className="text-xs text-gray-500">
                  Shipping &amp; tax calculated at payment.
                </div>

                {/* Estimated total (server confirms the final amount) */}
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Estimated total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
