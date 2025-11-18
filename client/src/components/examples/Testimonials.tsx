import Testimonials from '../Testimonials';

export default function TestimonialsExample() {
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

  return <Testimonials testimonials={testimonials} />;
}
