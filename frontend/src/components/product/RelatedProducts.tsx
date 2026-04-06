import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/shared";

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviewCount?: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="mt-20">
      <h2 
        className="font-serif text-3xl font-bold mb-8"
        data-testid="text-related-title"
      >
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <Card 
              className="overflow-hidden hover-elevate cursor-pointer"
              data-testid={`card-related-${product.id}`}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-serif">${product.price}</p>
                  {product.rating && (
                    <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
