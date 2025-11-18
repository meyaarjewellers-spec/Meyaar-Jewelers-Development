import ProductCard from '../ProductCard';
import necklaceImage from '@assets/Place_the_jewelry_on_a_linen_or-0 (11)_1763434693374.jpg';

export default function ProductCardExample() {
  const product = {
    id: "1",
    name: "Emerald Pearl Layered Necklace",
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
