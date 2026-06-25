import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  AvailabilityResponse,
  AvailabilitySlot,
} from "@/features/availability/types";
import type { CurrentUser } from "@/features/auth/types";

import { useCreateReservationFromSlot } from "../hooks/use-create-reservation-from-slot";

const mocks = vi.hoisted(() => ({
  createReservationRequest: vi.fn(),
  useCreateReservationRequest: vi.fn(),
}));

vi.mock("../hooks/use-create-reservation-request", () => ({
  useCreateReservationRequest: mocks.useCreateReservationRequest,
}));

const availableSlot: AvailabilitySlot = {
  available: true,
  availableSeats: 4,
  time: "20:00",
};

const availability: AvailabilityResponse = {
  date: "2026-07-15",
  partySize: 2,
  restaurantId: 1,
  slots: [availableSlot],
};

const user: CurrentUser = {
  email: "aida@example.com",
  id: 1,
  username: "aida",
};

function renderReservationHook(
  overrides: Partial<Parameters<typeof useCreateReservationFromSlot>[0]> = {},
) {
  return renderHook(() =>
    useCreateReservationFromSlot({
      availability,
      isAuthLoading: false,
      isAvailabilityLoading: false,
      partySize: 2,
      refreshAvailability: vi.fn(async () => undefined),
      restaurantId: 1,
      selectedDate: "2026-07-15",
      user,
      ...overrides,
    }),
  );
}

describe("useCreateReservationFromSlot", () => {
  beforeEach(() => {
    mocks.createReservationRequest.mockReset();
    mocks.useCreateReservationRequest.mockReturnValue({
      createReservationRequest: mocks.createReservationRequest,
      isPending: false,
    });
  });

  it("submits the latest selected available slot", async () => {
    const refreshAvailability = vi.fn(async () => undefined);
    mocks.createReservationRequest.mockResolvedValue(undefined);
    const { result } = renderReservationHook({ refreshAvailability });

    act(() => result.current.handleSlotSelect(availableSlot));
    await act(async () => result.current.confirmReservation());

    expect(mocks.createReservationRequest).toHaveBeenCalledWith({
      date: "2026-07-15",
      partySize: 2,
      restaurantId: 1,
      time: "20:00",
    });
    expect(result.current.reservationFeedback).toBe("success");
    expect(result.current.selectedSlot).toBeNull();
    expect(refreshAvailability).toHaveBeenCalled();
  });

  it("maps backend conflict and auth errors to reservation feedback", async () => {
    mocks.createReservationRequest.mockRejectedValueOnce({ statusCode: 409 });
    const conflictResult = renderReservationHook();

    act(() => conflictResult.result.current.handleSlotSelect(availableSlot));
    await act(async () => conflictResult.result.current.confirmReservation());

    expect(conflictResult.result.current.reservationFeedback).toBe("conflict");

    mocks.createReservationRequest.mockRejectedValueOnce({ statusCode: 401 });
    const authResult = renderReservationHook();

    act(() => authResult.result.current.handleSlotSelect(availableSlot));
    await act(async () => authResult.result.current.confirmReservation());

    expect(authResult.result.current.reservationFeedback).toBe(
      "unauthenticated",
    );
  });
});
