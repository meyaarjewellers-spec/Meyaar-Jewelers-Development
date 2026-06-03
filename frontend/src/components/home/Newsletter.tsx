import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { subscribeNewsletter } from "@/lib/checkoutApi";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribeNewsletter(email, "footer");
      toast({ title: "Thank you for subscribing!", description: "Check your inbox for a welcome offer." });
      setEmail("");
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-card py-16">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Newsletter</p>
        <h2 className="mt-2 font-serif text-3xl md:text-4xl" data-testid="text-newsletter-title">
          Join Our Community
        </h2>
        <p className="mx-auto mt-3 mb-8 max-w-md text-muted-foreground">
          Be the first to know about new collections, exclusive offers, and artisan stories.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-full"
            data-testid="input-newsletter-email"
          />
          <Button type="submit" disabled={loading} className="rounded-full px-7" data-testid="button-newsletter-submit">
            {loading ? "…" : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}
