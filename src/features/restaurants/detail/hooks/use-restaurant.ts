"use client";

import useSWR from "swr";

import { getRestaurant } from "../api/get-restaurant";
import type { RestaurantDetail } from "../../shared/types";

export function useRestaurant(restaurantId: number) {
  return useSWR<RestaurantDetail>(
    `/restaurants/${restaurantId}`,
    () => getRestaurant(restaurantId),
  );
}
