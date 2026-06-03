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
  subtitle = "Limited-edition jewelry, made with timeless craftsmanship",
  ctaText = "Shop the Collection",
  ctaLink = "/shop/necklaces",
}: HeroProps) {
  return (
    <section className="relative flex h-[90vh] min-h-[560px] items-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageSrc})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full">
        <div className="container mx-auto px-6">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
              Est. 2025 · Handmade
            </p>
            <h1 className="font-serif text-5xl font-medium leading-[1.05] text-white md:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-white/90">
              {subtitle}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href={ctaLink}>
                <Button
                  size="lg"
                  className="rounded-full bg-white px-9 text-sm font-semibold uppercase tracking-[0.12em] text-foreground hover:bg-white/90"
                  data-testid="button-hero-cta"
                >
                  {ctaText}
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/50 bg-transparent px-9 text-sm font-semibold uppercase tracking-[0.12em] text-white hover:bg-white/10"
                >
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/70">
        <div className="mx-auto h-10 w-[1px] animate-pulse bg-white/50" />
      </div>
    </section>
  );
}
