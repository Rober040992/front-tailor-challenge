"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states";
import { useAuth } from "@/features/auth/hooks/use-auth";

import { useDeleteRestaurantComment } from "../hooks/use-delete-restaurant-comment";
import { useRestaurantComments } from "../hooks/use-restaurant-comments";
import { CommentRating } from "./comment-rating";

type CommentListProps = {
  restaurantId: number;
};

export function CommentList({ restaurantId }: CommentListProps) {
  const { isLoading: isAuthLoading, user } = useAuth();
  const { data: comments, error, isLoading } =
    useRestaurantComments(restaurantId);
  const {
    canDeleteComment,
    errorCommentId,
    errorMessage,
    handleDeleteComment,
    pendingCommentId,
  } = useDeleteRestaurantComment({
    authenticatedUserId: user?.id ?? null,
    restaurantId,
  });

  if (isLoading) {
    return (
      <LoadingState message="Loading comments...">
        <div
          aria-hidden="true"
          className="h-40 animate-pulse border-b border-tailor-blue/70"
        />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        message="Comments could not be loaded."
        title="Comments unavailable."
      />
    );
  }

  if (!comments?.length) {
    return <EmptyState title="No comments yet." />;
  }

  return (
    <div>
      {comments.map((comment) => {
        const canShowDelete = !isAuthLoading && canDeleteComment(comment);
        const isDeleting = pendingCommentId === comment.id;
        const shouldShowDeleteError =
          errorCommentId === comment.id && Boolean(errorMessage);

        return (
          <article
            className="grid gap-5 border-b border-tailor-blue py-8 first:pt-0 sm:grid-cols-[minmax(8rem,0.3fr)_minmax(0,1fr)] sm:gap-10"
            key={comment.id}
          >
            <h3 className="text-lg font-bold text-tailor-white">
              {comment.name}
            </h3>

            <div className="space-y-4">
              <CommentRating rating={comment.rating} />
              <p className="max-w-3xl whitespace-pre-wrap leading-7 text-tailor-muted">
                {comment.body}
              </p>

              {canShowDelete ? (
                <button
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-tailor-error px-5 py-2 text-sm font-bold text-tailor-error transition hover:bg-tailor-error hover:text-tailor-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-error disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isDeleting}
                  onClick={() => handleDeleteComment(comment)}
                  type="button"
                >
                  Delete
                </button>
              ) : null}

              {shouldShowDeleteError ? (
                <p
                  className="text-sm font-bold text-tailor-error"
                  role="alert"
                >
                  {errorMessage}
                </p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
