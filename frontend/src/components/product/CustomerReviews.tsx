import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StarRating, StarRatingSelector } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";
import { fetchReviews, submitReview, type ReviewItem } from "@/lib/checkoutApi";

interface CustomerReviewsProps {
  productId: string;
}

export function CustomerReviews({ productId }: CustomerReviewsProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchReviews(productId);
        if (mounted) setReviews(data.reviews);
      } catch {
        // Reviews are non-critical; show empty state on failure.
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [productId]);

  const count = reviews.length;
  const average = count > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1) : "0.0";
  const distribution = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.text.trim()) {
      toast({ title: "Please add your name and review", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const created = await submitReview(productId, { authorName: form.name.trim(), rating: form.rating, content: form.text.trim() });
      setReviews((prev) => [created, ...prev]);
      setForm({ name: "", rating: 5, text: "" });
      setIsWriting(false);
      toast({ title: "Thank you for your review!" });
    } catch (err) {
      toast({ title: "Could not submit review", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-border pt-12">
      <h2 className="mb-8 font-serif text-3xl">Customer Reviews</h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Summary */}
        <div className="flex flex-col items-start">
          <div className="font-serif text-5xl">{average}</div>
          <div className="mb-2 mt-1">
            <StarRating rating={parseFloat(average)} showCount={false} size="lg" />
          </div>
          <p className="mb-6 text-sm text-muted-foreground">{count} review{count === 1 ? "" : "s"}</p>

          <div className="w-full space-y-3">
            {distribution.map(({ star, count: c }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="min-w-12 text-sm font-medium">{star} ★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary transition-all" style={{ width: `${count > 0 ? (c / count) * 100 : 0}%` }} />
                </div>
                <span className="min-w-8 text-sm text-muted-foreground">{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* List + form */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex justify-end">
            <Button onClick={() => setIsWriting((w) => !w)} variant={isWriting ? "outline" : "default"} className="rounded-full px-6">
              {isWriting ? "Cancel" : "Write a review"}
            </Button>
          </div>

          {isWriting && (
            <Card className="mb-8 p-6">
              <h3 className="mb-4 font-serif text-lg">Share your experience</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Your name</label>
                  <Input value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Rating</label>
                  <StarRatingSelector rating={form.rating} onRatingChange={(rating: number) => setForm({ ...form, rating })} size="lg" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Your review</label>
                  <Textarea value={form.text} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, text: e.target.value })} placeholder="Tell us what you love…" className="min-h-32 resize-none" />
                </div>
                <Button onClick={handleSubmit} disabled={submitting} className="w-full rounded-full">
                  {submitting ? "Submitting…" : "Submit Review"}
                </Button>
              </div>
            </Card>
          )}

          <div className="space-y-4">
            {loading ? (
              <p className="py-8 text-center text-muted-foreground">Loading reviews…</p>
            ) : reviews.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No reviews yet. Be the first to review this piece.</p>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="p-5">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{review.author}</p>
                      {review.isVerifiedPurchase && (
                        <p className="flex items-center gap-1 text-xs text-primary">✓ Verified purchase</p>
                      )}
                    </div>
                    <StarRating rating={review.rating} showCount={false} size="md" />
                  </div>
                  {review.title && <p className="mb-1 font-medium">{review.title}</p>}
                  <p className="mb-3 text-sm text-muted-foreground">{review.content}</p>
                  <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
