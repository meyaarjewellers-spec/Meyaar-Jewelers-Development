import { useLocation } from 'wouter';
import { useAuthForm } from '@/components/auth/useAuthForm';
import { AuthCard } from '@/components/auth/AuthCard';
import { SignInForm } from '@/components/auth/SignInForm';

export default function SignIn() {
  const [, navigate] = useLocation();
  
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    localError,
    handleSignIn,
    user,
  } = useAuthForm('signin');

  // Redirect if already signed in
  if (user) {
    navigate('/account');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignIn();
  };

  return (
    <AuthCard title="Sign In">
      <SignInForm
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        loading={loading}
        error={error}
        localError={localError}
        onSubmit={handleSubmit}
      />
    </AuthCard>
  );
}
