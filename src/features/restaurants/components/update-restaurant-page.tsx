"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ErrorState,
  LoadingState,
} from "@/shared/components/states";

import { useRestaurant } from "../hooks/use-restaurant";
import { isRestaurantNotFoundError } from "../lib/get-restaurant-mutation-error-message";
import { UpdateRestaurantForm } from "./update-restaurant-form";

type UpdateRestaurantPageProps = {
  restaurantId: number;
};

export function UpdateRestaurantPage({
  restaurantId,
}: UpdateRestaurantPageProps) {
  const { data: restaurant, error, isLoading } = useRestaurant(restaurantId);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-tailor-black text-tailor-white">
        <header className="flex justify-center px-5 py-6">
          <Image
            alt="Tailor"
            className="h-auto w-28"
            height={48}
            priority
            src="/Logo.png"
            width={112}
          />
        </header>
        <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-16">
          <LoadingState message="Loading restaurant..." />
        </div>
      </main>
    );
  }

  if (error) {
    const notFound = isRestaurantNotFoundError(error);

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

  if (restaurant.canEdit !== true) {
    return (
      <main className="min-h-screen bg-tailor-black px-4 py-20 text-tailor-white sm:px-6">
        <div className="mx-auto max-w-3xl">
          <ErrorState
            message="You cannot edit this restaurant."
            title="Forbidden."
          />
          <Link
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-tailor-white px-8 py-3 font-bold text-tailor-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            href={`/restaurants/${restaurant.id}`}
          >
            Back to restaurant
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-tailor-black text-tailor-white">
      <header className="flex justify-center px-5 py-6">
        <Image
          alt="Tailor"
          className="h-auto w-28"
          height={48}
          priority
          src="/Logo.png"
          width={112}
        />
      </header>

      <section
        aria-label="Update restaurant"
        className="flex flex-1 items-center"
      >
        <UpdateRestaurantForm restaurant={restaurant} />
      </section>

      <footer className="flex justify-center px-5 py-6">
        <Image
          alt="Tailor"
          className="h-auto w-28"
          height={48}
          src="/Logo.png"
          width={112}
        />
      </footer>
    </main>
  );
}
