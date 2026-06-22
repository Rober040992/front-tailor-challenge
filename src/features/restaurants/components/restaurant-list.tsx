"use client";

import { useRestaurants } from "../hooks/use-restaurants";
import { RestaurantCard } from "./restaurant-card";

function LoadingState() {
  return (
    <div aria-live="polite" className="space-y-4">
      <p className="text-sm text-tailor-muted">Loading restaurants...</p>
      {[0, 1, 2].map((item) => (
        <div
          aria-hidden="true"
          className="h-48 animate-pulse rounded-tailor-md bg-tailor-surface"
          key={item}
        />
      ))}
    </div>
  );
}

function ErrorState() {
  return (
    <div
      className="rounded-tailor-md border border-tailor-blue bg-tailor-surface p-6"
      role="alert"
    >
      <h2 className="text-lg font-bold">Something went wrong.</h2>
      <p className="mt-2 text-sm text-tailor-muted">
        Restaurants could not be loaded.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-tailor-md bg-tailor-surface p-8 text-center">
      <h2 className="text-lg font-bold">No restaurants found.</h2>
    </div>
  );
}

export function RestaurantList() {
  const { data: restaurants, error, isLoading } = useRestaurants();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (!restaurants?.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
