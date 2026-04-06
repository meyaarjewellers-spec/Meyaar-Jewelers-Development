import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Hero, FeaturedCategories, BrandStory, Testimonials, InstagramFeed, Benefits, Newsletter, FirstTimePopup } from "@/components/home";
import { useCart } from "@/contexts/CartContext";

import heroImage from "@assets/Generate_a_professional_high-en-0_1763434693372.jpg";
import workshopImage from "@assets/Generate_a_professional_high-en-0 (2)_1763434693372.jpg";

export default function Home() {
  const { itemCount } = useCart();
  const [categories, setCategories] = useState<any[]>([]);
  const [instagramImages, setInstagramImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // For now, just set empty categories and images since we deleted seedDatabase
    // In a real app, you'd fetch this from an API
    setCategories([]);
    setInstagramImages([]);
    setLoading(false);
  }, []);

  const testimonials = [
    {
      id: "1",
      name: "Sarah Mitchell",
      text: "The craftsmanship is absolutely stunning. Each piece tells a story and I receive compliments every time I wear my necklace.",
      rating: 5,
    },
    {
      id: "2",
      name: "Emma Johnson",
      text: "I love that these pieces are handmade and limited edition. The quality is exceptional and the designs are timeless.",
      rating: 5,
    },
    {
      id: "3",
      name: "Olivia Chen",
      text: "Meyaar Jewellers has become my go-to for special occasions. The attention to detail in every piece is remarkable.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      <FirstTimePopup />
      <Header cartItemCount={itemCount} />
      <Hero imageSrc={heroImage} title="Handcrafted" subtitle="Pakistani-inspired artisan luxury with timeless heritage" />
      {categories.length > 0 && <FeaturedCategories categories={categories} />}
      <BrandStory image={workshopImage} />
      <Testimonials testimonials={testimonials} />
      {instagramImages.length > 0 && <InstagramFeed images={instagramImages} />}
      <Benefits />
      <Newsletter />
    </div>
  );
}
