import { apiClient } from "@/shared/lib/api-client";

import type { RestaurantListItem } from "../types";

export function getRestaurants(): Promise<RestaurantListItem[]> {
  return apiClient<RestaurantListItem[]>("/restaurants");
}
