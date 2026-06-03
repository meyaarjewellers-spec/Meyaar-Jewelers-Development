import { Truck, ShieldCheck, Hand, RefreshCcw } from "lucide-react";

const items = [
  { icon: Hand, title: "Handcrafted", sub: "Made by artisans" },
  { icon: Truck, title: "Free Shipping", sub: "On orders over $100" },
  { icon: ShieldCheck, title: "Secure Checkout", sub: "Encrypted by Stripe" },
  { icon: RefreshCcw, title: "30-Day Returns", sub: "Easy & complimentary" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container mx-auto grid grid-cols-2 gap-y-6 px-4 py-6 md:grid-cols-4">
        {items.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center justify-center gap-3">
            <Icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
