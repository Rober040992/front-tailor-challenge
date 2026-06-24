"use client";

import { useState } from "react";

import { isSlotDisabled } from "@/features/availability/lib/availability-slot";
import type {
  AvailabilityResponse,
  AvailabilitySlot,
} from "@/features/availability/types";
import type { CurrentUser } from "@/features/auth/types";
import type { ApiError } from "@/shared/lib/api-client";

import type { ReservationFeedbackStatus } from "../types";
import { useCreateReservationRequest } from "./use-create-reservation-request";

type UseCreateReservationFromSlotParams = {
  availability: AvailabilityResponse | undefined;
  isAuthLoading: boolean;
  isAvailabilityLoading: boolean;
  partySize: number | null;
  refreshAvailability: () => Promise<unknown>;
  restaurantId: number;
  selectedDate: string | null;
  user: CurrentUser | null;
};

function hasApiStatus(error: unknown, statusCode: number): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    (error as ApiError).statusCode === statusCode
  );
}

export function useCreateReservationFromSlot({
  availability,
  isAuthLoading,
  isAvailabilityLoading,
  partySize,
  refreshAvailability,
  restaurantId,
  selectedDate,
  user,
}: UseCreateReservationFromSlotParams) {
  const {
    createReservationRequest,
    isPending: isReservationPending,
  } = useCreateReservationRequest();
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );
  const [reservationFeedback, setReservationFeedback] =
    useState<ReservationFeedbackStatus | null>(null);

  function clearReservationState() {
    setSelectedSlot(null);
    setReservationFeedback(null);
  }

  function handleSlotSelect(slot: AvailabilitySlot) {
    setSelectedSlot(slot);
    setReservationFeedback(null);
  }

  function closeReservationModal() {
    if (isReservationPending) {
      return;
    }

    setSelectedSlot(null);
  }

  async function confirmReservation() {
    if (
      isReservationPending ||
      isAuthLoading ||
      isAvailabilityLoading ||
      !Number.isInteger(restaurantId) ||
      restaurantId <= 0 ||
      !selectedDate ||
      !selectedSlot ||
      partySize === null
    ) {
      return;
    }

    if (!user) {
      setReservationFeedback("unauthenticated");
      return;
    }

    const latestSlot = availability?.slots.find(
      (slot) => slot.time === selectedSlot.time,
    );

    if (!latestSlot || isSlotDisabled(latestSlot, partySize)) {
      setReservationFeedback("conflict");
      return;
    }

    setReservationFeedback(null);

    try {
      await createReservationRequest({
        date: selectedDate,
        partySize,
        restaurantId,
        time: latestSlot.time,
      });
      setSelectedSlot(null);
      setReservationFeedback("success");
      await refreshAvailability();
    } catch (error) {
      if (hasApiStatus(error, 409)) {
        setReservationFeedback("conflict");
        return;
      }

      if (hasApiStatus(error, 401)) {
        setReservationFeedback("unauthenticated");
        return;
      }

      setReservationFeedback("error");
    }
  }

  return {
    clearReservationState,
    closeReservationModal,
    confirmReservation,
    handleSlotSelect,
    isReservationPending,
    reservationFeedback,
    selectedSlot,
  };
}
