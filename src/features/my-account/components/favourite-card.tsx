"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { MyAccountFavouriteItem } from "../types";

const FALLBACK_IMAGE = "/restaurant-miniature.png";

type FavouriteCardProps = Readonly<{
  favourite: MyAccountFavouriteItem;
  isDeletePending: boolean;
  isDeletingThisFavourite: boolean;
  onRemove: (restaurantId: number) => void;
}>;

export function FavouriteCard({
  favourite,
  isDeletePending,
  isDeletingThisFavourite,
  onRemove,
}: FavouriteCardProps) {
  const { restaurant } = favourite;
  const [imageSource, setImageSource] = useState(
    restaurant.image?.trim() || FALLBACK_IMAGE,
  );

  return (
    <article className="grid overflow-hidden rounded-tailor-md border border-tailor-border bg-tailor-surface transition hover:border-tailor-blue sm:grid-cols-[9rem_1fr]">
      <Link
        aria-label={`Open ${restaurant.name}`}
        className="relative block h-44 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue sm:h-full sm:min-h-40"
        href={`/restaurants/${restaurant.id}`}
      >
        <Image
          alt={restaurant.name}
          className="object-cover"
          fill
          onError={() => setImageSource(FALLBACK_IMAGE)}
          sizes="(min-width: 640px) 9rem, 100vw"
          src={imageSource}
          unoptimized
        />
      </Link>

      <div className="flex min-w-0 flex-col gap-4 p-5">
        <div>
          <Link
            className="text-xl font-bold text-tailor-white transition hover:text-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue"
            href={`/restaurants/${restaurant.id}`}
          >
            {restaurant.name}
          </Link>
          <p className="mt-2 text-sm leading-6 text-tailor-muted">
            {restaurant.address}
          </p>
        </div>

        <button
          className="mt-auto inline-flex min-h-11 items-center justify-center rounded-full border border-tailor-error px-5 py-2 text-sm font-bold text-tailor-error transition hover:bg-tailor-error hover:text-tailor-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-error disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
          disabled={isDeletePending}
          onClick={() => onRemove(favourite.restaurantId)}
          type="button"
        >
          {isDeletingThisFavourite ? "Removing..." : "Remove"}
        </button>
      </div>
    </article>
  );
}
