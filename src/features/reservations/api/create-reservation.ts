import { apiClient } from "@/shared/lib/api-client";

import type { CreateReservationRequest } from "../types";

export async function createReservation(
  input: CreateReservationRequest,
): Promise<void> {
  await apiClient<unknown>("/reservations", {
    body: input,
    method: "POST",
  });
}
