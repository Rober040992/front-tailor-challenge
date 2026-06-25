"use client";

import { useState } from "react";
import useSWR from "swr";

import { cancelMyAccountReservation } from "../api/cancel-my-account-reservation";
import { getMyAccountReservations } from "../api/get-my-account-reservations";
import type { MyAccountReservation } from "../types";

export function useMyAccountReservations() {
  const [cancellingReservationId, setCancellingReservationId] = useState<
    number | null
  >(null);
  const [mutationErrorMessage, setMutationErrorMessage] = useState<
    string | null
  >(null);
  const { data, error, isLoading, mutate } = useSWR<MyAccountReservation[]>(
    "/me/reservations",
    getMyAccountReservations,
  );

  async function cancelReservation(
    reservationId: number,
    onSuccess?: () => Promise<unknown>,
  ): Promise<void> {
    if (cancellingReservationId !== null) {
      return;
    }

    setCancellingReservationId(reservationId);
    setMutationErrorMessage(null);

    try {
      await cancelMyAccountReservation(reservationId);
      await mutate();
      await onSuccess?.();
    } catch {
      setMutationErrorMessage("Reservation could not be cancelled.");
    } finally {
      setCancellingReservationId(null);
    }
  }

  return {
    cancelReservation,
    cancellingReservationId,
    error,
    isCancelling: cancellingReservationId !== null,
    isLoading,
    mutationErrorMessage,
    reservations: data ?? [],
  };
}
