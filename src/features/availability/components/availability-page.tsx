"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { UserMenuDropdown } from "@/features/auth/components/user-menu-dropdown";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ReservationConfirmationModal } from "@/features/reservations/components/reservation-confirmation-modal";
import { ReservationFeedbackPanel } from "@/features/reservations/components/reservation-feedback-panel";
import { useCreateReservationFromSlot } from "@/features/reservations/hooks/use-create-reservation-from-slot";
import { useRestaurant } from "@/features/restaurants/detail/hooks/use-restaurant";
import { isRestaurantNotFoundError } from "@/features/restaurants/shared/lib/get-restaurant-request-error-message";
import {
  ErrorState,
  LoadingState,
} from "@/shared/components/states";

import { AvailabilityCalendar } from "./availability-calendar";
import { AvailabilitySlotList } from "./availability-slot-list";
import { PartySizeSelector } from "./party-size-selector";
import { useAvailability } from "../hooks/use-availability";
import { getWeekdayName } from "../lib/calendar";

const INITIAL_MONTH = 6;
const INITIAL_YEAR = 2026;

type AvailabilityPageProps = {
  restaurantId: number;
};

function parsePartySize(value: string): number | null {
  const partySize = Number(value);

  if (!Number.isInteger(partySize) || partySize <= 0) {
    return null;
  }

  return partySize;
}

export function AvailabilityPage({ restaurantId }: AvailabilityPageProps) {
  const router = useRouter();
  const {
    isLoading: isAuthLoading,
    user,
  } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(INITIAL_MONTH);
  const [selectedYear, setSelectedYear] = useState(INITIAL_YEAR);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [partySizeInput, setPartySizeInput] = useState("");

  const partySize = partySizeInput.trim()
    ? parsePartySize(partySizeInput)
    : null;
  const hasInvalidPartySize =
    partySizeInput.trim().length > 0 && partySize === null;

  const {
    data: restaurant,
    error: restaurantError,
    isLoading: isRestaurantLoading,
  } = useRestaurant(restaurantId);
  const {
    data: availability,
    error: availabilityError,
    isLoading: isAvailabilityLoading,
    mutate: refreshAvailability,
  } = useAvailability(restaurantId, selectedDate, partySize);
  const {
    clearReservationState,
    closeReservationModal,
    confirmReservation,
    handleSlotSelect,
    isReservationPending,
    reservationFeedback,
    selectedSlot,
  } = useCreateReservationFromSlot({
    availability,
    isAuthLoading,
    isAvailabilityLoading,
    partySize,
    refreshAvailability,
    restaurantId,
    selectedDate,
    user,
  });

  const selectedWeekday = selectedDate ? getWeekdayName(selectedDate) : null;
  const selectedOperatingHours =
    selectedWeekday && restaurant?.operatingHours
      ? restaurant.operatingHours[selectedWeekday]
      : null;
  const selectedTime = selectedSlot?.time ?? null;

  function handlePreviousMonth() {
    setSelectedDate(null);
    clearReservationState();
    setSelectedMonth((currentMonth) => {
      if (currentMonth === 0) {
        setSelectedYear((currentYear) => currentYear - 1);

        return 11;
      }

      return currentMonth - 1;
    });
  }

  function handleNextMonth() {
    setSelectedDate(null);
    clearReservationState();
    setSelectedMonth((currentMonth) => {
      if (currentMonth === 11) {
        setSelectedYear((currentYear) => currentYear + 1);

        return 0;
      }

      return currentMonth + 1;
    });
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    clearReservationState();
  }

  function handlePartySizeChange(value: string) {
    setPartySizeInput(value);
    clearReservationState();
  }

  if (isRestaurantLoading) {
    return (
      <main className="min-h-screen bg-tailor-black px-5 py-8 text-tailor-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <LoadingState message="Loading restaurant..." />
        </div>
      </main>
    );
  }

  if (restaurantError) {
    const notFound = isRestaurantNotFoundError(restaurantError);

    return (
      <main className="min-h-screen bg-tailor-black px-4 py-20 text-tailor-white sm:px-6">
        <div className="mx-auto max-w-3xl">
          <ErrorState
            message={
              notFound
                ? "The requested restaurant does not exist."
                : "The restaurant could not be loaded."
            }
            title={
              notFound ? "Restaurant not found." : "Something went wrong."
            }
          />
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <main className="min-h-screen bg-tailor-black text-tailor-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Link
          aria-label="Back to restaurant"
          className="inline-flex rounded-full bg-black/70 p-3 transition hover:bg-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue"
          href={`/restaurants/${restaurant.id}`}
        >
          <Image alt="Tailor" height={32} src="/Logo.png" width={76} />
        </Link>
        <UserMenuDropdown />
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.55fr)] lg:items-start">
        <section aria-labelledby="availability-heading" className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-tailor-blue">
            Availability
          </p>
          <h1
            className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl"
            id="availability-heading"
          >
            {restaurant.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-tailor-muted sm:text-lg">
            {restaurant.address}
          </p>

          <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <AvailabilityCalendar
              onDateSelect={handleDateSelect}
              onNextMonth={handleNextMonth}
              onPreviousMonth={handlePreviousMonth}
              selectedDate={selectedDate}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />

            <PartySizeSelector
              hasInvalidPartySize={hasInvalidPartySize}
              onPartySizeChange={handlePartySizeChange}
              partySizeInput={partySizeInput}
              selectedDate={selectedDate}
              selectedOperatingHours={selectedOperatingHours}
              selectedWeekday={selectedWeekday}
            />
          </div>
        </section>

        <aside aria-labelledby="slots-heading" className="lg:sticky lg:top-6">
          <h2 className="text-xl font-bold" id="slots-heading">
            Time slots
          </h2>

          {reservationFeedback && !selectedSlot ? (
            <ReservationFeedbackPanel
              feedback={reservationFeedback}
              onLoginClick={() => router.push("/login")}
            />
          ) : null}

          <AvailabilitySlotList
            availability={availability}
            availabilityError={availabilityError}
            isAvailabilityLoading={isAvailabilityLoading}
            onSlotSelect={handleSlotSelect}
            partySize={partySize}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        </aside>
      </div>

      {selectedSlot ? (
        <ReservationConfirmationModal
          isAuthLoading={isAuthLoading}
          isAvailabilityLoading={isAvailabilityLoading}
          isReservationPending={isReservationPending}
          onClose={closeReservationModal}
          onConfirm={confirmReservation}
          onLoginClick={() => router.push("/login")}
          partySize={partySize}
          reservationFeedback={reservationFeedback}
          restaurantName={restaurant.name}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          userIsAuthenticated={Boolean(user)}
        />
      ) : null}
    </main>
  );
}
