import type { AvailabilitySlot } from "@/features/availability/types";

import { getReservationFeedbackMessage } from "../lib/get-reservation-feedback-message";
import type { ReservationFeedbackStatus } from "../types";

type ReservationConfirmationModalProps = {
  isAuthLoading: boolean;
  isAvailabilityLoading: boolean;
  isReservationPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onLoginClick: () => void;
  partySize: number | null;
  reservationFeedback: ReservationFeedbackStatus | null;
  restaurantName: string;
  selectedDate: string | null;
  selectedSlot: AvailabilitySlot;
  userIsAuthenticated: boolean;
};

export function ReservationConfirmationModal({
  isAuthLoading,
  isAvailabilityLoading,
  isReservationPending,
  onClose,
  onConfirm,
  onLoginClick,
  partySize,
  reservationFeedback,
  restaurantName,
  selectedDate,
  selectedSlot,
  userIsAuthenticated,
}: ReservationConfirmationModalProps) {
  const shouldShowLoginAction =
    !isAuthLoading &&
    (!userIsAuthenticated || reservationFeedback === "unauthenticated");

  return (
    <div
      aria-labelledby="reservation-confirm-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-5 py-8"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-tailor-md border border-tailor-blue bg-tailor-black p-6 shadow-2xl">
        <h2 className="text-xl font-bold" id="reservation-confirm-title">
          Are you sure you want to reserve this slot?
        </h2>

        <dl className="mt-6 grid gap-4 text-sm">
          <div className="flex items-start justify-between gap-4 border-b border-tailor-border pb-3">
            <dt className="font-bold text-tailor-muted">Restaurant</dt>
            <dd className="text-right font-bold">{restaurantName}</dd>
          </div>
          <div className="flex items-start justify-between gap-4 border-b border-tailor-border pb-3">
            <dt className="font-bold text-tailor-muted">Date</dt>
            <dd className="text-right font-bold">{selectedDate}</dd>
          </div>
          <div className="flex items-start justify-between gap-4 border-b border-tailor-border pb-3">
            <dt className="font-bold text-tailor-muted">Time</dt>
            <dd className="text-right font-bold">{selectedSlot.time}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="font-bold text-tailor-muted">Party size</dt>
            <dd className="text-right font-bold">{partySize}</dd>
          </div>
        </dl>

        {isAuthLoading ? (
          <p className="mt-5 text-sm font-bold text-tailor-muted">
            Checking your session...
          </p>
        ) : null}

        {!isAuthLoading && !userIsAuthenticated && !reservationFeedback ? (
          <p className="mt-5 text-sm font-bold text-tailor-error">
            Sign in to reserve this slot.
          </p>
        ) : null}

        {reservationFeedback ? (
          <p
            className={[
              "mt-5 text-sm font-bold",
              reservationFeedback === "success"
                ? "text-tailor-white"
                : "text-tailor-error",
            ].join(" ")}
            role={reservationFeedback === "success" ? "status" : "alert"}
          >
            {getReservationFeedbackMessage(reservationFeedback)}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-tailor-border px-6 py-3 font-bold text-tailor-white transition hover:border-tailor-blue hover:text-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isReservationPending}
            onClick={onClose}
            type="button"
          >
            No
          </button>

          {shouldShowLoginAction ? (
            <button
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-tailor-white px-6 py-3 font-bold text-tailor-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isReservationPending}
              onClick={onLoginClick}
              type="button"
            >
              Sign in
            </button>
          ) : (
            <button
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-tailor-blue px-6 py-3 font-bold text-tailor-white transition hover:border-white hover:bg-tailor-blue/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue disabled:cursor-not-allowed disabled:opacity-60"
              disabled={
                isReservationPending || isAuthLoading || isAvailabilityLoading
              }
              onClick={onConfirm}
              type="button"
            >
              {isReservationPending ? "Reserving..." : "Yes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
