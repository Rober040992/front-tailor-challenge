"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import type { RestaurantListItem } from "../types";

const FALLBACK_IMAGE = "/restaurant-miniature.png";

type RestaurantCardProps = {
  restaurant: RestaurantListItem;
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [imageSource, setImageSource] = useState(
    restaurant.image?.trim() || FALLBACK_IMAGE,
  );

  return (
    <article>
      <Link
        className="group grid overflow-hidden rounded-tailor-md border border-tailor-border bg-tailor-surface transition hover:border-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue sm:grid-cols-[11rem_1fr]"
        href={`/restaurants/${restaurant.id}`}
      >
        <Image
          alt={restaurant.name}
          className="h-48 w-full object-cover sm:h-full sm:min-h-44"
          height={192}
          onError={() => setImageSource(FALLBACK_IMAGE)}
          src={imageSource}
          unoptimized
          width={352}
        />

        <div className="flex min-w-0 flex-col gap-3 p-5">
          <div>
            <p className="mb-1 text-sm font-medium text-tailor-blue">
              {restaurant.cuisineType}
            </p>
            <h2 className="text-xl font-bold text-tailor-white transition group-hover:text-tailor-blue">
              {restaurant.name}
            </h2>
          </div>

          <p className="text-sm leading-6 text-tailor-muted">
            {restaurant.address}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {restaurant.averageRating !== null && (
              <span
                aria-label={`Average rating: ${restaurant.averageRating}`}
                className="font-bold text-tailor-blue"
              >
                ★ {restaurant.averageRating}
              </span>
            )}
            <span className="text-tailor-muted">
              {restaurant.commentsCount} comments
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
