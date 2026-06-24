export type AvailabilitySlot = {
  time: string;
  availableSeats: number;
  available: boolean;
};

export type AvailabilityResponse = {
  restaurantId: number;
  date: string;
  partySize: number;
  slots: AvailabilitySlot[];
};
