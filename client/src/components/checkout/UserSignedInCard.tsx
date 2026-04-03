import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut } from "lucide-react";

interface User {
  id: string;
  email: string | null;
}

interface UserSignedInCardProps {
  user: User;
  onSignOut: () => void;
}

export function UserSignedInCard({
  user,
  onSignOut,
}: UserSignedInCardProps) {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-blue-900">✅ Signed in as</p>
            <p className="text-sm text-blue-700">{user.email || "User"}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
