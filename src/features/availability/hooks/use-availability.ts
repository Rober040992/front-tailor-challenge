"use client";

import useSWR from "swr";

import { getAvailability } from "../api/get-availability";
import type { AvailabilityResponse } from "../types";

export function useAvailability(
  restaurantId: number,
  date: string | null,
  partySize: number | null,
) {
  const shouldFetch =
    Number.isInteger(restaurantId) &&
    restaurantId > 0 &&
    Boolean(date) &&
    Number.isInteger(partySize) &&
    partySize !== null &&
    partySize > 0;

  return useSWR<AvailabilityResponse>(
    shouldFetch
      ? [
          "restaurant-availability",
          restaurantId,
          date,
          partySize,
        ]
      : null,
    () =>
      getAvailability({
        date: date as string,
        partySize: partySize as number,
        restaurantId,
      }),
  );
}
