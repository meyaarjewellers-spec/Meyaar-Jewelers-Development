import { Card } from "@/components/ui/card";
import { Link } from "wouter";

interface Category {
  name: string;
  image: string;
  link: string;
}

interface FeaturedCategoriesProps {
  categories: Category[];
}

export default function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="font-serif text-3xl md:text-4xl font-bold mb-2"
            data-testid="text-categories-title"
          >
            Shop by Category
          </h2>
          <p className="text-muted-foreground">Discover our handcrafted collections</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map((category) => (
            <Link key={category.name} href={category.link}>
              <Card className="group overflow-hidden hover-elevate cursor-pointer border">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-testid={`img-category-${category.name.toLowerCase()}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 
                      className="font-serif text-2xl font-bold text-white"
                      data-testid={`text-category-${category.name.toLowerCase()}`}
                    >
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
