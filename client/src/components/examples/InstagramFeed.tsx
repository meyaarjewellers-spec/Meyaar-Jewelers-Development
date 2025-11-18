import InstagramFeed from '../InstagramFeed';
import img1 from '@assets/generated_images/Instagram_lifestyle_shot_1_ec436832.png';
import img2 from '@assets/generated_images/Instagram_lifestyle_shot_2_07788095.png';
import img3 from '@assets/generated_images/Statement_necklace_product_9a7d889c.png';
import img4 from '@assets/generated_images/Geometric_hoop_earrings_f96346b0.png';
import img5 from '@assets/generated_images/Layered_necklace_product_6a0328df.png';
import img6 from '@assets/generated_images/Chain_bracelet_product_cd59a224.png';

export default function InstagramFeedExample() {
  const images = [img1, img2, img3, img4, img5, img6];
  return <InstagramFeed images={images} />;
}
