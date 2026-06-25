"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { useState } from "react";

import { StarRating } from "../../shared/components/star-rating";
import type { RestaurantListItem } from "../../shared/types";

const FALLBACK_IMAGE = "/restaurant-miniature.png";

type RestaurantCardProps = {
  isSelected: boolean;
  onSelect: (restaurant: RestaurantListItem) => void;
  restaurant: RestaurantListItem;
};

export function RestaurantCard({
  isSelected,
  onSelect,
  restaurant,
}: RestaurantCardProps) {
  const [imageSource, setImageSource] = useState(
    restaurant.image?.trim() || FALLBACK_IMAGE,
  );

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (isSelected) {
      return;
    }

    event.preventDefault();
    onSelect(restaurant);
  }

  return (
    <article data-restaurant-item-id={restaurant.id}>
      <Link
        aria-label={
          isSelected
            ? `Open ${restaurant.name}`
            : `Select ${restaurant.name} on the map`
        }
        className={`group grid overflow-hidden rounded-tailor-md border bg-tailor-surface transition hover:border-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue sm:grid-cols-[11rem_1fr] ${
          isSelected ? "border-tailor-blue" : "border-tailor-border"
        }`}
        href={`/restaurants/${restaurant.id}`}
        onClick={handleClick}
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
            <StarRating averageRating={restaurant.averageRating} size="sm" />
            <span className="text-tailor-muted">
              {restaurant.commentsCount} comments
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
