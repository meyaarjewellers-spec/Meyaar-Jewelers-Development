import { Link } from "wouter";
import { Heart } from "lucide-react";
import Seo from "@/components/Seo";
import Header from "@/components/Header";
import CategoryGrid from "@/components/home/CategoryGrid";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Product } from "@/components/ProductCard";

export default function Wishlist() {
  const { itemCount } = useCart();
  const { items } = useWishlist();

  const products: Product[] = items.map((i) => ({
    id: i.id,
    name: i.name,
    price: i.price,
    image: i.image,
    category: i.category,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Seo title="Wishlist" path="/wishlist" noIndex />
      <Header cartItemCount={itemCount} />

      <main className="container mx-auto flex-1 px-4 py-14">
        <h1 className="font-serif text-4xl">Your Wishlist</h1>
        <p className="mt-2 text-muted-foreground">Saved pieces, ready when you are.</p>

        <div className="mt-10">
          {products.length > 0 ? (
            <CategoryGrid products={products} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border bg-card py-24 text-center">
              <Heart className="h-12 w-12 text-muted-foreground" strokeWidth={1.25} />
              <p className="text-lg text-muted-foreground">Your wishlist is empty.</p>
              <Link href="/shop/necklaces">
                <Button className="rounded-full px-10">Discover Pieces</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
