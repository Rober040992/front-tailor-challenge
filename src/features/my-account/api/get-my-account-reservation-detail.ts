import { apiClient } from "@/shared/lib/api-client";

import type { MyAccountReservationDetail } from "../types";

export function getMyAccountReservationDetail(
  reservationId: number,
): Promise<MyAccountReservationDetail> {
  return apiClient<MyAccountReservationDetail>(
    `/reservations/${reservationId}`,
  );
}
