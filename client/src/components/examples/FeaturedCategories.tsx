import FeaturedCategories from '../FeaturedCategories';
import necklaceImg from '@assets/Place_the_jewelry_on_a_linen_or-0 (11)_1763434693374.jpg';
import braceletImg from '@assets/Generate_a_professional_high-en-0 (2)_1763434693372.jpg';
import earringImg from '@assets/Generate_a_professional_high-en-0 (3)_1763434693372.jpg';

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
