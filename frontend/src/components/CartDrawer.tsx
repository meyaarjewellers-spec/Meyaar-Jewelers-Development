import { useLocation } from "wouter";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const FREE_SHIPPING_THRESHOLD = 100;

export default function CartDrawer() {
  const [, navigate] = useLocation();
  const { items, itemCount, total, updateQuantity, removeItem } = useCart();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="relative p-2 text-foreground/80 transition-colors hover:text-primary"
          aria-label="Open cart"
          data-testid="button-cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="font-serif text-2xl">Your Bag ({itemCount})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" strokeWidth={1.25} />
            <p className="text-muted-foreground">Your bag is empty.</p>
            <Button className="rounded-full px-8" onClick={() => navigate("/shop/necklaces")}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-border px-6 py-4">
              {remaining > 0 ? (
                <p className="text-xs text-muted-foreground">
                  You're <span className="font-semibold text-foreground">${remaining.toFixed(2)}</span> away from free shipping
                </p>
              ) : (
                <p className="text-xs font-medium text-primary">🎉 You've unlocked free shipping!</p>
              )}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-serif text-sm leading-snug">{item.name}</p>
                        <button onClick={() => removeItem(item.id)} aria-label="Remove" className="text-muted-foreground hover:text-destructive">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      <div className="mt-auto flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid h-7 w-7 place-items-center rounded-full border border-border hover:border-primary" aria-label="Decrease">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid h-7 w-7 place-items-center rounded-full border border-border hover:border-primary" aria-label="Increase">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-serif text-xl">${total.toFixed(2)}</span>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</p>
              <Button className="w-full rounded-full py-6" onClick={() => navigate("/checkout-method")}>
                Checkout
              </Button>
              <Button variant="ghost" className="mt-2 w-full" onClick={() => navigate("/checkout")}>
                View full bag
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
