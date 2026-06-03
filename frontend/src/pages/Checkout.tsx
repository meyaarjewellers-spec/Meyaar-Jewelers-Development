import { useLocation, Link } from "wouter";
import { ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { CartItemsList } from "@/components/checkout";
import { Button } from "@/components/ui/button";
import { trackBeginCheckout } from "@/lib/analytics";

const FREE_SHIPPING_THRESHOLD = 100;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, removeItem, updateQuantity, itemCount, total } = useCart();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="flex min-h-screen flex-col">
      <Header cartItemCount={itemCount} />

      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-10">
          <h1 className="font-serif text-4xl">Your Bag</h1>
          <p className="mt-2 text-muted-foreground">Review your pieces before checkout.</p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border bg-card py-24 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" strokeWidth={1.25} />
            <p className="text-lg text-muted-foreground">Your bag is empty.</p>
            <Link href="/shop/necklaces">
              <Button className="rounded-full px-10">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CartItemsList items={items} onRemoveItem={removeItem} onUpdateQuantity={updateQuantity} />
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-28 rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-xl">Order Summary</h2>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Shipping &amp; taxes calculated at checkout.</p>
                </div>

                {/* Free shipping progress */}
                <div className="mt-5 rounded-xl bg-muted/50 p-4">
                  {remaining > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Add <span className="font-semibold text-foreground">${remaining.toFixed(2)}</span> for free shipping
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-primary">🎉 You've unlocked free shipping!</p>
                  )}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <Button
                  className="mt-6 w-full rounded-full py-6"
                  onClick={() => {
                    trackBeginCheckout(total, items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })));
                    setLocation("/checkout-method");
                  }}
                >
                  Proceed to Checkout
                </Button>
                <Button variant="ghost" className="mt-2 w-full" onClick={() => setLocation("/")}>
                  Continue Shopping
                </Button>

                <div className="mt-6 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Secure checkout by Stripe</p>
                  <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Free shipping over ${FREE_SHIPPING_THRESHOLD}</p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
