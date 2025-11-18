import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

import workshopImage from "@assets/generated_images/Workshop_craftsmanship_scene_150bbc44.png";
import heroImage from "@assets/generated_images/Hero_banner_jewelry_display_9438a15d.png";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      
      <main className="flex-1">
        <div 
          className="relative h-[60vh] flex items-center justify-center overflow-hidden"
          style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
          <div className="relative z-10 text-center px-4">
            <h1 
              className="font-serif text-5xl md:text-6xl font-bold text-white mb-4"
              data-testid="text-about-title"
            >
              Our Story
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Handcrafted artisan luxury, made with timeless craftsmanship
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <Card className="overflow-hidden aspect-square">
                <img
                  src={workshopImage}
                  alt="Artisan workshop"
                  className="w-full h-full object-cover"
                  data-testid="img-workshop"
                />
              </Card>
              
              <div className="space-y-4">
                <h2 
                  className="font-serif text-3xl font-bold"
                  data-testid="text-section1-title"
                >
                  Established in 2025
                </h2>
                <p className="text-muted-foreground" data-testid="text-section1-p1">
                  Meyaar Jewellers was born from a passion for creating beautiful, handcrafted jewelry 
                  that tells a story. Our founder, inspired by traditional metalworking techniques and 
                  modern design sensibilities, set out to create pieces that are both timeless and contemporary.
                </p>
                <p className="text-muted-foreground" data-testid="text-section1-p2">
                  Each piece in our collection is meticulously handcrafted by skilled artisans who bring 
                  decades of experience and an unwavering commitment to quality.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 
                className="font-serif text-3xl font-bold"
                data-testid="text-section2-title"
              >
                Our Craftsmanship
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="font-serif text-xl font-bold mb-2" data-testid="text-craft1-title">
                    Handmade
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid="text-craft1-desc">
                    Every piece is crafted by hand, ensuring unique character and exceptional quality.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-serif text-xl font-bold mb-2" data-testid="text-craft2-title">
                    Limited Edition
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid="text-craft2-desc">
                    Small batch production means each design is truly exclusive and rare.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-serif text-xl font-bold mb-2" data-testid="text-craft3-title">
                    Timeless Design
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid="text-craft3-desc">
                    Classic aesthetics meet contemporary style for pieces you'll treasure forever.
                  </p>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <h2 
                className="font-serif text-3xl font-bold"
                data-testid="text-section3-title"
              >
                Our Materials
              </h2>
              <p className="text-muted-foreground" data-testid="text-section3-p1">
                We work primarily with bronze and copper, metals that have been used in jewelry-making 
                for thousands of years. These warm-toned metals develop a beautiful patina over time, 
                making each piece even more unique as it ages with you.
              </p>
              <p className="text-muted-foreground" data-testid="text-section3-p2">
                Our commitment to quality means we source only the finest materials and use traditional 
                techniques passed down through generations of artisans.
              </p>
            </div>

            <div className="bg-muted/30 p-8 rounded-md text-center">
              <p 
                className="font-serif text-2xl italic text-foreground"
                data-testid="text-quote"
              >
                "We believe jewelry should be more than an accessory. It should be a work of art, 
                a conversation starter, and a treasured heirloom."
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
