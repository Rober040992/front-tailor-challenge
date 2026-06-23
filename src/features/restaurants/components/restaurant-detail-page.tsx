"use client";

import Image from "next/image";
import Link from "next/link";

import { CommentList } from "@/features/comments/components/comment-list";
import { UserMenuDropdown } from "@/features/auth/components/user-menu-dropdown";
import {
  ErrorState,
  LoadingState,
} from "@/shared/components/states";
import type { ApiError } from "@/shared/lib/api-client";

import { useRestaurant } from "../hooks/use-restaurant";
import { RestaurantHero } from "./restaurant-hero";
import { StarRating } from "./star-rating";

type RestaurantDetailPageProps = {
  restaurantId: number;
};

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    (error as ApiError).statusCode === 404
  );
}

export function RestaurantDetailPage({
  restaurantId,
}: RestaurantDetailPageProps) {
  const { data: restaurant, error, isLoading } = useRestaurant(restaurantId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-tailor-black text-tailor-white">
        <LoadingState message="Loading restaurant...">
          <div
            aria-hidden="true"
            className="h-128 animate-pulse bg-tailor-surface sm:h-152"
          />
        </LoadingState>
      </main>
    );
  }

  if (error) {
    const notFound = isNotFoundError(error);

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

  const hasAverageRating =
    typeof restaurant.averageRating === "number" &&
    Number.isFinite(restaurant.averageRating);
  const hasCommentsCount =
    typeof restaurant.commentsCount === "number" &&
    Number.isFinite(restaurant.commentsCount);

  return (
    <main className="min-h-screen bg-tailor-black text-tailor-white">
      <div className="absolute left-4 top-4 z-20 sm:left-8 sm:top-8">
        <Link
          aria-label="Back to restaurants"
          className="inline-flex rounded-full bg-black/70 p-3 backdrop-blur-sm transition hover:bg-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue"
          href="/restaurants"
        >
          <Image alt="Tailor" height={32} src="/Logo.png" width={76} />
        </Link>
      </div>
      <div className="absolute right-4 top-4 z-20 sm:right-8 sm:top-8">
        <UserMenuDropdown />
      </div>

      <RestaurantHero restaurant={restaurant} />

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <section
          aria-labelledby="about-heading"
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-tailor-blue">
              About
            </p>
            <h2
              className="mt-3 text-2xl font-bold sm:text-3xl"
              id="about-heading"
            >
              Restaurant details
            </h2>
            <p className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-8 text-tailor-muted sm:text-lg">
              {restaurant.description}
            </p>
          </div>

          {(hasAverageRating || hasCommentsCount) && (
            <dl className="flex flex-wrap gap-x-8 gap-y-5 border-l border-tailor-border pl-6 lg:min-w-60 lg:flex-col">
              {hasAverageRating && (
                <div>
                  <dt className="mb-2 text-xs font-bold uppercase tracking-widest text-tailor-muted">
                    Average rating
                  </dt>
                  <dd>
                    <StarRating
                      averageRating={restaurant.averageRating}
                    />
                  </dd>
                </div>
              )}
              {hasCommentsCount && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-widest text-tailor-muted">
                    Comments
                  </dt>
                  <dd className="mt-1 text-2xl font-bold">
                    {restaurant.commentsCount}
                  </dd>
                </div>
              )}
            </dl>
          )}
        </section>

        <section aria-labelledby="comments-heading" className="pt-14 sm:pt-20">
          <div className="mb-10">
            <h2
              className="text-3xl font-bold sm:text-4xl"
              id="comments-heading"
            >
              Comments
            </h2>
          </div>

          <CommentList restaurantId={restaurantId} />
        </section>
      </div>
    </main>
  );
}
