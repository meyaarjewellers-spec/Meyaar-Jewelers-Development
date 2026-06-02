import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

interface UseGoogleCheckoutAuthReturn {
  handleGoogleAuth: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useGoogleCheckoutAuth(): UseGoogleCheckoutAuthReturn {
  const { signInWithGoogle } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Supabase redirects to home after successful auth
      // The user will be logged in and can complete checkout
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(errorMessage);
      console.error('Google auth error:', err);
      setIsLoading(false);
    }
  }, [signInWithGoogle, setLocation]);

  return {
    handleGoogleAuth,
    isLoading,
    error,
  };
}
