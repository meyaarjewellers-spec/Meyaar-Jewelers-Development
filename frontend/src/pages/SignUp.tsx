import { useLocation } from 'wouter';
import { useAuthForm } from '@/components/auth/useAuthForm';
import { AuthCard } from '@/components/auth/AuthCard';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUp() {
  const [, navigate] = useLocation();
  
  const {
    displayName,
    setDisplayName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    localError,
    handleSignUp,
    user,
  } = useAuthForm('signup');

  // Redirect if already signed in
  if (user) {
    navigate('/account');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignUp();
  };

  return (
    <AuthCard title="Create Account">
      <SignUpForm
        displayName={displayName}
        onDisplayNameChange={setDisplayName}
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        confirmPassword={confirmPassword}
        onConfirmPasswordChange={setConfirmPassword}
        loading={loading}
        error={error}
        localError={localError}
        onSubmit={handleSubmit}
      />
    </AuthCard>
  );
}
