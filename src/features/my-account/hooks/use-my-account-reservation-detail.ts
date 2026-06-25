"use client";

import useSWR from "swr";

import { getMyAccountReservationDetail } from "../api/get-my-account-reservation-detail";

export function useMyAccountReservationDetail(
  reservationId: number | null,
) {
  const key =
    reservationId === null
      ? null
      : (["my-account", "reservation-detail", reservationId] as const);

  return useSWR(key, ([, , selectedReservationId]) =>
    getMyAccountReservationDetail(selectedReservationId),
  );
}
