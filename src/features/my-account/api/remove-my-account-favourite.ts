import { apiClient } from "@/shared/lib/api-client";

export async function removeMyAccountFavourite(
  restaurantId: number,
): Promise<void> {
  await apiClient<unknown>(`/me/favourites/${restaurantId}`, {
    method: "DELETE",
  });
}
