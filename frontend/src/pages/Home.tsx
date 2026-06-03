import { useEffect, useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import { Hero, BrandStory, Testimonials, Benefits, Newsletter, FirstTimePopup } from "@/components/home";
import TrustBar from "@/components/home/TrustBar";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import CategoryGrid from "@/components/home/CategoryGrid";
import { useCart } from "@/contexts/CartContext";
import { getFeaturedProducts, getCategories, toCardProduct } from "@/lib/productCatalog";
import { IMAGES } from "@/lib/imageConfig";
import type { Product } from "@/components/ProductCard";

import heroImage from "@assets/Generate_a_professional_high-en-0_1763434693372.jpg";
import workshopImage from "@assets/Generate_a_professional_high-en-0 (2)_1763434693372.jpg";

const CATEGORY_FALLBACK_IMG: Record<string, string> = {
  necklaces: IMAGES.necklace1,
  bracelets: IMAGES.bracelet1,
  earrings: IMAGES.earring1,
};

const testimonials = [
  { id: "1", name: "Sarah M.", text: "The craftsmanship is absolutely stunning. Each piece tells a story and I receive compliments every time I wear my necklace.", rating: 5 },
  { id: "2", name: "Emma J.", text: "I love that these pieces are handmade and limited edition. The quality is exceptional and the designs are timeless.", rating: 5 },
  { id: "3", name: "Olivia C.", text: "Meyaar has become my go-to for special occasions. The attention to detail in every piece is remarkable.", rating: 5 },
];

export default function Home() {
  const { itemCount } = useCart();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; image: string; link: string }>>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    let mounted = true;
    (async () => {
      const [products, cats] = await Promise.all([getFeaturedProducts(8), getCategories()]);
      if (!mounted) return;
      setFeatured(products.map(toCardProduct));
      setCategories(
        cats.map((c) => ({
          name: c.name,
          link: `/shop/${c.slug}`,
          image: c.image_url || CATEGORY_FALLBACK_IMG[c.slug?.toLowerCase()] || IMAGES.necklace1,
        })),
      );
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <FirstTimePopup />
      <Header cartItemCount={itemCount} />

      <Hero
        imageSrc={heroImage}
        title="Handcrafted, Heirloom-Worthy"
        subtitle="Pakistani-inspired artisan luxury, made in small batches with timeless heritage."
      />

      <TrustBar />

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary">Bestsellers</p>
                <h2 className="mt-2 font-serif text-3xl md:text-4xl">Loved by Many</h2>
              </div>
              <Link
                href="/shop/necklaces"
                className="hidden text-sm font-medium uppercase tracking-[0.12em] text-foreground/70 underline-offset-4 hover:text-primary hover:underline md:inline"
              >
                View all
              </Link>
            </div>
            <CategoryGrid products={featured} />
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && <FeaturedCategories categories={categories} />}

      <BrandStory image={workshopImage} />

      <Benefits />

      <Testimonials testimonials={testimonials} />

      <Newsletter />
    </div>
  );
}
