"use client";

import { useState } from "react";

import { getRestaurantRequestErrorMessage } from "../../shared/lib/get-restaurant-request-error-message";
import { deleteRestaurant } from "../api/delete-restaurant";

export function useDeleteRestaurantRequest(restaurantId: number) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const clearError = () => {
    setErrorMessage(null);
  };

  const deleteRestaurantRequest = async (): Promise<boolean> => {
    if (isPending) {
      return false;
    }

    setErrorMessage(null);
    setIsPending(true);

    try {
      await deleteRestaurant(restaurantId);
      return true;
    } catch (error) {
      setErrorMessage(getRestaurantRequestErrorMessage(error));
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return {
    clearError,
    deleteRestaurantRequest,
    errorMessage,
    isPending,
  };
}
