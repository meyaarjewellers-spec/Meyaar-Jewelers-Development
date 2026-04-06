interface StarRatingSelectorProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

export function StarRatingSelector({ 
  rating, 
  onRatingChange,
  size = "md"
}: StarRatingSelectorProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`flex gap-2 ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRatingChange(star)}
          className="transition-colors hover:scale-110 transform"
        >
          <span
            className={
              star <= rating
                ? "text-yellow-500 cursor-pointer"
                : "text-gray-300 cursor-pointer"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
