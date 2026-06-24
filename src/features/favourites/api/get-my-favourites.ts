import { apiClient } from "@/shared/lib/api-client";

import type { FavouriteListResponse } from "../types";

export function getMyFavourites(): Promise<FavouriteListResponse> {
  return apiClient<FavouriteListResponse>("/me/favourites");
}
