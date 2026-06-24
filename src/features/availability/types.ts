export type AvailabilitySlotStatus =
  | "available"
  | "booked"
  | "unavailable";

export type AvailabilitySlot = {
  time: string;
  availableSeats: number;
  status: AvailabilitySlotStatus;
};

export type AvailabilityResponse = {
  restaurantId: number;
  date: string;
  partySize: number;
  slots: AvailabilitySlot[];
};
