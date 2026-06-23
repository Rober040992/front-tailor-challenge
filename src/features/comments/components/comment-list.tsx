"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states";

import { useRestaurantComments } from "../hooks/use-restaurant-comments";
import { CommentRating } from "./comment-rating";

type CommentListProps = {
  restaurantId: number;
};

export function CommentList({ restaurantId }: CommentListProps) {
  const { data: comments, error, isLoading } =
    useRestaurantComments(restaurantId);

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
      {comments.map((comment, index) => (
        <article
          className="grid gap-5 border-b border-tailor-blue py-8 first:pt-0 sm:grid-cols-[minmax(8rem,0.3fr)_minmax(0,1fr)] sm:gap-10"
          key={`${comment.name}-${index}`}
        >
          <h3 className="text-lg font-bold text-tailor-white">
            {comment.name}
          </h3>

          <div className="space-y-4">
            <CommentRating rating={comment.rating} />
            <p className="max-w-3xl whitespace-pre-wrap leading-7 text-tailor-muted">
              {comment.body}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
