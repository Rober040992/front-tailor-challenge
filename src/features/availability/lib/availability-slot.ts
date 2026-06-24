import type { AvailabilitySlot } from "../types";

function getNormalizedAvailableSeats(slot: AvailabilitySlot): number | null {
  const availableSeats = Number(slot.availableSeats);

  if (!Number.isFinite(availableSeats)) {
    return null;
  }

  return availableSeats;
}

export function getSlotLabel(
  slot: AvailabilitySlot,
  partySize: number | null,
): string {
  const availableSeats = getNormalizedAvailableSeats(slot);

  if (
    availableSeats === null ||
    (partySize !== null && availableSeats < partySize)
  ) {
    if (availableSeats === 0) {
      return "Booked";
    }

    return "Unavailable";
  }

  if (!slot.available) {
    return availableSeats === 0 ? "Booked" : "Unavailable";
  }

  return `${availableSeats} seats`;
}

export function isSlotDisabled(
  slot: AvailabilitySlot,
  partySize: number | null,
): boolean {
  const availableSeats = getNormalizedAvailableSeats(slot);

  return (
    partySize === null ||
    !slot.available ||
    availableSeats === null ||
    availableSeats < partySize
  );
}
