import { apiClient } from "@/shared/lib/api-client";

import type { CreateRestaurantCommentRequest } from "../types";

export async function createRestaurantComment(
  restaurantId: number,
  input: CreateRestaurantCommentRequest,
): Promise<void> {
  await apiClient<unknown>(`/restaurants/${restaurantId}/comments`, {
    method: "POST",
    body: input,
  });
}
