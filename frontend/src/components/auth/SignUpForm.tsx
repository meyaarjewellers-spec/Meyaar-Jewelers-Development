import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SignUpFormProps {
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  localError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export function SignUpForm({
  displayName,
  onDisplayNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  loading,
  error,
  localError,
  onSubmit,
}: SignUpFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {(localError || error) && (
        <Alert variant="destructive">
          <AlertDescription>{localError || error}</AlertDescription>
        </Alert>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <Input
          type="text"
          value={displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          placeholder="John Doe"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@example.com"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign in
        </a>
      </p>
    </form>
  );
}
