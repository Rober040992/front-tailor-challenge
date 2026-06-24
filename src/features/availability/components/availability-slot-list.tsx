import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states";

import { getSlotLabel, isSlotDisabled } from "../lib/availability-slot";
import type { AvailabilityResponse, AvailabilitySlot } from "../types";

type AvailabilitySlotListProps = {
  availability: AvailabilityResponse | undefined;
  availabilityError: unknown;
  isAvailabilityLoading: boolean;
  onSlotSelect: (slot: AvailabilitySlot) => void;
  partySize: number | null;
  selectedDate: string | null;
  selectedTime: string | null;
};

export function AvailabilitySlotList({
  availability,
  availabilityError,
  isAvailabilityLoading,
  onSlotSelect,
  partySize,
  selectedDate,
  selectedTime,
}: AvailabilitySlotListProps) {
  if (!selectedDate || partySize === null) {
    return (
      <div className="mt-5 rounded-tailor-md border border-tailor-border bg-tailor-surface p-6">
        <p className="text-sm leading-6 text-tailor-muted">
          Select a date and party size to check available times.
        </p>
      </div>
    );
  }

  if (isAvailabilityLoading) {
    return (
      <div className="mt-5">
        <LoadingState message="Checking availability..." />
      </div>
    );
  }

  if (availabilityError) {
    return (
      <div className="mt-5">
        <ErrorState
          message="Availability could not be loaded."
          title="Something went wrong."
        />
      </div>
    );
  }

  if (availability && availability.slots.length === 0) {
    return (
      <div className="mt-5">
        <EmptyState title="No slots available for this selection." />
      </div>
    );
  }

  if (!availability || availability.slots.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 grid gap-3">
      {availability.slots.map((slot) => {
        const disabled = isSlotDisabled(slot, partySize);
        const selected = selectedTime === slot.time;

        return (
          <button
            aria-pressed={!disabled && selected}
            className={[
              "flex min-h-14 items-center justify-between rounded-tailor-md border px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue disabled:cursor-not-allowed",
              disabled
                ? "border-tailor-border bg-tailor-surface text-tailor-muted opacity-70"
                : selected
                  ? "border-tailor-blue bg-tailor-blue text-tailor-white"
                  : "border-tailor-border bg-tailor-surface text-tailor-white hover:border-tailor-blue hover:text-tailor-blue",
            ].join(" ")}
            disabled={disabled}
            key={slot.time}
            onClick={() => onSlotSelect(slot)}
            type="button"
          >
            <span className="font-bold">{slot.time}</span>
            <span className="text-sm font-bold">
              {getSlotLabel(slot, partySize)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
