import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "necklaces" | "bracelets" | "earrings";
  isLimited?: boolean;
}

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  return (
    <Card 
      className="group overflow-hidden border hover-elevate cursor-pointer"
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-product-${product.id}`}
          />
          {product.isLimited && (
            <Badge 
              className="absolute top-2 right-2 bg-primary text-primary-foreground"
              data-testid={`badge-limited-${product.id}`}
            >
              Limited Edition
            </Badge>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                onQuickView?.(product);
                console.log("Quick view:", product.name);
              }}
              data-testid={`button-quick-view-${product.id}`}
            >
              Quick View
            </Button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 
            className="font-medium text-base mb-1 text-foreground hover:text-primary transition-colors"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
        </Link>
        <p 
          className="text-lg font-serif text-foreground"
          data-testid={`text-product-price-${product.id}`}
        >
          ${product.price}
        </p>
      </div>
    </Card>
  );
}
