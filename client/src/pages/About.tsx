import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { IMAGES } from "@/lib/imageConfig";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const { itemCount } = useCart();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-amber-50">
      <Header cartItemCount={itemCount} />
      
      <main className="flex-1">
        <div 
          className="relative h-[60vh] flex items-center justify-center overflow-hidden"
          style={{ backgroundImage: `url(${IMAGES.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
          <div className="relative z-10 text-center px-4">
            <h1 
              className="font-serif text-5xl md:text-6xl font-bold text-white mb-4"
              data-testid="text-about-title"
            >
              The Art of Craftsmanship
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Pakistani heritage, handcrafted in the USA
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <Card className="overflow-hidden aspect-square shadow-lg">
                <img
                  src={IMAGES.workshopImage}
                  alt="Artisan workshop"
                  className="w-full h-full object-cover"
                  data-testid="img-workshop"
                />
              </Card>
              
              <div className="space-y-4">
                <h2 
                  className="font-serif text-4xl font-bold text-amber-900"
                  data-testid="text-section1-title"
                >
                  Heritage & Heritage
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-amber-600 to-yellow-600"></div>
                <p className="text-slate-700 leading-relaxed" data-testid="text-section1-p1">
                  Meyaar Jewellers draws inspiration from the rich tradition of Pakistani metalwork, 
                  where artisans have perfected their craft over centuries. Our founder reconnected with 
                  this heritage, and now every piece is handcrafted in the USA by skilled artisans trained in 
                  traditional Pakistani techniques.
                </p>
                <p className="text-slate-700 leading-relaxed" data-testid="text-section1-p2">
                  Each piece is meticulously handcrafted right here in the United States by artisans trained in 
                  traditional Pakistani jewelry-making techniques passed down through generations. We honor the heritage 
                  while creating contemporary designs for the discerning collector.
                </p>
              </div>
            </div>

            <div className="space-y-6 mt-16">
              <h2 
                className="font-serif text-4xl font-bold text-center text-amber-900"
                data-testid="text-section2-title"
              >
                The Meyaar Promise
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-amber-600 to-yellow-600 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-8 border-amber-200 bg-white hover:shadow-lg transition">
                  <h3 className="font-serif text-2xl font-bold mb-3 text-amber-900" data-testid="text-craft1-title">
                    ⚒️ Handcrafted
                  </h3>
                  <p className="text-sm text-slate-700" data-testid="text-craft1-desc">
                    Every piece is individually crafted by master artisans, ensuring no two pieces are ever identical. Pure artisanal mastery.
                  </p>
                </Card>
                
                <Card className="p-8 border-amber-200 bg-white hover:shadow-lg transition">
                  <h3 className="font-serif text-2xl font-bold mb-3 text-amber-900" data-testid="text-craft2-title">
                    👑 Limited Edition
                  </h3>
                  <p className="text-sm text-slate-700" data-testid="text-craft2-desc">
                    Small batch production maintains exclusivity and rarity. Your piece is truly one-of-a-kind.
                  </p>
                </Card>
                
                <Card className="p-8 border-amber-200 bg-white hover:shadow-lg transition">
                  <h3 className="font-serif text-2xl font-bold mb-3 text-amber-900" data-testid="text-craft3-title">
                    ✨ Legacy Quality
                  </h3>
                  <p className="text-sm text-slate-700" data-testid="text-craft3-desc">
                    Heirloom-quality pieces designed to be passed down through generations and treasured forever.
                  </p>
                </Card>
              </div>
            </div>

            <div className="space-y-6 mt-16">
              <h2 
                className="font-serif text-4xl font-bold text-center text-amber-900"
                data-testid="text-section3-title"
              >
                Premium Materials
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-amber-600 to-yellow-600 mx-auto"></div>
              <p className="text-slate-700 leading-relaxed text-center" data-testid="text-section3-p1">
                We work exclusively with bronze, copper, and precious metals sourced from ethical suppliers. 
                These materials have been used by master craftsmen for millennia, developing a distinctive patina 
                that makes each piece more beautiful with age—true marks of authenticity and time.
              </p>
              <p className="text-slate-700 leading-relaxed text-center" data-testid="text-section3-p2">
                Our commitment to uncompromising quality means we source only the finest materials and employ 
                traditional techniques that celebrate the inherent beauty of each metal. This is luxury without ostentation—
                the quiet confidence of true craftsmanship.
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-12 rounded-lg text-center mt-16">
              <p 
                className="font-serif text-2xl italic text-amber-900 leading-relaxed"
                data-testid="text-quote"
              >
                "In a world of mass production, we believe in the power of intention. Every piece tells the story 
                of the hands that created it—a testament to artistry, heritage, and the timeless pursuit of perfection."
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
