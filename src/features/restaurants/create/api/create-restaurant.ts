import { apiClient } from "@/shared/lib/api-client";

import type {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
} from "../../shared/types";

export function createRestaurant(
  input: CreateRestaurantRequest,
): Promise<CreateRestaurantResponse> {
  return apiClient<CreateRestaurantResponse>("/restaurants", {
    method: "POST",
    body: input,
  });
}
