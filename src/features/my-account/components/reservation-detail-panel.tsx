"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states";

import type { MyAccountReservationDetail } from "../types";

type ReservationDetailPanelProps = Readonly<{
  cancellingReservationId: number | null;
  detail: MyAccountReservationDetail | undefined;
  error: unknown;
  isLoading: boolean;
  mutationErrorMessage: string | null;
  onCancel: (reservationId: number) => void;
  selectedReservationId: number | null;
}>;

export function ReservationDetailPanel({
  cancellingReservationId,
  detail,
  error,
  isLoading,
  mutationErrorMessage,
  onCancel,
  selectedReservationId,
}: ReservationDetailPanelProps) {
  if (selectedReservationId === null) {
    return <EmptyState title="Select a reservation to view details." />;
  }

  if (isLoading) {
    return <LoadingState message="Loading reservation..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Reservation details could not be loaded."
        title="Something went wrong."
      />
    );
  }

  if (!detail) {
    return null;
  }

  const isCancelling = cancellingReservationId === detail.id;
  const canCancel = detail.status === "confirmed";

  return (
    <article className="rounded-tailor-md border border-tailor-border bg-tailor-surface p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-tailor-blue">
            Reservation detail
          </p>
          <h3 className="mt-2 text-2xl font-bold">{detail.restaurantName}</h3>
        </div>
        <span className="w-fit rounded-full border border-tailor-border px-4 py-2 text-sm font-bold text-tailor-muted">
          status: {detail.status}
        </span>
      </div>

      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-bold text-tailor-muted">Date</dt>
          <dd className="mt-1 text-tailor-white">{detail.date}</dd>
        </div>
        <div>
          <dt className="font-bold text-tailor-muted">Time</dt>
          <dd className="mt-1 text-tailor-white">{detail.time}</dd>
        </div>
        <div>
          <dt className="font-bold text-tailor-muted">Party size</dt>
          <dd className="mt-1 text-tailor-white">{detail.partySize}</dd>
        </div>
        <div>
          <dt className="font-bold text-tailor-muted">Created at</dt>
          <dd className="mt-1 text-tailor-white">{detail.createdAt}</dd>
        </div>
      </dl>

      {mutationErrorMessage ? (
        <p className="mt-5 text-sm font-bold text-tailor-error" role="alert">
          {mutationErrorMessage}
        </p>
      ) : null}

      {canCancel ? (
        <button
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-tailor-error px-5 py-2 text-sm font-bold text-tailor-error transition hover:bg-tailor-error hover:text-tailor-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-error disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isCancelling}
          onClick={() => onCancel(detail.id)}
          type="button"
        >
          {isCancelling ? "Cancelling..." : "Cancel reservation"}
        </button>
      ) : null}
    </article>
  );
}
