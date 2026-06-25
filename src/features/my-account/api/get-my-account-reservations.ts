import { apiClient } from "@/shared/lib/api-client";

import type { MyAccountReservation } from "../types";

export function getMyAccountReservations(): Promise<MyAccountReservation[]> {
  return apiClient<MyAccountReservation[]>("/me/reservations");
}
