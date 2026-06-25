"use client";

import { useState } from "react";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states";

import { useMyAccountReservationDetail } from "../hooks/use-my-account-reservation-detail";
import { useMyAccountReservations } from "../hooks/use-my-account-reservations";
import { ReservationDetailPanel } from "./reservation-detail-panel";

export function MyReservationsSection() {
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const {
    cancelReservation,
    cancellingReservationId,
    error,
    isLoading,
    mutationErrorMessage,
    reservations,
  } = useMyAccountReservations();
  const {
    data: selectedReservation,
    error: selectedReservationError,
    isLoading: selectedReservationIsLoading,
    mutate: refreshSelectedReservation,
  } = useMyAccountReservationDetail(selectedReservationId);

  function handleCancel(reservationId: number) {
    void cancelReservation(reservationId, async () => {
      await refreshSelectedReservation();
    });
  }

  return (
    <section aria-labelledby="my-reservations-heading" className="min-w-0">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-tailor-blue">
          Upcoming and past bookings
        </p>
        <h2 className="mt-2 text-2xl font-bold" id="my-reservations-heading">
          My reservations
        </h2>
      </div>

      {isLoading ? (
        <LoadingState message="Loading reservations...">
          {[0, 1, 2].map((item) => (
            <div
              aria-hidden="true"
              className="h-24 animate-pulse rounded-tailor-md bg-tailor-surface"
              key={item}
            />
          ))}
        </LoadingState>
      ) : null}

      {!isLoading && error ? (
        <ErrorState
          message="Your reservations could not be loaded."
          title="Something went wrong."
        />
      ) : null}

      {!isLoading && !error && !reservations.length ? (
        <EmptyState title="No reservations yet." />
      ) : null}

      {!isLoading && !error && reservations.length ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(18rem,1fr)]">
          <div className="space-y-3">
            {reservations.map((reservation) => {
              const isSelected = reservation.id === selectedReservationId;

              return (
                <button
                  aria-pressed={isSelected}
                  className="w-full rounded-tailor-md border border-tailor-border bg-tailor-surface p-5 text-left transition hover:border-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue aria-pressed:border-tailor-blue"
                  key={reservation.id}
                  onClick={() => setSelectedReservationId(reservation.id)}
                  type="button"
                >
                  <span className="block text-lg font-bold text-tailor-white">
                    {reservation.restaurantName}
                  </span>
                  <span className="mt-2 block text-sm text-tailor-muted">
                    {reservation.date}
                  </span>
                  <span className="mt-3 inline-flex rounded-full border border-tailor-border px-3 py-1 text-xs font-bold text-tailor-muted">
                    status: {reservation.status}
                  </span>
                </button>
              );
            })}
          </div>

          <ReservationDetailPanel
            cancellingReservationId={cancellingReservationId}
            detail={selectedReservation}
            error={selectedReservationError}
            isLoading={selectedReservationIsLoading}
            mutationErrorMessage={mutationErrorMessage}
            onCancel={handleCancel}
            selectedReservationId={selectedReservationId}
          />
        </div>
      ) : null}
    </section>
  );
}
