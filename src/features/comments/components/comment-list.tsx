"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states";

import { useDeleteRestaurantComment } from "../hooks/use-delete-restaurant-comment";
import { useRestaurantComments } from "../hooks/use-restaurant-comments";
import { useUpdateRestaurantComment } from "../hooks/use-update-restaurant-comment";
import { CommentRating } from "./comment-rating";
import { CommentRatingSelector } from "./comment-rating-selector";

type CommentListProps = {
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
  const {
    body: updateBody,
    canUpdateComment,
    cancelEditingComment,
    editingCommentId,
    errors: updateErrors,
    handleBodyChange: handleUpdateBodyChange,
    handleRatingChange: handleUpdateRatingChange,
    handleUpdateComment,
    pendingCommentId: pendingUpdateCommentId,
    rating: updateRating,
    startEditingComment,
    successCommentId: updateSuccessCommentId,
  } = useUpdateRestaurantComment({
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
        const canShowUpdate = !isAuthLoading && canUpdateComment(comment);
        const isEditing = editingCommentId === comment.id;
        const anyCommentEditing = editingCommentId !== null;
        const isDeleting = pendingCommentId === comment.id;
        const isUpdatePending = pendingUpdateCommentId === comment.id;
        const anyUpdatePending = pendingUpdateCommentId !== null;
        const ratingErrorId = updateErrors.rating
          ? `comment-${comment.id}-rating-error`
          : undefined;
        const bodyErrorId = updateErrors.body
          ? `comment-${comment.id}-body-error`
          : undefined;
        const formErrorId = updateErrors.form
          ? `comment-${comment.id}-form-error`
          : undefined;
        const shouldShowDeleteError =
          errorCommentId === comment.id && Boolean(errorMessage);
        const shouldShowUpdateSuccess = updateSuccessCommentId === comment.id;

        return (
          <article
            className="grid gap-5 border-b border-tailor-blue py-8 first:pt-0 sm:grid-cols-[minmax(8rem,0.3fr)_minmax(0,1fr)] sm:gap-10"
            key={comment.id}
          >
            <h3 className="text-lg font-bold text-tailor-white">
              {comment.name}
            </h3>

            <div className="space-y-4">
              {isEditing ? (
                <form
                  className="space-y-4"
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleUpdateComment(comment);
                  }}
                >
                  <CommentRatingSelector
                    disabled={isUpdatePending}
                    errorId={ratingErrorId}
                    onChange={handleUpdateRatingChange}
                    value={updateRating}
                  />
                  <FieldError
                    id={`comment-${comment.id}-rating-error`}
                    message={updateErrors.rating}
                  />

                  <div>
                    <label
                      className="mb-3 block text-sm font-bold uppercase tracking-widest text-tailor-muted"
                      htmlFor={`comment-${comment.id}-body`}
                    >
                      Comment
                    </label>
                    <textarea
                      aria-describedby={[bodyErrorId, formErrorId]
                        .filter(Boolean)
                        .join(" ") || undefined}
                      aria-invalid={Boolean(
                        updateErrors.body || updateErrors.form,
                      )}
                      className="min-h-32 w-full resize-y rounded-tailor-md border border-tailor-blue bg-tailor-blue px-4 py-3 text-sm leading-6 text-tailor-white outline-none transition placeholder:text-white/65 hover:border-white focus:border-white focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isUpdatePending}
                      id={`comment-${comment.id}-body`}
                      name="body"
                      onChange={(event) =>
                        handleUpdateBodyChange(event.target.value)
                      }
                      placeholder="write a comment here"
                      value={updateBody}
                    />
                    <FieldError
                      id={`comment-${comment.id}-body-error`}
                      message={updateErrors.body}
                    />
                  </div>

                  <FieldError
                    id={`comment-${comment.id}-form-error`}
                    message={updateErrors.form}
                  />

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      className="inline-flex min-h-10 items-center justify-center rounded-full bg-tailor-white px-5 py-2 text-sm font-bold text-tailor-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isUpdatePending}
                      type="submit"
                    >
                      Save
                    </button>
                    <button
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-tailor-border px-5 py-2 text-sm font-bold text-tailor-white transition hover:border-tailor-blue hover:text-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isUpdatePending}
                      onClick={cancelEditingComment}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <CommentRating rating={comment.rating} />
                  <p className="max-w-3xl whitespace-pre-wrap leading-7 text-tailor-muted">
                    {comment.body}
                  </p>
                </>
              )}

              {shouldShowUpdateSuccess ? (
                <p className="text-sm font-bold text-green-400" role="status">
                  comment updated!
                </p>
              ) : null}

              {canShowUpdate && !isEditing ? (
                <button
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-tailor-border px-5 py-2 text-sm font-bold text-tailor-white transition hover:border-tailor-blue hover:text-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={anyCommentEditing || anyUpdatePending || isDeleting}
                  onClick={() => startEditingComment(comment)}
                  type="button"
                >
                  Update
                </button>
              ) : null}

              {canShowDelete ? (
                <button
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-tailor-error px-5 py-2 text-sm font-bold text-tailor-error transition hover:bg-tailor-error hover:text-tailor-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-error disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isDeleting || anyUpdatePending}
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
