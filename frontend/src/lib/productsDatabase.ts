import type { Product } from "@/components/ProductCard";
import { IMAGES } from "@/lib/imageConfig";

export interface ProductData extends Product {
  description?: string;
  materials?: string;
  dimensions?: string;
  care?: string;
  // Jewelry-specific fields
  material?: string;
  materialPurity?: string;
  metalWeightGrams?: number;
  gemstoneType?: string;
  gemstoneCarat?: number;
  gemstoneClarity?: string;
  gemstoneColor?: string;
  certification?: string;
  sizeGuideCategory?: string; // 'ring', 'bracelet', 'necklace'
}

export const PRODUCTS_DATABASE: Record<string, ProductData> = {
  // Necklaces
  n1: {
    id: "n1",
    name: "Emerald Pearl Layered Necklace",
    price: 189,
    image: IMAGES.necklace1,
    category: "necklaces",
    isLimited: true,
    rating: 5,
    reviewCount: 140,
    description:
      "An exquisite handcrafted necklace featuring luminous pearls and emerald green crystal beads in a sophisticated multi-strand design. Each bead is carefully selected and hand-strung to create this timeless piece.",
    materials: "Freshwater pearls, emerald crystal beads, gold-plated chain and clasp",
    dimensions: "Length: 16-18 inches adjustable",
    care: "Wipe gently with soft cloth after wearing. Avoid contact with perfumes, lotions, and water. Store in provided jewelry pouch.",
  },
  n2: {
    id: "n2",
    name: "Green Beaded Multi-Strand Necklace",
    price: 165,
    image: IMAGES.necklace2,
    category: "necklaces",
    isLimited: true,
    rating: 5,
    reviewCount: 81,
  },

  // Bracelets
  b1: {
    id: "b1",
    name: "Double Pearl Bracelet",
    price: 95,
    image: IMAGES.bracelet1,
    category: "bracelets",
    isLimited: true,
    rating: 5,
    reviewCount: 81,
  },
  b2: {
    id: "b2",
    name: "Pearl Branch Bracelet",
    price: 115,
    image: IMAGES.bracelet2,
    category: "bracelets",
    rating: 5,
    reviewCount: 65,
  },
  b3: {
    id: "b3",
    name: "Pink & Pearl Statement Bracelet",
    price: 135,
    image: IMAGES.bracelet3,
    category: "bracelets",
    isLimited: true,
    rating: 5,
    reviewCount: 92,
  },
  b4: {
    id: "b4",
    name: "Fuchsia Pearl Cluster Bracelet",
    price: 125,
    image: IMAGES.bracelet4,
    category: "bracelets",
    rating: 5,
    reviewCount: 58,
  },

  // Earrings
  e1: {
    id: "e1",
    name: "Crystal Beaded Hoop Earrings",
    price: 89,
    image: IMAGES.earring1,
    category: "earrings",
    isLimited: true,
    rating: 5,
    reviewCount: 73,
  },
  e2: {
    id: "e2",
    name: "Turquoise Fan Earrings",
    price: 145,
    image: IMAGES.earring3,
    category: "earrings",
    isLimited: true,
    rating: 5,
    reviewCount: 54,
  },
  e3: {
    id: "e3",
    name: "Aqua Pearl Fan Earrings",
    price: 135,
    image: IMAGES.earring4,
    category: "earrings",
    rating: 5,
    reviewCount: 68,
  },
  e4: {
    id: "e4",
    name: "Vintage Bronze Flower Earrings",
    price: 78,
    image: IMAGES.earring5,
    category: "earrings",
    rating: 5,
    reviewCount: 47,
  },
  e5: {
    id: "e5",
    name: "Pearl Cluster Chain Earrings",
    price: 85,
    image: IMAGES.earring2,
    category: "earrings",
    rating: 5,
    reviewCount: 61,
  },
  e6: {
    id: "e6",
    name: "Gold Geometric Pearl Earrings",
    price: 125,
    image: IMAGES.earring6,
    category: "earrings",
    isLimited: true,
    rating: 5,
    reviewCount: 85,
  },
  e7: {
    id: "e7",
    name: "Pearl Chain Drop Earrings",
    price: 95,
    image: IMAGES.earring7,
    category: "earrings",
    rating: 5,
    reviewCount: 52,
  },
  e8: {
    id: "e8",
    name: "Pink Beaded Chain Earrings",
    price: 75,
    image: IMAGES.earring8,
    category: "earrings",
    rating: 5,
    reviewCount: 43,
  },
  e9: {
    id: "e9",
    name: "Blue Crystal Tassel Earrings",
    price: 85,
    image: IMAGES.earring9,
    category: "earrings",
    rating: 5,
    reviewCount: 69,
  },
};

/**
 * Get all products in a category
 */
export function getProductsByCategory(category: string): ProductData[] {
  return Object.values(PRODUCTS_DATABASE).filter(
    (product) => product.category === category
  );
}

/**
 * Get a single product by ID
 */
export function getProductById(id: string): ProductData | undefined {
  return PRODUCTS_DATABASE[id];
}

/**
 * Get featured/limited edition products
 */
export function getFeaturedProducts(limit: number = 6): ProductData[] {
  return Object.values(PRODUCTS_DATABASE)
    .filter((product) => product.isLimited)
    .slice(0, limit);
}
