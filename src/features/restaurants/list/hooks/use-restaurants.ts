"use client";

import useSWR from "swr";

import { getRestaurants } from "../api/get-restaurants";
import type { RestaurantListItem } from "../../shared/types";

export function useRestaurants() {
  return useSWR<RestaurantListItem[]>("/restaurants", getRestaurants);
}
