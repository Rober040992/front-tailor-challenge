"use client";

import { useState } from "react";

import { createReservation } from "../api/create-reservation";
import type { CreateReservationRequest } from "../types";

export function useCreateReservationRequest() {
  const [error, setError] = useState<unknown>(null);
  const [isPending, setIsPending] = useState(false);

  const createReservationRequest = async (
    input: CreateReservationRequest,
  ): Promise<void> => {
    if (isPending) {
      return;
    }

    setError(null);
    setIsPending(true);

    try {
      await createReservation(input);
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsPending(false);
    }
  };

  return {
    createReservationRequest,
    error,
    isPending,
  };
}
