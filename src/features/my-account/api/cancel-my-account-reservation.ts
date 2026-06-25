import { apiClient } from "@/shared/lib/api-client";

export async function cancelMyAccountReservation(
  reservationId: number,
): Promise<void> {
  await apiClient<unknown>(`/reservations/${reservationId}/cancel`, {
    method: "PATCH",
  });
}
