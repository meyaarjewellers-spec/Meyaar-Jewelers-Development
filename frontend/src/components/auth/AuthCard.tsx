import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Card } from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
