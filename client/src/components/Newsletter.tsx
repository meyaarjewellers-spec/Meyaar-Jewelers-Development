import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    toast({
      title: "Thank you for subscribing!",
      description: "You'll receive updates about our latest collections.",
    });
    setEmail("");
  };

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h2 
          className="font-serif text-3xl md:text-4xl font-bold mb-4"
          data-testid="text-newsletter-title"
        >
          Join Our Community
        </h2>
        <p className="text-muted-foreground mb-8">
          Be the first to know about new collections, exclusive offers, and artisan stories.
        </p>
        
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
            data-testid="input-newsletter-email"
          />
          <Button 
            type="submit" 
            variant="default"
            data-testid="button-newsletter-submit"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
