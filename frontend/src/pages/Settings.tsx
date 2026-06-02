import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signOut();
      setLocation("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to logout";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // If not logged in, redirect to home
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header cartItemCount={itemCount} />
        <div className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
          <Alert className="border-yellow-300 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You need to be logged in to access settings. <a href="/" className="underline font-semibold">Go back to home</a>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header cartItemCount={itemCount} />

      <div className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">⚙️ Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {error && (
          <Alert className="border-red-300 bg-red-50 mb-6">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <span className="text-2xl">👤</span>
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg font-medium">{user.email || "Not available"}</p>
            </div>

            {user.user_metadata?.name && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="text-lg font-medium">{user.user_metadata.name}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <span className="text-2xl">🔧</span>
              Account Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Future sections */}
            <div className="p-4 bg-gray-50 rounded-lg text-gray-600">
              <p className="text-sm">More settings coming soon...</p>
              <ul className="text-xs mt-2 space-y-1 text-gray-500">
                <li>• Profile Information</li>
                <li>• Address Book</li>
                <li>• Order History</li>
                <li>• Preferences</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Logout Section */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3 text-red-900">
              <span className="text-2xl">🚪</span>
              Logout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Sign out of your account and return to the login screen. You can sign in with a different account after logging out.
            </p>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Signing out...
                </>
              ) : (
                "Sign Out"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-8">
          <Button
            variant="outline"
            className="w-full py-3 font-semibold"
            onClick={() => setLocation("/")}
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
