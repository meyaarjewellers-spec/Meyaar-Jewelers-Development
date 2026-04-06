import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StarRating, StarRatingSelector } from "@/components/shared";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  isVerifiedPurchase: boolean;
  date: string;
}

interface CustomerReviewsProps {
  productId: string;
  reviews?: Review[];
}

export function CustomerReviews({ productId, reviews = [] }: CustomerReviewsProps) {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    rating: 5,
    text: "",
  });
  const [allReviews, setAllReviews] = useState<Review[]>(reviews);

  // Calculate average rating
  const averageRating =
    allReviews.length > 0
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : 0;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
  }));

  const handleSubmitReview = () => {
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) {
      alert("Please fill in name and review text");
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      author: reviewForm.name,
      rating: reviewForm.rating,
      text: reviewForm.text,
      isVerifiedPurchase: true,
      date: new Date().toLocaleDateString(),
    };

    setAllReviews([newReview, ...allReviews]);
    setReviewForm({ name: "", email: "", rating: 5, text: "" });
    setIsWritingReview(false);
  };

  return (
    <div className="mt-16 border-t pt-12">
      <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Rating Summary */}
        <div className="flex flex-col items-start">
          <div className="text-5xl font-bold mb-2">{averageRating}</div>
          <div className="mb-2">
            <StarRating rating={parseFloat(averageRating.toString())} showCount={false} size="lg" />
          </div>
          <p className="text-sm text-gray-600 mb-6">
            {allReviews.length} reviews
          </p>

          {/* Rating Distribution */}
          <div className="space-y-3 w-full">
            {ratingDistribution.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm font-medium min-w-12">{star} Star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all"
                    style={{
                      width: `${
                        allReviews.length > 0
                          ? (count / allReviews.length) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 min-w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List & Write Review Button */}
        <div className="lg:col-span-3">
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => setIsWritingReview(!isWritingReview)}
              className="bg-black text-white hover:bg-gray-800 font-semibold px-6"
            >
              {isWritingReview ? "Cancel" : "Write a review"}
            </Button>
          </div>

          {/* Write Review Form */}
          {isWritingReview && (
            <Card className="p-6 mb-8 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Share Your Feedback</h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={reviewForm.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setReviewForm({ ...reviewForm, name: e.target.value })
                    }
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email (optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={reviewForm.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setReviewForm({ ...reviewForm, email: e.target.value })
                    }
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rating
                  </label>
                  <StarRatingSelector
                    rating={reviewForm.rating}
                    onRatingChange={(rating: number) =>
                      setReviewForm({ ...reviewForm, rating })
                    }
                    size="lg"
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Review
                  </label>
                  <Textarea
                    placeholder="Share your experience with this product..."
                    value={reviewForm.text}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setReviewForm({ ...reviewForm, text: e.target.value })
                    }
                    className="min-h-32 resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmitReview}
                  className="w-full bg-black text-white hover:bg-gray-800 font-semibold py-2"
                >
                  Submit Review
                </Button>
              </div>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {allReviews.length === 0 ? (
              <p className="text-center text-gray-600 py-8">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              allReviews.map((review) => (
                <Card key={review.id} className="p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.author}
                      </p>
                      {review.isVerifiedPurchase && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          ✓ Verified purchase
                        </p>
                      )}
                    </div>
                    <StarRating rating={review.rating} showCount={false} size="md" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{review.text}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
