import { Card } from "@/components/ui/card";

interface BrandStoryProps {
  image: string;
}

export default function BrandStory({ image }: BrandStoryProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <h2 
              className="font-serif text-3xl md:text-4xl font-bold mb-6"
              data-testid="text-story-title"
            >
              Crafted with Passion, Worn with Pride
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p data-testid="text-story-p1">
                At Meyaar Jewellers, every piece tells a story of dedication, artistry, and timeless beauty. 
                Established in 2025, we bring you handcrafted jewelry made in the USA, inspired by the rich heritage 
                of Pakistani metalwork, celebrating the art of traditional jewelry-making and limited-edition design.
              </p>
              <p data-testid="text-story-p2">
                Our artisans pour their hearts into each creation, ensuring that every necklace, bracelet, 
                and pair of earrings is a unique work of art. We believe in quality over quantity, 
                creating pieces that will be treasured for generations.
              </p>
              <p data-testid="text-story-p3">
                Each piece is handcrafted in small batches, making them truly exclusive. When you choose 
                Meyaar, you're not just buying jewelry – you're investing in artisan craftsmanship and 
                timeless elegance.
              </p>
            </div>
          </div>
          
          <Card className="overflow-hidden">
            <img
              src={image}
              alt="Artisan craftsmanship"
              className="w-full h-full object-cover"
              data-testid="img-story"
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
