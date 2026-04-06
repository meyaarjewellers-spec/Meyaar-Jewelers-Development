import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface HeroProps {
  imageSrc: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function Hero({
  imageSrc,
  title = "Handcrafted Artisan Luxury",
  subtitle = "Limited edition jewelry, made with timeless craftsmanship",
  ctaText = "Shop the Collection",
  ctaLink = "/shop/necklaces"
}: HeroProps) {
  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <h1 
          className="font-serif text-5xl md:text-7xl font-bold text-white mb-4 tracking-wide"
          data-testid="text-hero-title"
        >
          {title}
        </h1>
        <p 
          className="text-lg md:text-xl text-white/90 mb-8 font-light"
          data-testid="text-hero-subtitle"
        >
          {subtitle}
        </p>
        <Link href={ctaLink}>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-base px-8"
            data-testid="button-hero-cta"
          >
            {ctaText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
