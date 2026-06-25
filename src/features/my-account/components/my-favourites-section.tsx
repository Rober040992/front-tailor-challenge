"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states";

import { useMyAccountFavourites } from "../hooks/use-my-account-favourites";
import { FavouriteCard } from "./favourite-card";

export function MyFavouritesSection() {
  const {
    deletingRestaurantId,
    error,
    favourites,
    isDeleting,
    isLoading,
    mutationErrorMessage,
    removeFavourite,
  } = useMyAccountFavourites();

  return (
    <section aria-labelledby="my-favourites-heading" className="min-w-0">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-tailor-blue">
          Saved restaurants
        </p>
        <h2 className="mt-2 text-2xl font-bold" id="my-favourites-heading">
          My favourites
        </h2>
      </div>

      {mutationErrorMessage ? (
        <p className="mb-4 text-sm font-bold text-tailor-error" role="alert">
          {mutationErrorMessage}
        </p>
      ) : null}

      {isLoading ? (
        <LoadingState message="Loading favourites...">
          {[0, 1].map((item) => (
            <div
              aria-hidden="true"
              className="h-44 animate-pulse rounded-tailor-md bg-tailor-surface"
              key={item}
            />
          ))}
        </LoadingState>
      ) : null}

      {!isLoading && error ? (
        <ErrorState
          message="Your favourites could not be loaded."
          title="Something went wrong."
        />
      ) : null}

      {!isLoading && !error && !favourites.length ? (
        <EmptyState title="No favourite restaurants yet." />
      ) : null}

      {!isLoading && !error && favourites.length ? (
        <div className="space-y-4">
          {favourites.map((favourite) => (
            <FavouriteCard
              favourite={favourite}
              isDeletePending={isDeleting}
              isDeletingThisFavourite={
                isDeleting &&
                deletingRestaurantId === favourite.restaurantId
              }
              key={favourite.id}
              onRemove={removeFavourite}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
