import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import BrandStory from "@/components/BrandStory";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/InstagramFeed";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

import heroImage from "@assets/generated_images/Hero_banner_jewelry_display_9438a15d.png";
import necklaceImg from "@assets/Place_the_jewelry_on_a_linen_or-0 (11)_1763434693374.jpg";
import braceletImg from "@assets/Generate_a_professional_high-en-0 (2)_1763434693372.jpg";
import earringImg from "@assets/Generate_a_professional_high-en-0 (3)_1763434693372.jpg";
import workshopImage from "@assets/generated_images/Workshop_craftsmanship_scene_150bbc44.png";
import img1 from "@assets/Place_the_jewelry_on_a_linen_or-0 (3)_1763434693373.jpg";
import img2 from "@assets/Place_the_jewelry_on_a_linen_or-0 (5)_1763434693373.jpg";
import img3 from "@assets/Place_the_jewelry_on_a_linen_or-0 (13)_1763434693374.jpg";
import img4 from "@assets/Place_the_jewelry_on_a_linen_or-0 (12)_1763434693374.jpg";
import img5 from "@assets/Place_the_jewelry_on_a_linen_or-0 (8)_1763434693374.jpg";
import img6 from "@assets/Place_the_jewelry_on_a_linen_or-0 (11)_1763434693374.jpg";

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
