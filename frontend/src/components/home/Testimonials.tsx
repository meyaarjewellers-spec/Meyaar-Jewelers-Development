import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="font-serif text-3xl md:text-4xl font-bold mb-2"
            data-testid="text-testimonials-title"
          >
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground">Timeless pieces, cherished forever</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="p-6"
              data-testid={`card-testimonial-${testimonial.id}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p 
                    className="font-medium"
                    data-testid={`text-testimonial-name-${testimonial.id}`}
                  >
                    {testimonial.name}
                  </p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
              <p 
                className="text-sm text-muted-foreground italic"
                data-testid={`text-testimonial-text-${testimonial.id}`}
              >
                "{testimonial.text}"
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
