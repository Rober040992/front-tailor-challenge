"use client";

import Image from "next/image";
import { useState } from "react";
import type { MouseEvent } from "react";

import { UserMenuDropdown } from "@/features/auth/components/user-menu-dropdown";
import type { RestaurantListItem } from "@/features/restaurants/shared/types";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states";

import { useRestaurants } from "../hooks/use-restaurants";
import { RestaurantList } from "./restaurant-list";
import { RestaurantMap } from "./restaurant-map";

export function RestaurantListPage() {
  const { data: restaurants, error, isLoading } = useRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantListItem | null>(null);

  function handlePageClick(event: MouseEvent<HTMLElement>) {
    if (!selectedRestaurant || !(event.target instanceof Element)) {
      return;
    }

    const selectedItem = event.target.closest(
      `[data-restaurant-item-id="${selectedRestaurant.id}"]`,
    );

    if (!selectedItem) {
      setSelectedRestaurant(null);
    }
  }

  return (
    <main
      className="min-h-screen bg-tailor-black px-4 py-6 text-tailor-white sm:px-6 lg:h-screen lg:overflow-hidden lg:px-8"
      onClickCapture={handlePageClick}
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:h-full lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)]">
        <aside
          aria-label="Restaurant map"
          className="relative hidden overflow-hidden rounded-tailor-lg border border-tailor-border lg:block lg:h-full lg:min-h-0"
        >
          <RestaurantMap selectedRestaurant={selectedRestaurant} />
        </aside>

        <section
          aria-labelledby="restaurants-heading"
          className="min-w-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col"
        >
          <header className="mb-8 flex items-start justify-between gap-4 lg:flex-none">
            <Image
              alt="Tailor"
              className="h-auto w-28"
              height={48}
              priority
              src="/Logo.png"
              width={112}
            />
            <UserMenuDropdown />
          </header>

          <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
            {isLoading ? (
              <LoadingState message="Loading restaurants...">
                {[0, 1, 2].map((item) => (
                  <div
                    aria-hidden="true"
                    className="h-48 animate-pulse rounded-tailor-md bg-tailor-surface"
                    key={item}
                  />
                ))}
              </LoadingState>
            ) : null}

            {error ? (
              <ErrorState
                message="Restaurants could not be loaded."
                title="Something went wrong."
              />
            ) : null}

            {!isLoading && !error && !restaurants?.length ? (
              <EmptyState title="No restaurants found." />
            ) : null}

            {!isLoading && !error && restaurants?.length ? (
              <RestaurantList
                onRestaurantSelect={setSelectedRestaurant}
                restaurants={restaurants}
                selectedRestaurantId={selectedRestaurant?.id ?? null}
              />
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
