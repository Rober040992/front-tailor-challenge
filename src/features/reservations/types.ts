export type CreateReservationRequest = {
  restaurantId: number;
  date: string;
  time: string;
  partySize: number;
};

export type ReservationFeedbackStatus =
  | "success"
  | "conflict"
  | "unauthenticated"
  | "error";
