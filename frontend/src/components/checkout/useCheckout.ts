import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { createOrder, createGuestOrder } from "@/lib/supabaseService";

interface AuthForm {
  email: string;
  password: string;
  displayName: string;
}

interface GuestForm {
  guestName: string;
  guestEmail: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

type CheckoutMode = "select" | "guest" | "auth" | "signin";

export function useCheckout() {
  const { user, signInWithGoogle, signInWithApple, signUpWithEmail, signInWithEmail, signOut, authAvailable } = useAuth();
  const { items: cartItems, removeItem, itemCount, total: cartTotal } = useCart();
  const { toast } = useToast();

  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>("select");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple-pay">("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [authForm, setAuthForm] = useState<AuthForm>({
    email: "",
    password: "",
    displayName: "",
  });

  const [guestForm, setGuestForm] = useState<GuestForm>({
    guestName: "",
    guestEmail: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  });

  // Calculations
  const subtotal = cartTotal;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.1;
  const total = subtotal - discount + tax;

  // Handlers
  const handleRemoveItem = (id: string) => {
    removeItem(id);
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

  // Auth handlers
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      setCheckoutMode("auth");
      toast({
        title: "Success",
        description: "Signed in with Google",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithApple();
      setCheckoutMode("auth");
      toast({
        title: "Success",
        description: "Signed in with Apple",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Apple",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    try {
      setIsLoading(true);
      if (isSignUp) {
        await signUpWithEmail(authForm.email, authForm.password, authForm.displayName);
        toast({
          title: "Success",
          description: "Account created successfully",
        });
      } else {
        await signInWithEmail(authForm.email, authForm.password);
        toast({
          title: "Success",
          description: "Signed in successfully",
        });
      }
      setCheckoutMode("auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Order submission handlers
  const handleAuthOrderSubmit = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      await createOrder({
        userId: user.id,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: total,
        status: "pending",
      });

      toast({
        title: "Success",
        description: "Order placed successfully! Order confirmation sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestOrderSubmit = async () => {
    try {
      setIsLoading(true);
      if (!guestForm.guestEmail || !guestForm.guestName) {
        toast({
          title: "Error",
          description: "Please fill in name and email",
          variant: "destructive",
        });
        return;
      }

      await createGuestOrder({
        guestName: guestForm.guestName,
        guestEmail: guestForm.guestEmail,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: total,
        status: "pending",
      });

      toast({
        title: "Success",
        description: "Order placed successfully! Order confirmation sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
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
    
    // Calculations
    subtotal,
    discount,
    tax,
    total,
    
    // Handlers
    handleRemoveItem,
    handleApplyPromo,
    handleRemovePromo,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleEmailAuth,
    handleAuthOrderSubmit,
    handleGuestOrderSubmit,
    signOut,
  };
}
