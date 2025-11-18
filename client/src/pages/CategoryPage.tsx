import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import type { Product } from "@/components/ProductCard";

import necklace1 from "@assets/Place_the_jewelry_on_a_linen_or-0 (11)_1763434693374.jpg";
import necklace2 from "@assets/Place_the_jewelry_on_a_linen_or-0 (15)_1763434693375.jpg";
import earring1 from "@assets/Generate_a_professional_high-en-0 (3)_1763434693372.jpg";
import earring2 from "@assets/Place_the_jewelry_on_a_linen_or-0 (5)_1763434693373.jpg";
import earring3 from "@assets/Place_the_jewelry_on_a_linen_or-0 (6)_1763434693373.jpg";
import earring4 from "@assets/Place_the_jewelry_on_a_linen_or-0 (7)_1763434693373.jpg";
import earring5 from "@assets/Place_the_jewelry_on_a_linen_or-0 (1)_1763434693373.jpg";
import earring6 from "@assets/Place_the_jewelry_on_a_linen_or-0 (14)_1763434693374.jpg";
import earring7 from "@assets/Place_the_jewelry_on_a_linen_or-0 (4)_1763434693373.jpg";
import earring8 from "@assets/Place_the_jewelry_on_a_linen_or-0 (16)_1763434693375.jpg";
import earring9 from "@assets/Place_the_jewelry_on_a_linen_or-0 (17)_1763434693375.jpg";
import bracelet1 from "@assets/Generate_a_professional_high-en-0 (2)_1763434693372.jpg";
import bracelet2 from "@assets/Place_the_jewelry_on_a_linen_or-0 (2)_1763434693373.jpg";
import bracelet3 from "@assets/Place_the_jewelry_on_a_linen_or-0 (8)_1763434693374.jpg";
import bracelet4 from "@assets/Place_the_jewelry_on_a_linen_or-0 (9)_1763434693374.jpg";

interface CategoryPageProps {
  category: "necklaces" | "bracelets" | "earrings";
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const categoryTitles = {
    necklaces: "Necklaces",
    bracelets: "Bracelets",
    earrings: "Earrings",
  };

  const categoryDescriptions = {
    necklaces: "Statement pieces that elevate any look. Each necklace is handcrafted with meticulous attention to detail.",
    bracelets: "Elegant wrist adornments that complement your style. Handmade with care and precision.",
    earrings: "From subtle to statement, our earrings add the perfect finishing touch. Limited edition designs.",
  };

  const mockProducts: Record<string, Product[]> = {
    necklaces: [
      {
        id: "n1",
        name: "Emerald Pearl Layered Necklace",
        price: 189,
        image: necklace1,
        category: "necklaces",
        isLimited: true,
      },
      {
        id: "n2",
        name: "Green Beaded Multi-Strand Necklace",
        price: 165,
        image: necklace2,
        category: "necklaces",
        isLimited: true,
      },
    ],
    bracelets: [
      {
        id: "b1",
        name: "Double Pearl Bracelet",
        price: 95,
        image: bracelet1,
        category: "bracelets",
        isLimited: true,
      },
      {
        id: "b2",
        name: "Pearl Branch Bracelet",
        price: 115,
        image: bracelet2,
        category: "bracelets",
      },
      {
        id: "b3",
        name: "Pink & Pearl Statement Bracelet",
        price: 135,
        image: bracelet3,
        category: "bracelets",
        isLimited: true,
      },
      {
        id: "b4",
        name: "Fuchsia Pearl Cluster Bracelet",
        price: 125,
        image: bracelet4,
        category: "bracelets",
      },
    ],
    earrings: [
      {
        id: "e1",
        name: "Crystal Beaded Hoop Earrings",
        price: 89,
        image: earring1,
        category: "earrings",
        isLimited: true,
      },
      {
        id: "e2",
        name: "Turquoise Fan Earrings",
        price: 145,
        image: earring3,
        category: "earrings",
        isLimited: true,
      },
      {
        id: "e3",
        name: "Aqua Pearl Fan Earrings",
        price: 135,
        image: earring4,
        category: "earrings",
      },
      {
        id: "e4",
        name: "Vintage Bronze Flower Earrings",
        price: 78,
        image: earring5,
        category: "earrings",
      },
      {
        id: "e5",
        name: "Pearl Cluster Chain Earrings",
        price: 85,
        image: earring2,
        category: "earrings",
      },
      {
        id: "e6",
        name: "Gold Geometric Pearl Earrings",
        price: 125,
        image: earring6,
        category: "earrings",
        isLimited: true,
      },
      {
        id: "e7",
        name: "Pearl Chain Drop Earrings",
        price: 95,
        image: earring7,
        category: "earrings",
      },
      {
        id: "e8",
        name: "Pink Beaded Chain Earrings",
        price: 75,
        image: earring8,
        category: "earrings",
      },
      {
        id: "e9",
        name: "Blue Crystal Tassel Earrings",
        price: 85,
        image: earring9,
        category: "earrings",
      },
    ],
  };

  const products = mockProducts[category] || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      
      <main className="flex-1">
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 
              className="font-serif text-4xl md:text-5xl font-bold mb-4"
              data-testid="text-category-title"
            >
              {categoryTitles[category]}
            </h1>
            <p 
              className="text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-category-description"
            >
              {categoryDescriptions[category]}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <CategoryGrid products={products} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
