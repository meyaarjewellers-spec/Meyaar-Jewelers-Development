import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { IMAGES } from "@/lib/imageConfig";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";

export default function Authentication() {
  const [, setLocation] = useLocation();
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailNewsCheckbox, setEmailNewsCheckbox] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error:", error);
      setIsLoading(false);
    }
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Email integration will be added later
      console.log("Email sign-in with:", email, "Newsletter:", emailNewsCheckbox);
      // For now, we'll just show an alert
      alert("Email sign-in will be integrated soon!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between px-4 py-8">
      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg px-8 py-4 shadow-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={IMAGES.logoTransparent}
            alt="Meyaar"
            className="h-60 w-auto"
          />
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-4 px-4 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all mb-6 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <span className="text-gray-700 font-semibold">Signing in...</span>
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-gray-900 font-semibold">Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-600 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailContinue} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
            style={{
              boxShadow: email ? `0 0 0 3px rgba(167, 98, 68, 0.1), 0 0 0 2px rgb(167, 98, 68)` : 'none'
            }}
            required
          />

          <button
            type="submit"
            disabled={!email || isLoading}
            className="w-full py-3 px-4 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{backgroundColor: 'rgb(167, 98, 68)'}}
          >
            Continue
          </button>
        </form>

        {/* Checkbox */}
        <div className="flex items-center gap-3 my-6">
          <Checkbox
            id="newsletter"
            checked={emailNewsCheckbox}
            onCheckedChange={(checked) =>
              setEmailNewsCheckbox(checked as boolean)
            }
          />
          <label
            htmlFor="newsletter"
            className="text-sm text-gray-700 cursor-pointer"
          >
            Email me with news and offers
          </label>
        </div>

        {/* Terms */}
        <p className="text-sm text-gray-600 text-center mb-8">
          By continuing, you agree to our{" "}
          <Link href="/terms-conditions">
            <a className="text-gray-900 font-semibold hover:underline">
              Terms & Conditions
            </a>
          </Link>
        </p>
      </div>
      </div>

      {/* Privacy Policy - Outside Box */}
      <p className="text-sm text-gray-600 text-center mb-4">
        <Link href="/privacy-policy">
          <a className="text-gray-900 font-semibold hover:underline">
            Privacy Policy
          </a>
        </Link>
      </p>
    </div>
  );
}
