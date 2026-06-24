"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";

import { useCreateRestaurantCommentForm } from "../hooks/use-create-restaurant-comment-form";
import { CommentRatingSelector } from "./comment-rating-selector";

type CreateCommentFormProps = {
  restaurantId: number;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 text-sm font-bold text-tailor-error" id={id}>
      {message}
    </p>
  );
}

export function CreateCommentForm({ restaurantId }: CreateCommentFormProps) {
  const { isLoading, refreshUser, user } = useAuth();
  const {
    body,
    errors,
    handleBodyChange,
    handleRatingChange,
    handleSubmit,
    isPending,
    rating,
    status,
  } = useCreateRestaurantCommentForm({
    refreshUser,
    restaurantId,
  });

  if (status === "unauthenticated") {
    return (
      <div className="border-t border-tailor-border pt-6">
        <p className="text-sm font-bold text-tailor-error" role="alert">
          Sign in again to send a comment.
        </p>
      </div>
    );
  }

  if (isLoading || !user) {
    return null;
  }

  const ratingErrorId = errors.rating ? "comment-rating-error" : undefined;
  const bodyErrorId = errors.body ? "comment-body-error" : undefined;
  const formErrorId = errors.form ? "comment-form-error" : undefined;

  return (
    <form
      className="border-t border-tailor-border pt-6"
      noValidate
      onSubmit={handleSubmit}
    >
      <CommentRatingSelector
        disabled={isPending}
        errorId={ratingErrorId}
        onChange={handleRatingChange}
        value={rating}
      />
      <FieldError id="comment-rating-error" message={errors.rating} />

      <div className="mt-5">
        <label
          className="mb-3 block text-sm font-bold uppercase tracking-widest text-tailor-muted"
          htmlFor="comment-body"
        >
          Comment
        </label>
        <textarea
          aria-describedby={[bodyErrorId, formErrorId]
            .filter(Boolean)
            .join(" ") || undefined}
          aria-invalid={Boolean(errors.body || errors.form)}
          className="min-h-32 w-full resize-y rounded-tailor-md border border-tailor-blue bg-tailor-blue px-4 py-3 text-sm leading-6 text-tailor-white outline-none transition placeholder:text-white/65 hover:border-white focus:border-white focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          id="comment-body"
          name="body"
          onChange={(event) => handleBodyChange(event.target.value)}
          placeholder="write a comment here"
          value={body}
        />
        <FieldError id="comment-body-error" message={errors.body} />
      </div>

      <FieldError id="comment-form-error" message={errors.form} />

      {status === "error" ? (
        <p className="mt-3 text-sm font-bold text-tailor-error" role="alert">
          Comment could not be sent.
        </p>
      ) : null}

      {status === "success" ? (
        <p className="mt-3 text-sm font-bold text-green-400" role="status">
          comment sent!
        </p>
      ) : null}

      <button
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-tailor-white px-6 py-3 text-sm font-bold text-tailor-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        Send
      </button>
    </form>
  );
}
