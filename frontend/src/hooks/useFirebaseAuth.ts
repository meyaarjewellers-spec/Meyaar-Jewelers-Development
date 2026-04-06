import { useState } from 'react';
import { supabase, authAvailable } from '@/lib/supabase';

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (!authAvailable || !supabase) throw new Error('Supabase not available');
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });

      if (signUpError) throw signUpError;
      return data.user;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign up';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
}

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!authAvailable || !supabase) throw new Error('Supabase not available');
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      return data.user;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error };
}

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!authAvailable || !supabase) throw new Error('Supabase not available');
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send reset email';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error };
}
