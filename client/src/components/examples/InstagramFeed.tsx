import InstagramFeed from '../InstagramFeed';
import img1 from '@assets/Place_the_jewelry_on_a_linen_or-0 (3)_1763434693373.jpg';
import img2 from '@assets/Place_the_jewelry_on_a_linen_or-0 (5)_1763434693373.jpg';
import img3 from '@assets/Place_the_jewelry_on_a_linen_or-0 (13)_1763434693374.jpg';
import img4 from '@assets/Place_the_jewelry_on_a_linen_or-0 (12)_1763434693374.jpg';
import img5 from '@assets/Place_the_jewelry_on_a_linen_or-0 (8)_1763434693374.jpg';
import img6 from '@assets/Place_the_jewelry_on_a_linen_or-0 (11)_1763434693374.jpg';

export default function InstagramFeedExample() {
  const images = [img1, img2, img3, img4, img5, img6];
  return <InstagramFeed images={images} />;
}
