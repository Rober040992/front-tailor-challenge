import { apiClient } from "@/shared/lib/api-client";

import type {
  RestaurantDetail,
  UpdateRestaurantRequest,
} from "../../shared/types";

export function updateRestaurant(
  restaurantId: number,
  input: UpdateRestaurantRequest,
): Promise<RestaurantDetail> {
  return apiClient<RestaurantDetail>(`/restaurants/${restaurantId}`, {
    method: "PATCH",
    body: input,
  });
}
