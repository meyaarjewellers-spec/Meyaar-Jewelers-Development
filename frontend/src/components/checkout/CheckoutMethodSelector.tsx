import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface CheckoutMethodSelectorProps {
  onGoogleAuth: () => void;
  onCreateAccount: () => void;
  onGuestCheckout: () => void;
  isLoading?: boolean;
}

export function CheckoutMethodSelector({
  onGoogleAuth,
  onCreateAccount,
  onGuestCheckout,
  isLoading = false,
}: CheckoutMethodSelectorProps) {
  const { authAvailable } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleClick = async () => {
    setGoogleLoading(true);
    try {
      await onGoogleAuth();
    } catch (error) {
      console.error('Google auth error:', error);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">🛒 Checkout</h2>
        <p className="text-gray-600">Choose how you'd like to continue</p>
      </div>

      <div className="space-y-4">
        {/* Google OAuth - PRIMARY OPTION */}
        {authAvailable && (
          <Card className="border-2 border-amber-900 bg-gradient-to-r from-amber-50 to-yellow-50 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-3">
                <span className="text-2xl">🔐</span>
                Sign in with Google
              </CardTitle>
              <CardDescription className="text-sm">
                Fastest way to checkout - One click, secure, and your info is auto-filled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleGoogleClick}
                disabled={googleLoading || isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 h-12 font-semibold"
              >
                {googleLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="mr-2">G</span>
                    Continue with Google
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Account - SECONDARY OPTION */}
        {authAvailable && (
          <Card className="hover:border-amber-600 hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-3">
                <span className="text-2xl">📧</span>
                Create Account
              </CardTitle>
              <CardDescription className="text-sm">
                Sign up with email and password to save your info and track orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={onCreateAccount}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 font-semibold"
              >
                Create New Account
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Guest Checkout - TERTIARY OPTION */}
        <Card className="border-gray-200 hover:border-gray-400 hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              Continue as Guest
            </CardTitle>
            <CardDescription className="text-sm">
              No account needed. Quick checkout for one-time purchases.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={onGuestCheckout}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 font-semibold text-gray-600"
            >
              Continue as Guest
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Promise */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">🔒 Your data is secure.</span> All transactions are encrypted and PCI compliant.
        </p>
      </div>
    </div>
  );
}
