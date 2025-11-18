import ProductCard, { type Product } from "./ProductCard";

interface CategoryGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export default function CategoryGrid({ products, onQuickView }: CategoryGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}
