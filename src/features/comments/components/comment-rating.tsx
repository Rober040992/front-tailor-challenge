import { StarRating } from "@/features/restaurants/shared/components/star-rating";

type CommentRatingProps = {
  rating: number | null;
};

export function CommentRating({ rating }: CommentRatingProps) {
  const hasValidRating =
    typeof rating === "number" &&
    Number.isFinite(rating) &&
    rating >= 0 &&
    rating <= 5;

  if (!hasValidRating) {
    return <p className="text-sm text-tailor-muted">Rating unavailable</p>;
  }

  return <StarRating averageRating={rating} size="sm" />;
}
