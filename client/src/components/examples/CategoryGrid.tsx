import CategoryGrid from '../CategoryGrid';
import necklace1 from '@assets/Place_the_jewelry_on_a_linen_or-0 (11)_1763434693374.jpg';
import bracelet1 from '@assets/Generate_a_professional_high-en-0 (2)_1763434693372.jpg';
import earring1 from '@assets/Generate_a_professional_high-en-0 (3)_1763434693372.jpg';
import earring2 from '@assets/Place_the_jewelry_on_a_linen_or-0 (5)_1763434693373.jpg';

export default function CategoryGridExample() {
  const products = [
    {
      id: "1",
      name: "Emerald Pearl Necklace",
      price: 189,
      image: necklace1,
      category: "necklaces" as const,
      isLimited: true,
    },
    {
      id: "2",
      name: "Double Pearl Bracelet",
      price: 95,
      image: bracelet1,
      category: "bracelets" as const,
    },
    {
      id: "3",
      name: "Crystal Hoop Earrings",
      price: 89,
      image: earring1,
      category: "earrings" as const,
      isLimited: true,
    },
    {
      id: "4",
      name: "Turquoise Fan Earrings",
      price: 145,
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
