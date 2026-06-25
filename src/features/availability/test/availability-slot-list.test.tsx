import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render";

import { AvailabilitySlotList } from "../components/availability-slot-list";

const baseProps = {
  availabilityError: undefined,
  isAvailabilityLoading: false,
  onSlotSelect: vi.fn(),
  partySize: 2,
  selectedDate: "2026-07-15",
  selectedTime: null,
};

describe("AvailabilitySlotList", () => {
  it("disables unavailable and low-capacity slots", () => {
    renderWithProviders(
      <AvailabilitySlotList
        {...baseProps}
        availability={{
          date: "2026-07-15",
          partySize: 4,
          restaurantId: 1,
          slots: [
            { available: false, availableSeats: 10, time: "18:00" },
            { available: true, availableSeats: 2, time: "19:00" },
          ],
        }}
        partySize={4}
      />,
    );

    expect(screen.getByRole("button", { name: /18:00/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /19:00/ })).toBeDisabled();
  });
});
