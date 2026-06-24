"use client";

const RATINGS = [1, 2, 3, 4, 5] as const;

type CommentRatingSelectorProps = {
  disabled?: boolean;
  errorId?: string;
  onChange: (rating: number) => void;
  value: number | null;
};

export function CommentRatingSelector({
  disabled = false,
  errorId,
  onChange,
  value,
}: CommentRatingSelectorProps) {
  return (
    <fieldset
      aria-describedby={errorId}
      aria-invalid={Boolean(errorId)}
      className="space-y-3"
    >
      <legend className="text-sm font-bold uppercase tracking-widest text-tailor-muted">
        Rating
      </legend>

      <div className="flex items-center gap-1">
        {RATINGS.map((rating) => {
          const isSelected = value !== null && rating <= value;

          return (
            <button
              aria-label={`Select ${rating} star rating`}
              aria-pressed={value === rating}
              className={[
                "text-2xl leading-none tracking-wider transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue disabled:cursor-not-allowed disabled:opacity-60",
                isSelected
                  ? "text-amber-500"
                  : "text-tailor-muted hover:text-amber-500",
              ].join(" ")}
              disabled={disabled}
              key={rating}
              onClick={() => onChange(rating)}
              type="button"
            >
              <span aria-hidden="true">&#9733;</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
