import type { ReservationFeedbackStatus } from "../types";

export function getReservationFeedbackMessage(
  feedback: ReservationFeedbackStatus,
): string {
  if (feedback === "success") {
    return "Reservation created.";
  }

  if (feedback === "conflict") {
    return "This slot no longer has enough capacity. Please choose another time.";
  }

  if (feedback === "unauthenticated") {
    return "Sign in to reserve this slot.";
  }

  return "Reservation could not be created. Please try again.";
}
