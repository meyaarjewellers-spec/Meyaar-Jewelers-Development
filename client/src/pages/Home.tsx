import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import BrandStory from "@/components/BrandStory";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/InstagramFeed";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

import heroImage from "@assets/generated_images/Hero_banner_jewelry_display_9438a15d.png";
import necklaceImg from "@assets/generated_images/Statement_necklace_product_9a7d889c.png";
import braceletImg from "@assets/generated_images/Chain_bracelet_product_cd59a224.png";
import earringImg from "@assets/generated_images/Geometric_hoop_earrings_f96346b0.png";
import workshopImage from "@assets/generated_images/Workshop_craftsmanship_scene_150bbc44.png";
import img1 from "@assets/generated_images/Instagram_lifestyle_shot_1_ec436832.png";
import img2 from "@assets/generated_images/Instagram_lifestyle_shot_2_07788095.png";
import img3 from "@assets/generated_images/Layered_necklace_product_6a0328df.png";
import img4 from "@assets/generated_images/Drop_earrings_product_ad5ef7d3.png";
import img5 from "@assets/generated_images/Cuff_bracelet_product_13c33cb4.png";
import img6 from "@assets/generated_images/Statement_necklace_product_9a7d889c.png";

export default function Home() {
  const categories = [
    { name: "Necklaces", image: necklaceImg, link: "/shop/necklaces" },
    { name: "Bracelets", image: braceletImg, link: "/shop/bracelets" },
    { name: "Earrings", image: earringImg, link: "/shop/earrings" },
  ];

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

  const instagramImages = [img1, img2, img3, img4, img5, img6];

  return (
    <div className="min-h-screen">
      <Header cartItemCount={0} />
      <Hero imageSrc={heroImage} />
      <FeaturedCategories categories={categories} />
      <BrandStory image={workshopImage} />
      <Testimonials testimonials={testimonials} />
      <InstagramFeed images={instagramImages} />
      <Newsletter />
      <Footer />
    </div>
  );
}
