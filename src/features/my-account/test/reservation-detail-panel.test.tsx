import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render";

import { ReservationDetailPanel } from "../components/reservation-detail-panel";
import type { MyAccountReservationDetail } from "../types";

const reservation: MyAccountReservationDetail = {
  cancelledAt: null,
  createdAt: "2026-06-25T10:00:00.000Z",
  date: "2026-07-15",
  id: 14,
  partySize: 2,
  restaurantId: 7,
  restaurantName: "Tailor Table",
  status: "confirmed",
  time: "20:00",
  updatedAt: "2026-06-25T10:00:00.000Z",
  userId: 1,
};

describe("ReservationDetailPanel", () => {
  it("keeps cancelled reservations visible without a cancel action", () => {
    renderWithProviders(
      <ReservationDetailPanel
        cancellingReservationId={null}
        detail={{ ...reservation, status: "cancelled" }}
        error={undefined}
        isLoading={false}
        mutationErrorMessage={null}
        onCancel={vi.fn()}
        selectedReservationId={reservation.id}
      />,
    );

    expect(screen.getByText("status: cancelled")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel reservation" }),
    ).toBeNull();
  });
});
