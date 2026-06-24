"use client";

import { useState } from "react";

import type {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
} from "../../shared/types";
import { createRestaurant } from "../api/create-restaurant";

export function useCreateRestaurantRequest() {
  const [error, setError] = useState<unknown>(null);
  const [isPending, setIsPending] = useState(false);

  const createRestaurantRequest = async (
    input: CreateRestaurantRequest,
  ): Promise<CreateRestaurantResponse | null> => {
    if (isPending) {
      return null;
    }

    setError(null);
    setIsPending(true);

    try {
      return await createRestaurant(input);
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsPending(false);
    }
  };

  return {
    createRestaurantRequest,
    error,
    isPending,
  };
}
