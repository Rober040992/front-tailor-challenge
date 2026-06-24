"use client";

import { useState } from "react";
import useSWR from "swr";

import { useAuth } from "@/features/auth/hooks/use-auth";

import { addFavourite } from "../api/add-favourite";
import { getMyFavourites } from "../api/get-my-favourites";
import { removeFavourite } from "../api/remove-favourite";
import {
  hasApiStatus,
  isDuplicateFavouriteError,
} from "../lib/favourite-errors";
import type { FavouriteItem, FavouriteListResponse } from "../types";

type FavouriteStatus =
  | "duplicate"
  | "error"
  | "not-found"
  | "unauthenticated"
  | null;

function addFavouriteToList(
  current: FavouriteListResponse | undefined,
  favourite: FavouriteItem,
): FavouriteListResponse {
  if (!current) {
    return { results: [favourite] };
  }

  const alreadyExists = current.results.some(
    (item) => item.restaurantId === favourite.restaurantId,
  );

  if (alreadyExists) {
    return current;
  }

  return {
    ...current,
    results: [...current.results, favourite],
  };
}

function removeFavouriteFromList(
  current: FavouriteListResponse | undefined,
  restaurantId: number,
): FavouriteListResponse | undefined {
  if (!current) {
    return current;
  }

  return {
    ...current,
    results: current.results.filter(
      (item) => item.restaurantId !== restaurantId,
    ),
  };
}

function getStatusMessage(status: FavouriteStatus): string | null {
  if (status === "duplicate") {
    return "Restaurant is already a favourite.";
  }

  if (status === "not-found") {
    return "Favourite was already removed.";
  }

  if (status === "unauthenticated") {
    return "Sign in again to manage favourites.";
  }

  if (status === "error") {
    return "Favourite could not be updated. Please try again.";
  }

  return null;
}

export function useRestaurantFavouriteToggle(restaurantId: number) {
  const { isLoading: isAuthLoading, refreshUser, user } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [localIsFavourite, setLocalIsFavourite] = useState<boolean | null>(
    null,
  );
  const [status, setStatus] = useState<FavouriteStatus>(null);

  const {
    data,
    error: favouritesError,
    isLoading: isFavouritesLoading,
    mutate,
  } = useSWR<FavouriteListResponse>(
    user ? "/me/favourites" : null,
    getMyFavourites,
  );

  const isSessionExpired =
    status === "unauthenticated" || hasApiStatus(favouritesError, 401);
  const isLoadError = Boolean(favouritesError) && !isSessionExpired;
  const serverIsFavourite = Boolean(
    data?.results.some((item) => item.restaurantId === restaurantId),
  );
  const isFavourite = localIsFavourite ?? serverIsFavourite;
  const isActionVisible =
    !isAuthLoading &&
    Boolean(user) &&
    !isFavouritesLoading &&
    !isSessionExpired &&
    !isLoadError;

  const setUnauthenticatedStatus = async () => {
    setStatus("unauthenticated");
    await refreshUser();
  };

  const handleToggle = async () => {
    if (isPending) {
      return;
    }

    setStatus(null);
    setIsPending(true);

    try {
      if (isFavourite) {
        await removeFavourite(restaurantId);
        setLocalIsFavourite(false);
        await mutate(
          (current) => removeFavouriteFromList(current, restaurantId),
          { revalidate: false },
        );
      } else {
        const favourite = await addFavourite(restaurantId);
        setLocalIsFavourite(true);
        await mutate((current) => addFavouriteToList(current, favourite), {
          revalidate: false,
        });
      }
    } catch (error) {
      if (hasApiStatus(error, 401)) {
        await setUnauthenticatedStatus();
        return;
      }

      if (!isFavourite && isDuplicateFavouriteError(error)) {
        setStatus("duplicate");
        setLocalIsFavourite(true);
        await mutate().catch(() => undefined);
        return;
      }

      if (isFavourite && hasApiStatus(error, 404)) {
        setStatus("not-found");
        setLocalIsFavourite(false);
        await mutate(
          (current) => removeFavouriteFromList(current, restaurantId),
          { revalidate: false },
        );
        return;
      }

      setStatus("error");
    } finally {
      setIsPending(false);
    }
  };

  return {
    errorMessage: isSessionExpired
      ? "Sign in again to manage favourites."
      : isLoadError
        ? "Favourites could not be loaded."
        : getStatusMessage(status),
    handleToggle,
    isActionVisible,
    isFavourite,
    isPending,
  };
}
