"use client";

import useSWR from "swr";

import { getRestaurantComments } from "../api/get-restaurant-comments";
import type { RestaurantComment } from "../types";

export function useRestaurantComments(restaurantId: number | null) {
  const swrKey =
    restaurantId === null
      ? null
      : `/restaurants/${restaurantId}/comments`;

  const fetcher =
    restaurantId === null
      ? null
      : () => getRestaurantComments(restaurantId);

  return useSWR<RestaurantComment[]>(swrKey, fetcher);
}
