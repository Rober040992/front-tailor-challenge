import { apiClient } from "@/shared/lib/api-client";

import type { AvailabilityResponse } from "../types";

type GetAvailabilityParams = {
  restaurantId: number;
  date: string;
  partySize: number;
};

export function getAvailability({
  date,
  partySize,
  restaurantId,
}: GetAvailabilityParams): Promise<AvailabilityResponse> {
  const searchParams = new URLSearchParams({
    date,
    partySize: String(partySize),
  });

  return apiClient<AvailabilityResponse>(
    `/restaurants/${restaurantId}/availability?${searchParams.toString()}`,
  );
}
