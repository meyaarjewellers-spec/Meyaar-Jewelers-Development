import { Link } from "wouter";
import { Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/shared";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "necklaces" | "bracelets" | "earrings";
  isLimited?: boolean;
  rating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toast({ title: "Added to bag", description: `${product.name} is in your bag.` });
  };

  return (
    <div className="group relative" data-testid={`card-product-${product.id}`}>
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[hsl(35_30%_92%)]">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              data-testid={`img-product-${product.id}`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground font-serif italic">
              Meyaar
            </div>
          )}

          {/* Limited badge */}
          {product.isLimited && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary backdrop-blur">
              Limited
            </span>
          )}

          {/* Wishlist */}
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-foreground/70 opacity-0 backdrop-blur transition-all duration-300 hover:text-primary group-hover:opacity-100"
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Quick add bar (slides up on hover; tappable on mobile) */}
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
            <button
              onClick={handleAddToBag}
              className="w-full rounded-full bg-foreground/90 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white backdrop-blur transition-colors hover:bg-primary"
              data-testid={`button-add-${product.id}`}
            >
              Add to Bag
            </button>
          </div>
        </div>
      </Link>

      <div className="pt-4 text-center">
        <Link href={`/product/${product.id}`}>
          <h3
            className="font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-primary"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
        </Link>

        {product.rating !== undefined && product.reviewCount !== undefined && product.reviewCount > 0 && (
          <div className="mt-1.5 flex justify-center">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
          </div>
        )}

        <p className="mt-2 text-sm tracking-wide text-foreground/80" data-testid={`text-product-price-${product.id}`}>
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
