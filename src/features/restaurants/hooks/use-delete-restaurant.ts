"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteRestaurant } from "../api/delete-restaurant";
import { getRestaurantMutationErrorMessage } from "../lib/get-restaurant-mutation-error-message";

export function useDeleteRestaurant(restaurantId: number) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const closeErrorPopup = () => {
    setErrorMessage(null);
  };

  const handleDelete = async () => {
    if (isPending) {
      return;
    }

    setIsPending(true);
    setErrorMessage(null);

    try {
      await deleteRestaurant(restaurantId);
      router.push("/restaurants");
    } catch (error) {
      setErrorMessage(getRestaurantMutationErrorMessage(error));
    } finally {
      setIsPending(false);
    }
  };

  return {
    closeErrorPopup,
    errorMessage,
    handleDelete,
    isPending,
  };
}
