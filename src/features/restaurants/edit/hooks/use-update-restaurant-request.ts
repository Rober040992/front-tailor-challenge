"use client";

import { useState } from "react";

import { getRestaurantRequestErrorMessage } from "../../shared/lib/get-restaurant-request-error-message";
import type {
  RestaurantDetail,
  UpdateRestaurantRequest,
} from "../../shared/types";
import { updateRestaurant } from "../api/update-restaurant";

export function useUpdateRestaurantRequest(restaurantId: number) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const updateRestaurantRequest = async (
    input: UpdateRestaurantRequest,
  ): Promise<RestaurantDetail | null> => {
    if (isPending) {
      return null;
    }

    setErrorMessage(null);
    setIsPending(true);

    try {
      return await updateRestaurant(restaurantId, input);
    } catch (error) {
      setErrorMessage(getRestaurantRequestErrorMessage(error));
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return {
    errorMessage,
    isPending,
    updateRestaurantRequest,
  };
}
