import { apiClient } from "@/shared/lib/api-client";

import type { FavouriteItem } from "../types";

export function addFavourite(restaurantId: number): Promise<FavouriteItem> {
  return apiClient<FavouriteItem>(`/me/favourites/${restaurantId}`, {
    method: "POST",
  });
}
