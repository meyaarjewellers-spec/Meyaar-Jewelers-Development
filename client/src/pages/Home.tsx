import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import BrandStory from "@/components/BrandStory";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/InstagramFeed";
import Benefits from "@/components/Benefits";
import Newsletter from "@/components/Newsletter";
import FirstTimePopup from "@/components/FirstTimePopup";
import { useCart } from "@/contexts/CartContext";
import { getProductsWithImages } from "@/lib/seedDatabase";

import heroImage from "@assets/Generate_a_professional_high-en-0_1763434693372.jpg";
import workshopImage from "@assets/Generate_a_professional_high-en-0 (2)_1763434693372.jpg";

export default function Home() {
  const { itemCount } = useCart();
  const [categories, setCategories] = useState<any[]>([]);
  const [instagramImages, setInstagramImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProductsWithImages();
        
        // Group products by category and get first image of each category
        const categoryMap: Record<string, any> = {};
        const images: string[] = [];

        products.forEach((product: any) => {
          const categoryName = product.category?.name || 'Unknown';
          
          // Get primary image or first image
          const primaryImage = product.product_images?.find((img: any) => img.is_primary);
          const productImage = primaryImage || product.product_images?.[0];
          
          if (productImage?.image_url) {
            images.push(productImage.image_url);
            
            // Store one product per category for featured categories
            if (!categoryMap[categoryName]) {
              categoryMap[categoryName] = {
                name: categoryName,
                image: productImage.image_url,
                link: `/shop/${categoryName.toLowerCase()}`,
              };
            }
          }
        });

        setCategories(Object.values(categoryMap));
        setInstagramImages(images.slice(0, 6)); // Use first 6 product images
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };

    loadProducts();
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
