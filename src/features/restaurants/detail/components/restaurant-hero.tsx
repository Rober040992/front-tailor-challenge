"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { RestaurantDetail } from "../../shared/types";

const FALLBACK_IMAGE = "/restaurant-detail.png";

type RestaurantHeroProps = {
  restaurant: RestaurantDetail;
};

export function RestaurantHero({ restaurant }: RestaurantHeroProps) {
  const [imageSource, setImageSource] = useState(
    restaurant.image?.trim() || FALLBACK_IMAGE,
  );

  return (
    <header className="relative isolate min-h-128 overflow-hidden bg-tailor-surface sm:min-h-152">
      <Image
        alt={restaurant.name}
        className="object-cover"
        fill
        onError={() => setImageSource(FALLBACK_IMAGE)}
        priority
        sizes="100vw"
        src={imageSource}
        unoptimized
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-linear-to-t from-tailor-black via-transparent to-black/25" />

      <div className="relative z-10 flex min-h-128 items-center justify-center px-5 py-20 text-center sm:min-h-152">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-tailor-white sm:text-6xl lg:text-7xl">
            {restaurant.name}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-white/85 sm:text-xl">
            {restaurant.address}
          </p>
          <Link
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-tailor-white px-8 py-3 font-bold text-tailor-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            href={`/restaurants/${restaurant.id}/availability`}
          >
            Check availability
          </Link>
        </div>
      </div>
    </header>
  );
}
