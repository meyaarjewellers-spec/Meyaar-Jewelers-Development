import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import type { Product } from "@/components/ProductCard";

import necklace1 from "@assets/generated_images/Statement_necklace_product_9a7d889c.png";
import necklace2 from "@assets/generated_images/Layered_necklace_product_6a0328df.png";
import earring1 from "@assets/generated_images/Geometric_hoop_earrings_f96346b0.png";
import earring2 from "@assets/generated_images/Drop_earrings_product_ad5ef7d3.png";
import bracelet1 from "@assets/generated_images/Chain_bracelet_product_cd59a224.png";
import bracelet2 from "@assets/generated_images/Cuff_bracelet_product_13c33cb4.png";

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
        name: "Artisan Circle Necklace",
        price: 189,
        image: necklace1,
        category: "necklaces",
        isLimited: true,
      },
      {
        id: "n2",
        name: "Layered Bronze Necklace",
        price: 145,
        image: necklace2,
        category: "necklaces",
      },
      {
        id: "n3",
        name: "Mandala Statement Necklace",
        price: 225,
        image: necklace1,
        category: "necklaces",
        isLimited: true,
      },
      {
        id: "n4",
        name: "Delicate Chain Necklace",
        price: 98,
        image: necklace2,
        category: "necklaces",
      },
    ],
    bracelets: [
      {
        id: "b1",
        name: "Chain Link Bracelet",
        price: 125,
        image: bracelet1,
        category: "bracelets",
        isLimited: true,
      },
      {
        id: "b2",
        name: "Engraved Cuff Bracelet",
        price: 165,
        image: bracelet2,
        category: "bracelets",
      },
      {
        id: "b3",
        name: "Artisan Chain Bracelet",
        price: 135,
        image: bracelet1,
        category: "bracelets",
      },
      {
        id: "b4",
        name: "Bronze Cuff",
        price: 145,
        image: bracelet2,
        category: "bracelets",
        isLimited: true,
      },
    ],
    earrings: [
      {
        id: "e1",
        name: "Geometric Hoop Earrings",
        price: 89,
        image: earring1,
        category: "earrings",
        isLimited: true,
      },
      {
        id: "e2",
        name: "Medallion Drop Earrings",
        price: 125,
        image: earring2,
        category: "earrings",
      },
      {
        id: "e3",
        name: "Bronze Hoops",
        price: 75,
        image: earring1,
        category: "earrings",
      },
      {
        id: "e4",
        name: "Artisan Drops",
        price: 115,
        image: earring2,
        category: "earrings",
        isLimited: true,
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
