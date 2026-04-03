import { useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import { AlertTriangle } from "lucide-react";
import { useCheckout } from "@/components/checkout/useCheckout";
import { CheckoutModeSelector } from "@/components/checkout/CheckoutModeSelector";
import { AuthForm } from "@/components/checkout/AuthForm";
import { GuestCheckoutForm } from "@/components/checkout/GuestCheckoutForm";
import { UserSignedInCard } from "@/components/checkout/UserSignedInCard";
import { CartItemsList } from "@/components/checkout/CartItemsList";
import { PromoCodeSection } from "@/components/checkout/PromoCodeSection";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { OrderTotalSidebar } from "@/components/checkout/OrderTotalSidebar";

export default function Checkout() {
  const [, setLocation] = useLocation();

  const {
    checkoutMode,
    setCheckoutMode,
    paymentMethod,
    setPaymentMethod,
    promoCode,
    setPromoCode,
    promoApplied,
    isLoading,
    isSignUp,
    setIsSignUp,
    authForm,
    setAuthForm,
    guestForm,
    setGuestForm,
    cartItems,
    itemCount,
    user,
    authAvailable,
    subtotal,
    discount,
    tax,
    total,
    handleRemoveItem,
    handleApplyPromo,
    handleRemovePromo,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleEmailAuth,
    handleAuthOrderSubmit,
    handleGuestOrderSubmit,
    signOut,
  } = useCheckout();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header cartItemCount={itemCount} />

      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🛒 Checkout</h1>
          <p className="text-gray-600">Review your order and complete purchase</p>
        </div>

        {!authAvailable && (
          <Alert className="mb-6 border-yellow-300 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Demo Mode:</strong> Supabase is not configured. Guest checkout is available for testing.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mode Selection */}
            {checkoutMode === "select" && (
              <CheckoutModeSelector
                onSelectGuest={() => setCheckoutMode("guest")}
                onSelectSignIn={() => setCheckoutMode("signin")}
                authAvailable={authAvailable}
              />
            )}

            {/* Authentication */}
            {checkoutMode === "signin" && !user && authAvailable && (
              <AuthForm
                isSignUp={isSignUp}
                onToggleSignUp={() => setIsSignUp(!isSignUp)}
                authForm={authForm}
                onAuthFormChange={setAuthForm}
                onGoogleSignIn={handleGoogleSignIn}
                onAppleSignIn={handleAppleSignIn}
                onEmailAuth={handleEmailAuth}
                onBack={() => setCheckoutMode("select")}
                isLoading={isLoading}
              />
            )}

            {/* Guest Checkout Form */}
            {checkoutMode === "guest" && (
              <GuestCheckoutForm
                guestForm={guestForm}
                onGuestFormChange={setGuestForm}
              />
            )}

            {/* User Signed In */}
            {user && checkoutMode === "auth" && (
              <UserSignedInCard
                user={user}
                onSignOut={() => {
                  signOut();
                  setCheckoutMode("select");
                }}
              />
            )}

            {/* Cart Items & Additional Sections */}
            {(checkoutMode === "guest" || checkoutMode === "auth" || (checkoutMode === "signin" && user)) && (
              <>
                <CartItemsList
                  items={cartItems}
                  onRemoveItem={handleRemoveItem}
                />

                <PromoCodeSection
                  promoCode={promoCode}
                  onPromoCodeChange={setPromoCode}
                  promoApplied={promoApplied}
                  onApplyPromo={handleApplyPromo}
                  onRemovePromo={handleRemovePromo}
                />

                <PaymentMethodSelector
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                />
              </>
            )}
          </div>

          {/* Order Total Sidebar */}
          <OrderTotalSidebar
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            total={total}
            promoApplied={promoApplied}
            checkoutMode={checkoutMode}
            isLoading={isLoading}
            user={user}
            guestForm={guestForm}
            onGuestOrderSubmit={handleGuestOrderSubmit}
            onAuthOrderSubmit={handleAuthOrderSubmit}
          />
        </div>
      </div>
    </div>
  );
}
