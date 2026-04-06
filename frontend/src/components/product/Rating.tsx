interface RatingProps {
  rating: number;
  reviewCount?: number;
}

export function Rating({ rating, reviewCount }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-500 text-lg">★</span>
        ))}
      </div>
      {reviewCount && (
        <span className="text-sm text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
