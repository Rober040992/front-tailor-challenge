import { apiClient } from "@/shared/lib/api-client";

import type { MyAccountFavouriteListResponse } from "../types";

export function getMyAccountFavourites(): Promise<MyAccountFavouriteListResponse> {
  return apiClient<MyAccountFavouriteListResponse>("/me/favourites");
}
