import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function ContinueShoppingButton() {
  const [, setLocation] = useLocation();

  return (
    <div className="mt-8 max-w-2xl">
      <Button
        variant="outline"
        className="w-full py-6 flex justify-between"
        onClick={() => setLocation("/")}
      >
        <span>←</span>
        <span className="flex-1 text-center">Continue Shopping</span>
        <span className="w-4" />
      </Button>
    </div>
  );
}
