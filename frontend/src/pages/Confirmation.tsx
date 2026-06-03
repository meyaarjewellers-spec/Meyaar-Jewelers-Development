import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { Check, Mail, Package, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";

export default function Confirmation() {
  const [location, setLocation] = useLocation();
  const { itemCount } = useCart();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    setOrderId(params.get("orderId") || "");
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header cartItemCount={itemCount} />

      <main className="container mx-auto flex-1 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          {/* Success */}
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10">
              <Check className="h-8 w-8 text-primary" strokeWidth={2.5} />
            </div>
            <h1 className="mt-6 font-serif text-4xl">Thank you for your order</h1>
            <p className="mt-3 text-muted-foreground">
              Your payment was received and your order is being prepared with care.
            </p>
            {orderId && (
              <p className="mt-6 inline-block rounded-full border border-border bg-card px-5 py-2 text-sm">
                Order <span className="font-semibold tracking-wide text-foreground">{orderId}</span>
              </p>
            )}
          </div>

          {/* What's next */}
          <div className="mt-12 space-y-5">
            {[
              { icon: Mail, title: "Check your email", body: "A confirmation with your order details is on its way." },
              { icon: Package, title: "Shipping", body: "Your order ships within 1–2 business days with tracking." },
              { icon: MessageCircle, title: "Need help?", body: "Reach us anytime at support@meyaarjewellers.com." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1 rounded-full py-6" onClick={() => setLocation("/")}>
              Continue Shopping
            </Button>
            <Link href="/shop/necklaces" className="flex-1">
              <Button variant="outline" className="w-full rounded-full py-6">
                Browse the Collection
              </Button>
            </Link>
          </div>

          {/* Trust */}
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Secured & encrypted by Stripe
          </div>
        </div>
      </main>
    </div>
  );
}
