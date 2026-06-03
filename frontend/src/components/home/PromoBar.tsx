import { useEffect, useState } from "react";

const messages = [
  "Free shipping on orders over $100",
  "Handcrafted in small batches · Limited editions",
  "Complimentary 30-day returns",
];

export default function PromoBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full bg-primary px-4 py-2 text-center text-primary-foreground">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] transition-opacity duration-500">
        {messages[i]}
      </p>
    </div>
  );
}
