import CategoryGrid from '../CategoryGrid';
import necklace1 from '@assets/generated_images/Statement_necklace_product_9a7d889c.png';
import necklace2 from '@assets/generated_images/Layered_necklace_product_6a0328df.png';
import earring1 from '@assets/generated_images/Geometric_hoop_earrings_f96346b0.png';
import earring2 from '@assets/generated_images/Drop_earrings_product_ad5ef7d3.png';

export default function CategoryGridExample() {
  const products = [
    {
      id: "1",
      name: "Artisan Circle Necklace",
      price: 189,
      image: necklace1,
      category: "necklaces" as const,
      isLimited: true,
    },
    {
      id: "2",
      name: "Layered Bronze Necklace",
      price: 145,
      image: necklace2,
      category: "necklaces" as const,
    },
    {
      id: "3",
      name: "Geometric Hoop Earrings",
      price: 89,
      image: earring1,
      category: "earrings" as const,
      isLimited: true,
    },
    {
      id: "4",
      name: "Medallion Drop Earrings",
      price: 125,
      image: earring2,
      category: "earrings" as const,
    },
  ];

  return (
    <div className="p-8">
      <CategoryGrid products={products} />
    </div>
  );
}
