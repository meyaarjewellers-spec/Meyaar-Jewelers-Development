import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/product/Rating";

interface Product {
  name: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  isLimited?: boolean;
}

interface ProductHeaderProps {
  product: Product;
}

export function ProductHeader({ product }: ProductHeaderProps) {
  return (
    <div>
      {product.isLimited && (
        <Badge 
          className="mb-2 bg-primary text-primary-foreground"
          data-testid="badge-limited-edition"
        >
          Limited Edition
        </Badge>
      )}
      <h1 
        className="font-serif text-4xl font-bold mb-2"
        data-testid="text-product-name"
      >
        {product.name}
      </h1>
      <div className="flex items-center gap-3 mb-3">
        <p 
          className="text-3xl font-serif text-foreground"
          data-testid="text-product-price"
        >
          ${product.price}
        </p>
        {product.rating && (
          <Rating rating={product.rating} reviewCount={product.reviewCount} />
        )}
      </div>
    </div>
  );
}
