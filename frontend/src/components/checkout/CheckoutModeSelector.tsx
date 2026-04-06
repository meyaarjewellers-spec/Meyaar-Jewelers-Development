import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CheckoutModeSelectorProps {
  onSelectGuest: () => void;
  onSelectSignIn: () => void;
  authAvailable: boolean;
}

export function CheckoutModeSelector({
  onSelectGuest,
  onSelectSignIn,
  authAvailable,
}: CheckoutModeSelectorProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
          <span className="text-3xl">👤</span>
          Choose Checkout Method
        </h2>
        <p className="text-gray-600">Continue as guest or create/sign in to your account</p>
      </div>

      <div className="space-y-4">
        {/* Guest Checkout Card */}
        <Card
          onClick={onSelectGuest}
          className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              Continue as Guest
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p>Quick checkout without creating an account. Perfect for one-time purchases.</p>
          </CardContent>
        </Card>

        {/* Sign In / Create Account Card */}
        {authAvailable && (
          <Card
            onClick={onSelectSignIn}
            className="cursor-pointer hover:border-amber-900 hover:bg-amber-50 transition"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                Sign In / Create Account
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              <p>Sign in to your Meyaar account or create a new one to save your information and track orders.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
