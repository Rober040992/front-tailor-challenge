"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { UserMenuDropdown } from "@/features/auth/components/user-menu-dropdown";
import { useRestaurant } from "@/features/restaurants/detail/hooks/use-restaurant";
import { isRestaurantNotFoundError } from "@/features/restaurants/shared/lib/get-restaurant-request-error-message";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states";

import { useAvailability } from "../hooks/use-availability";
import type { AvailabilitySlot } from "../types";

const INITIAL_MONTH = 6;
const INITIAL_YEAR = 2026;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type AvailabilityPageProps = {
  restaurantId: number;
};

type CalendarCell = {
  date: string;
  day: number;
} | null;

function formatDate(year: number, month: number, day: number): string {
  return [
    String(year),
    String(month + 1).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

function getCalendarCells(year: number, month: number): CalendarCell[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: CalendarCell[] = Array.from(
    { length: firstWeekday },
    () => null,
  );

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: formatDate(year, month, day),
      day,
    });
  }

  return cells;
}

function getMonthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
}

function getWeekdayName(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(new Date(year, month - 1, day));
}

function parsePartySize(value: string): number | null {
  const partySize = Number(value);

  if (!Number.isInteger(partySize) || partySize <= 0) {
    return null;
  }

  return partySize;
}

function getSlotLabel(slot: AvailabilitySlot, partySize: number | null): string {
  if (slot.status === "booked") {
    return "Booked";
  }

  if (slot.status === "unavailable") {
    return "Unavailable";
  }

  if (partySize !== null && slot.availableSeats < partySize) {
    return "Unavailable";
  }

  return `${slot.availableSeats} seats`;
}

function isSlotDisabled(
  slot: AvailabilitySlot,
  partySize: number | null,
): boolean {
  return (
    slot.status !== "available" ||
    partySize === null ||
    slot.availableSeats < partySize
  );
}

export function AvailabilityPage({ restaurantId }: AvailabilityPageProps) {
  const [selectedMonth, setSelectedMonth] = useState(INITIAL_MONTH);
  const [selectedYear, setSelectedYear] = useState(INITIAL_YEAR);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [partySizeInput, setPartySizeInput] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
  } = useAvailability(restaurantId, selectedDate, partySize);

  const calendarCells = useMemo(
    () => getCalendarCells(selectedYear, selectedMonth),
    [selectedMonth, selectedYear],
  );
  const selectedWeekday = selectedDate ? getWeekdayName(selectedDate) : null;
  const selectedOperatingHours =
    selectedWeekday && restaurant?.operatingHours
      ? restaurant.operatingHours[selectedWeekday]
      : null;

  function handlePreviousMonth() {
    setSelectedDate(null);
    setSelectedTime(null);
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
    setSelectedTime(null);
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
    setSelectedTime(null);
  }

  function handlePartySizeChange(value: string) {
    setPartySizeInput(value);
    setSelectedTime(null);
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
            <section aria-labelledby="calendar-heading">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold" id="calendar-heading">
                  {getMonthLabel(selectedYear, selectedMonth)}
                </h2>
                <div className="flex gap-2">
                  <button
                    aria-label="Previous month"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-tailor-border text-lg font-bold transition hover:border-tailor-blue hover:text-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue"
                    onClick={handlePreviousMonth}
                    type="button"
                  >
                    &lt;
                  </button>
                  <button
                    aria-label="Next month"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-tailor-border text-lg font-bold transition hover:border-tailor-blue hover:text-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue"
                    onClick={handleNextMonth}
                    type="button"
                  >
                    &gt;
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {WEEKDAYS.map((weekday) => (
                  <div
                    className="py-2 text-xs font-bold uppercase tracking-widest text-tailor-muted"
                    key={weekday}
                  >
                    {weekday}
                  </div>
                ))}

                {calendarCells.map((cell, index) =>
                  cell ? (
                    <button
                      aria-pressed={selectedDate === cell.date}
                      className={[
                        "aspect-square rounded-tailor-sm border text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue sm:text-base",
                        selectedDate === cell.date
                          ? "border-tailor-blue bg-tailor-blue text-tailor-white"
                          : "border-tailor-border bg-tailor-surface text-tailor-white hover:border-tailor-blue hover:text-tailor-blue",
                      ].join(" ")}
                      key={cell.date}
                      onClick={() => handleDateSelect(cell.date)}
                      type="button"
                    >
                      {cell.day}
                    </button>
                  ) : (
                    <div aria-hidden="true" key={`empty-${index}`} />
                  ),
                )}
              </div>
            </section>

            <section aria-labelledby="party-size-heading">
              <h2 className="text-xl font-bold" id="party-size-heading">
                Party size
              </h2>
              <label className="mt-5 block" htmlFor="partySize">
                <span className="mb-3 block text-sm font-bold text-tailor-muted">
                  Guests
                </span>
                <input
                  aria-describedby={
                    hasInvalidPartySize ? "partySize-error" : undefined
                  }
                  aria-invalid={hasInvalidPartySize}
                  className="min-h-12 w-full rounded-full border border-tailor-blue bg-tailor-blue px-5 py-3 text-tailor-white outline-none transition placeholder:text-white/65 hover:border-white focus:border-white focus:ring-2 focus:ring-white/30"
                  id="partySize"
                  min={1}
                  onChange={(event) =>
                    handlePartySizeChange(event.target.value)
                  }
                  placeholder="2"
                  type="number"
                  value={partySizeInput}
                />
              </label>
              {hasInvalidPartySize ? (
                <p
                  className="mt-2 text-sm font-bold text-tailor-error"
                  id="partySize-error"
                >
                  Party size must be a positive whole number.
                </p>
              ) : null}

              <div className="mt-8 border-t border-tailor-border pt-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-tailor-muted">
                  Selected day
                </h3>
                {selectedDate ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-lg font-bold">{selectedDate}</p>
                    <p className="text-sm leading-6 text-tailor-muted">
                      {selectedOperatingHours
                        ? `${selectedWeekday}: ${selectedOperatingHours}`
                        : "No operating hours listed for this day."}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-tailor-muted">
                    Select a date to see operating hours.
                  </p>
                )}
              </div>
            </section>
          </div>
        </section>

        <aside aria-labelledby="slots-heading" className="lg:sticky lg:top-6">
          <h2 className="text-xl font-bold" id="slots-heading">
            Time slots
          </h2>

          {!selectedDate || partySize === null ? (
            <div className="mt-5 rounded-tailor-md border border-tailor-border bg-tailor-surface p-6">
              <p className="text-sm leading-6 text-tailor-muted">
                Select a date and party size to check available times.
              </p>
            </div>
          ) : null}

          {selectedDate && partySize !== null && isAvailabilityLoading ? (
            <div className="mt-5">
              <LoadingState message="Checking availability..." />
            </div>
          ) : null}

          {selectedDate && partySize !== null && availabilityError ? (
            <div className="mt-5">
              <ErrorState
                message="Availability could not be loaded."
                title="Something went wrong."
              />
            </div>
          ) : null}

          {selectedDate &&
          partySize !== null &&
          availability &&
          availability.slots.length === 0 ? (
            <div className="mt-5">
              <EmptyState title="No slots available for this selection." />
            </div>
          ) : null}

          {selectedDate &&
          partySize !== null &&
          availability &&
          availability.slots.length > 0 ? (
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
                    onClick={() => setSelectedTime(slot.time)}
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
          ) : null}
        </aside>
      </div>
    </main>
  );
}
