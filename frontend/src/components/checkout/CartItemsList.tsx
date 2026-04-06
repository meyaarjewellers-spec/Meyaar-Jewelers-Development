import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartItemsListProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
}

export function CartItemsList({
  items,
  onRemoveItem,
  onUpdateQuantity,
}: CartItemsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary ({items.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              {/* Product Image */}
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0 rounded-full flex items-center justify-center"
                    onClick={() => onUpdateQuantity?.(item.id, Math.max(1, item.quantity - 1))}
                  >
                    −
                  </Button>
                  <span className="text-sm font-medium w-16 text-center">Qty: {item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0 rounded-full flex items-center justify-center"
                    onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
