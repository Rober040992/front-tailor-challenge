import { apiClient } from "@/shared/lib/api-client";

export async function deleteRestaurant(restaurantId: number): Promise<void> {
  await apiClient<unknown>(`/restaurants/${restaurantId}`, {
    method: "DELETE",
  });
}
