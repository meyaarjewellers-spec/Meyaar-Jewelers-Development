import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Gift, Mail } from "lucide-react";

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
    <Card>
      <CardHeader>
        <CardTitle>👤 Choose Checkout Method</CardTitle>
        <CardDescription>Continue as guest or create/sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start h-12"
          onClick={onSelectGuest}
        >
          <Gift className="mr-2 h-4 w-4" />
          🎁 Continue as Guest
        </Button>
        {authAvailable && (
          <>
            <Separator />
            <Button
              variant="outline"
              className="w-full justify-start h-12"
              onClick={onSelectSignIn}
            >
              <Mail className="mr-2 h-4 w-4" />
              📧 Sign In / Create Account
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
