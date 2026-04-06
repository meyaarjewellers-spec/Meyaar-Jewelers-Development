import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  isLoading?: boolean;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  onAddToCart,
  isLoading = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border rounded-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          data-testid="button-decrease-quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span 
          className="px-4 font-medium"
          data-testid="text-quantity"
        >
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onQuantityChange(quantity + 1)}
          data-testid="button-increase-quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button 
        className="flex-1" 
        size="lg"
        onClick={onAddToCart}
        disabled={isLoading}
        style={{ backgroundColor: "rgb(180 83 9 / 1)", color: "white" }}
        data-testid="button-add-to-cart"
      >
        Add to Cart
      </Button>
    </div>
  );
}
