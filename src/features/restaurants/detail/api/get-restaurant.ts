import { apiClient } from "@/shared/lib/api-client";

import type { RestaurantDetail } from "../../shared/types";

export function getRestaurant(
  restaurantId: number,
): Promise<RestaurantDetail> {
  return apiClient<RestaurantDetail>(`/restaurants/${restaurantId}`);
}
