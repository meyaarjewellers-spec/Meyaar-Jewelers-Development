import FeaturedCategories from '../FeaturedCategories';
import necklaceImg from '@assets/generated_images/Statement_necklace_product_9a7d889c.png';
import braceletImg from '@assets/generated_images/Chain_bracelet_product_cd59a224.png';
import earringImg from '@assets/generated_images/Geometric_hoop_earrings_f96346b0.png';

export default function FeaturedCategoriesExample() {
  const categories = [
    {
      name: "Necklaces",
      image: necklaceImg,
      link: "/shop/necklaces",
    },
    {
      name: "Bracelets",
      image: braceletImg,
      link: "/shop/bracelets",
    },
    {
      name: "Earrings",
      image: earringImg,
      link: "/shop/earrings",
    },
  ];

  return <FeaturedCategories categories={categories} />;
}
