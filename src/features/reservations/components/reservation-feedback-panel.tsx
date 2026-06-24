import { getReservationFeedbackMessage } from "../lib/get-reservation-feedback-message";
import type { ReservationFeedbackStatus } from "../types";

type ReservationFeedbackPanelProps = {
  feedback: ReservationFeedbackStatus;
  onLoginClick: () => void;
};

export function ReservationFeedbackPanel({
  feedback,
  onLoginClick,
}: ReservationFeedbackPanelProps) {
  return (
    <div
      className="mt-5 rounded-tailor-md border border-tailor-blue bg-tailor-surface p-5"
      role={feedback === "success" ? "status" : "alert"}
    >
      <p
        className={[
          "text-sm font-bold",
          feedback === "success" ? "text-tailor-white" : "text-tailor-error",
        ].join(" ")}
      >
        {getReservationFeedbackMessage(feedback)}
      </p>
      {feedback === "unauthenticated" ? (
        <button
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-tailor-white px-6 py-2 text-sm font-bold text-tailor-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          onClick={onLoginClick}
          type="button"
        >
          Sign in
        </button>
      ) : null}
    </div>
  );
}
