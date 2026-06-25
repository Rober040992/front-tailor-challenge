"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";

import type { ApiError } from "@/shared/lib/api-client";

import { updateRestaurantComment } from "../api/update-restaurant-comment";
import type { RestaurantComment } from "../types";

type CommentUpdateErrors = {
  body?: string;
  form?: string;
  rating?: string;
};

type UseUpdateRestaurantCommentParams = {
  authenticatedUserId: number | null;
  restaurantId: number;
};

function hasApiStatus(error: unknown, statusCode: number): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    (error as ApiError).statusCode === statusCode
  );
}

function getUpdateErrorMessage(error: unknown): string {
  if (hasApiStatus(error, 401)) {
    return "Sign in again to update this comment.";
  }

  if (hasApiStatus(error, 403)) {
    return "You cannot update this comment.";
  }

  if (hasApiStatus(error, 404)) {
    return "This comment no longer exists.";
  }

  return "Comment could not be updated.";
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function isValidRating(value: number | null): value is number {
  return value !== null && Number.isInteger(value) && value >= 1 && value <= 5;
}

function getInitialRating(comment: RestaurantComment): number | null {
  return isValidRating(comment.rating) ? comment.rating : null;
}

function validateUpdateForm(
  rating: number | null,
  body: string,
): CommentUpdateErrors {
  const errors: CommentUpdateErrors = {};

  if (!isValidRating(rating)) {
    errors.rating = "Select a rating.";
  }

  if (!body.trim()) {
    errors.body = "Write a comment.";
  }

  return errors;
}

export function useUpdateRestaurantComment({
  authenticatedUserId,
  restaurantId,
}: UseUpdateRestaurantCommentParams) {
  const { mutate } = useSWRConfig();
  const [body, setBody] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [errors, setErrors] = useState<CommentUpdateErrors>({});
  const [pendingCommentId, setPendingCommentId] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [successCommentId, setSuccessCommentId] = useState<number | null>(null);

  function canUpdateComment(comment: RestaurantComment): boolean {
    return (
      authenticatedUserId !== null && comment.userId === authenticatedUserId
    );
  }

  function startEditingComment(comment: RestaurantComment) {
    if (
      pendingCommentId !== null ||
      editingCommentId !== null ||
      !canUpdateComment(comment)
    ) {
      return;
    }

    setBody(comment.body);
    setEditingCommentId(comment.id);
    setErrors({});
    setRating(getInitialRating(comment));
    setSuccessCommentId(null);
  }

  function cancelEditingComment() {
    if (pendingCommentId !== null) {
      return;
    }

    setBody("");
    setEditingCommentId(null);
    setErrors({});
    setRating(null);
  }

  function handleBodyChange(nextBody: string) {
    setBody(nextBody);
    setErrors((currentErrors) => ({
      ...currentErrors,
      body: undefined,
      form: undefined,
    }));
  }

  function handleRatingChange(nextRating: number) {
    setRating(nextRating);
    setErrors((currentErrors) => ({
      ...currentErrors,
      form: undefined,
      rating: undefined,
    }));
  }

  async function handleUpdateComment(comment: RestaurantComment) {
    if (
      pendingCommentId !== null ||
      editingCommentId !== comment.id ||
      !isPositiveInteger(comment.id) ||
      !canUpdateComment(comment)
    ) {
      return;
    }

    const nextErrors = validateUpdateForm(rating, body);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !isValidRating(rating)) {
      return;
    }

    setPendingCommentId(comment.id);

    try {
      await updateRestaurantComment(comment.id, {
        rating,
        body: body.trim(),
      });
      setBody("");
      setEditingCommentId(null);
      setErrors({});
      setRating(null);
      setSuccessCommentId(comment.id);
      await Promise.allSettled([
        mutate(`/restaurants/${restaurantId}/comments`),
        mutate(`/restaurants/${restaurantId}`),
      ]);
    } catch (error) {
      if (hasApiStatus(error, 400)) {
        setErrors({
          form: "Check the rating and comment.",
        });
        return;
      }

      setErrors({
        form: getUpdateErrorMessage(error),
      });
    } finally {
      setPendingCommentId(null);
    }
  }

  return {
    body,
    canUpdateComment,
    cancelEditingComment,
    editingCommentId,
    errors,
    handleBodyChange,
    handleRatingChange,
    handleUpdateComment,
    pendingCommentId,
    rating,
    startEditingComment,
    successCommentId,
  };
}
