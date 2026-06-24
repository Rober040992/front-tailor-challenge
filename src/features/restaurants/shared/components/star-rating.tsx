const STARS = "★★★★★";

const sizeClasses = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
} as const;

export interface StarRatingProps {
  averageRating: number | null | undefined;
  size?: keyof typeof sizeClasses;
  showValue?: boolean;
  className?: string;
}

export function StarRating({
  averageRating,
  size = "md",
  showValue = false,
  className = "",
}: StarRatingProps) {
  const safeRating =
    typeof averageRating === "number" && Number.isFinite(averageRating)
      ? Math.max(0, Math.min(5, averageRating))
      : 0;
  const fillPercent = (safeRating / 5) * 100;
  const ratingLabel =
    typeof averageRating === "number" && Number.isFinite(averageRating)
      ? averageRating
      : 0;

  return (
    <span
      aria-label={`Rating: ${ratingLabel} out of 5`}
      className={`inline-flex items-center gap-2 ${className}`}
      role="img"
    >
      <span
        aria-hidden="true"
        className={`relative inline-block leading-none tracking-wider ${sizeClasses[size]}`}
      >
        <span className="text-tailor-muted">{STARS}</span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-amber-500 transition-[width] duration-700 ease-in-out"
          style={{ width: `${fillPercent}%` }}
        >
          {STARS}
        </span>
      </span>

      {showValue && (
        <span aria-hidden="true" className="text-sm text-tailor-muted">
          {ratingLabel}
        </span>
      )}
    </span>
  );
}
