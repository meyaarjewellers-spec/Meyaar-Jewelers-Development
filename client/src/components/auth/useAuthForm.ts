import { useState } from 'react';
import { useAuth as useFirebaseAuth } from '@/contexts/AuthContext';
import { useSignUp as useSignUpHook } from '@/hooks/useFirebaseAuth';
import { useSignIn as useSignInHook } from '@/hooks/useFirebaseAuth';
import { useLocation } from 'wouter';

export function useAuthForm(type: 'signin' | 'signup') {
  const [, navigate] = useLocation();
  const { user } = useFirebaseAuth();
  
  const signUpHook = useSignUpHook();
  const signInHook = useSignInHook();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const loading = type === 'signup' ? signUpHook.loading : signInHook.loading;
  const error = type === 'signup' ? signUpHook.error : signInHook.error;

  const validateSignUp = (): boolean => {
    setLocalError(null);

    if (!email || !password || !confirmPassword || !displayName) {
      setLocalError('Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const validateSignIn = (): boolean => {
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateSignUp()) return;

    try {
      await signUpHook.signUp(email, password, displayName);
      navigate('/account');
    } catch (err) {
      setLocalError(error || 'Failed to sign up');
    }
  };

  const handleSignIn = async () => {
    if (!validateSignIn()) return;

    try {
      await signInHook.signIn(email, password);
      navigate('/account');
    } catch (err) {
      setLocalError(error || 'Failed to sign in');
    }
  };

  return {
    // State
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    displayName,
    setDisplayName,
    loading,
    error,
    localError,
    
    // Handlers
    handleSignUp,
    handleSignIn,
    user,
  };
}
