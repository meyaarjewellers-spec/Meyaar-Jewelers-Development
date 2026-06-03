import { Link } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export default function NotFound() {
  const { itemCount } = useCart();
  return (
    <div className="flex min-h-screen flex-col">
      <Header cartItemCount={itemCount} />
      <main className="flex flex-1 items-center justify-center px-4 py-24 text-center">
        <div className="max-w-md">
          <p className="font-serif text-7xl text-primary md:text-8xl">404</p>
          <h1 className="mt-4 font-serif text-2xl md:text-3xl">This page has slipped away</h1>
          <p className="mt-3 text-muted-foreground">
            The piece you're looking for may have moved or sold out. Let's find you something beautiful.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/">
              <Button className="rounded-full px-8">Back to Home</Button>
            </Link>
            <Link href="/shop/necklaces">
              <Button variant="outline" className="rounded-full px-8">Shop the Collection</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
