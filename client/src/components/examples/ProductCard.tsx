import ProductCard from '../ProductCard';
import necklaceImage from '@assets/generated_images/Statement_necklace_product_9a7d889c.png';

export default function ProductCardExample() {
  const product = {
    id: "1",
    name: "Artisan Circle Necklace",
    price: 189,
    image: necklaceImage,
    category: "necklaces" as const,
    isLimited: true,
  };

  return (
    <div className="p-8 max-w-xs">
      <ProductCard product={product} onQuickView={(p) => console.log("Quick view:", p)} />
    </div>
  );
}
