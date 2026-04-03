import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, authAvailable } from '@/lib/supabase';

interface User {
  id: string;
  email: string | null;
  user_metadata?: Record<string, any>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  authAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authAvailable || !supabase) {
      setLoading(false);
      return;
    }

    const checkUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email,
            user_metadata: currentUser.user_metadata,
          });
        }
        setLoading(false);
      } catch (error) {
        console.warn('Error checking user:', error);
        setLoading(false);
      }
    };

    checkUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    if (!authAvailable || !supabase) throw new Error('Supabase not available');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, displayName: string) => {
    if (!authAvailable || !supabase) throw new Error('Supabase not available');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    if (error) throw error;
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!authAvailable || !supabase) throw new Error('Supabase not available');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!authAvailable || !supabase) throw new Error('Supabase not available');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  }, []);

  const signInWithApple = useCallback(async () => {
    if (!authAvailable || !supabase) throw new Error('Supabase not available');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signInWithApple,
        authAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
