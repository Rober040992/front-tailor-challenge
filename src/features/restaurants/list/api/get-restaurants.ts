import { apiClient } from "@/shared/lib/api-client";

import type { RestaurantListItem } from "../../shared/types";

export function getRestaurants(): Promise<RestaurantListItem[]> {
  return apiClient<RestaurantListItem[]>("/restaurants");
}
