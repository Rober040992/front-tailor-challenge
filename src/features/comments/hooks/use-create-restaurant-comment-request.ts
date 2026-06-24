"use client";

import { useState } from "react";

import { createRestaurantComment } from "../api/create-restaurant-comment";
import type { CreateRestaurantCommentRequest } from "../types";

export function useCreateRestaurantCommentRequest(restaurantId: number) {
  const [error, setError] = useState<unknown>(null);
  const [isPending, setIsPending] = useState(false);

  const createCommentRequest = async (
    input: CreateRestaurantCommentRequest,
  ): Promise<void> => {
    if (isPending) {
      return;
    }

    setError(null);
    setIsPending(true);

    try {
      await createRestaurantComment(restaurantId, input);
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsPending(false);
    }
  };

  return {
    createCommentRequest,
    error,
    isPending,
  };
}
