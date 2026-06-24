"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states";

import { useRestaurants } from "../hooks/use-restaurants";
import { RestaurantCard } from "./restaurant-card";

export function RestaurantList() {
  const { data: restaurants, error, isLoading } = useRestaurants();

  if (isLoading) {
    return (
      <LoadingState message="Loading restaurants...">
        {[0, 1, 2].map((item) => (
          <div
            aria-hidden="true"
            className="h-48 animate-pulse rounded-tailor-md bg-tailor-surface"
            key={item}
          />
        ))}
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        message="Restaurants could not be loaded."
        title="Something went wrong."
      />
    );
  }

  if (!restaurants?.length) {
    return <EmptyState title="No restaurants found." />;
  }

  return (
    <div className="space-y-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
