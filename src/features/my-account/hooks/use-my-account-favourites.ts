"use client";

import { useState } from "react";
import useSWR from "swr";

import { getMyAccountFavourites } from "../api/get-my-account-favourites";
import { removeMyAccountFavourite } from "../api/remove-my-account-favourite";
import type { MyAccountFavouriteListResponse } from "../types";

const MY_ACCOUNT_FAVOURITES_KEY = ["my-account", "favourites"] as const;

export function useMyAccountFavourites() {
  const [deletingRestaurantId, setDeletingRestaurantId] = useState<
    number | null
  >(null);
  const [mutationErrorMessage, setMutationErrorMessage] = useState<
    string | null
  >(null);
  const { data, error, isLoading, mutate } =
    useSWR<MyAccountFavouriteListResponse>(
      MY_ACCOUNT_FAVOURITES_KEY,
      getMyAccountFavourites,
    );

  async function removeFavourite(restaurantId: number): Promise<void> {
    if (deletingRestaurantId !== null) {
      return;
    }

    setDeletingRestaurantId(restaurantId);
    setMutationErrorMessage(null);

    try {
      await removeMyAccountFavourite(restaurantId);
      await mutate();
    } catch {
      setMutationErrorMessage("Favourite could not be removed.");
    } finally {
      setDeletingRestaurantId(null);
    }
  }

  return {
    deletingRestaurantId,
    error,
    favourites: data?.results ?? [],
    isDeleting: deletingRestaurantId !== null,
    isLoading,
    mutationErrorMessage,
    removeFavourite,
  };
}
