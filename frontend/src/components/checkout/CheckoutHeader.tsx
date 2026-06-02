import { useLocation } from "wouter";

interface CheckoutHeaderProps {
  onBackClick?: () => void;
}

export function CheckoutHeader({ onBackClick }: CheckoutHeaderProps) {
  const [, setLocation] = useLocation();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      setLocation("/checkout");
    }
  };

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <button
          onClick={handleBackClick}
          className="text-2xl hover:opacity-70"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold">Checkout</h1>
        <div className="w-8" />
      </div>
    </div>
  );
}
