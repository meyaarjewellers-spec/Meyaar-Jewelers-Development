interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function StarRating({ 
  rating, 
  reviewCount, 
  size = "md",
  showCount = true 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex gap-0.5 ${sizeClasses[size]}`}>
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={i < Math.round(rating) ? "text-yellow-500" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
