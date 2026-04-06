import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Apple } from "lucide-react";

interface AuthFormProps {
  isSignUp: boolean;
  onToggleSignUp: () => void;
  authForm: {
    email: string;
    password: string;
    displayName: string;
  };
  onAuthFormChange: (form: { email: string; password: string; displayName: string }) => void;
  onGoogleSignIn: () => void;
  onAppleSignIn: () => void;
  onEmailAuth: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function AuthForm({
  isSignUp,
  onToggleSignUp,
  authForm,
  onAuthFormChange,
  onGoogleSignIn,
  onAppleSignIn,
  onEmailAuth,
  onBack,
  isLoading,
}: AuthFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🔐 {isSignUp ? "Create Account" : "Sign In"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button className="w-full" variant="outline" onClick={onGoogleSignIn} disabled={isLoading}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
            </svg>
            Google
          </Button>
          <Button className="w-full" variant="outline" onClick={onAppleSignIn} disabled={isLoading}>
            <Apple className="mr-2 h-4 w-4" />
            Apple
          </Button>
        </div>

        <Separator />

        <div className="space-y-3">
          {isSignUp && (
            <div>
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                placeholder="John Doe"
                value={authForm.displayName}
                onChange={(e) => onAuthFormChange({ ...authForm, displayName: e.target.value })}
                className="mt-1.5"
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={authForm.email}
              onChange={(e) => onAuthFormChange({ ...authForm, email: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={authForm.password}
              onChange={(e) => onAuthFormChange({ ...authForm, password: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <Button className="w-full" onClick={onEmailAuth} disabled={isLoading}>
            {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
          <Button variant="ghost" className="w-full" onClick={onToggleSignUp}>
            {isSignUp ? "Already have an account? Sign In" : "Create new account"}
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full"
          onClick={onBack}
        >
          ← Back
        </Button>
      </CardContent>
    </Card>
  );
}
