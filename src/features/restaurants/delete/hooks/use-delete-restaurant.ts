"use client";

import { useRouter } from "next/navigation";

import { useDeleteRestaurantRequest } from "./use-delete-restaurant-request";

export function useDeleteRestaurant(restaurantId: number) {
  const router = useRouter();
  const {
    clearError,
    deleteRestaurantRequest,
    errorMessage,
    isPending,
  } = useDeleteRestaurantRequest(restaurantId);

  const handleDelete = async () => {
    const wasDeleted = await deleteRestaurantRequest();

    if (wasDeleted) {
      router.push("/restaurants");
    }
  };

  return {
    closeErrorPopup: clearError,
    errorMessage,
    handleDelete,
    isPending,
  };
}
