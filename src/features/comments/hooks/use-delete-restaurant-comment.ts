"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";

import type { ApiError } from "@/shared/lib/api-client";

import { deleteRestaurantComment } from "../api/delete-restaurant-comment";
import type { RestaurantComment } from "../types";

type UseDeleteRestaurantCommentParams = {
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

function getDeleteErrorMessage(error: unknown): string {
  if (hasApiStatus(error, 401)) {
    return "Sign in again to delete this comment.";
  }

  if (hasApiStatus(error, 403)) {
    return "You cannot delete this comment.";
  }

  if (hasApiStatus(error, 404)) {
    return "This comment no longer exists.";
  }

  return "Comment could not be deleted.";
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function useDeleteRestaurantComment({
  authenticatedUserId,
  restaurantId,
}: UseDeleteRestaurantCommentParams) {
  const { mutate } = useSWRConfig();
  const [errorCommentId, setErrorCommentId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingCommentId, setPendingCommentId] = useState<number | null>(null);

  function canDeleteComment(comment: RestaurantComment): boolean {
    return (
      authenticatedUserId !== null && comment.userId === authenticatedUserId
    );
  }

  async function handleDeleteComment(comment: RestaurantComment) {
    if (
      pendingCommentId !== null ||
      !isPositiveInteger(comment.id) ||
      !canDeleteComment(comment)
    ) {
      return;
    }

    setErrorCommentId(null);
    setErrorMessage(null);
    setPendingCommentId(comment.id);

    try {
      await deleteRestaurantComment(comment.id);
      await Promise.allSettled([
        mutate(`/restaurants/${restaurantId}/comments`),
        mutate(`/restaurants/${restaurantId}`),
      ]);
    } catch (error) {
      setErrorCommentId(comment.id);
      setErrorMessage(getDeleteErrorMessage(error));
    } finally {
      setPendingCommentId(null);
    }
  }

  return {
    canDeleteComment,
    errorCommentId,
    errorMessage,
    handleDeleteComment,
    pendingCommentId,
  };
}
