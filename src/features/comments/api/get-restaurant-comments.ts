import { apiClient } from "@/shared/lib/api-client";

import type { RestaurantComment } from "../types";

type RestaurantCommentsResponse = {
  results: RestaurantComment[];
};

export async function getRestaurantComments(
  restaurantId: number,
): Promise<RestaurantComment[]> {
  const response = await apiClient<RestaurantCommentsResponse>(
    `/restaurants/${restaurantId}/comments`,
  );

  return Array.isArray(response.results) ? response.results : [];
}
