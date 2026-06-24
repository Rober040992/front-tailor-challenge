"use client";

import Link from "next/link";

import { RestaurantResultPopup } from "../../shared/components/restaurant-result-popup";
import type { RestaurantDetail } from "../../shared/types";
import { useUpdateRestaurantForm } from "../hooks/use-update-restaurant-form";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 text-sm font-bold text-tailor-error" id={id}>
      {message}
    </p>
  );
}

type UpdateRestaurantFormProps = {
  restaurant: RestaurantDetail;
};

export function UpdateRestaurantForm({
  restaurant,
}: UpdateRestaurantFormProps) {
  const {
    address,
    closeErrorPopup,
    description,
    errors,
    handleSubmit,
    isPending,
    name,
    requestError,
    restaurantUrl,
    setAddress,
    setDescription,
    setName,
    status,
  } = useUpdateRestaurantForm(restaurant);

  return (
    <>
      <form
        className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-8 md:grid-cols-[minmax(0,1fr)_minmax(21rem,0.85fr)] md:items-start md:px-8 lg:gap-16"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="relative flex min-h-88 items-center justify-center overflow-hidden rounded-tailor-lg bg-tailor-white px-8 text-center text-tailor-black sm:min-h-112">
          <div>
            <p className="text-xl font-bold">Edit restaurant</p>
            <p className="mt-3 text-sm font-medium text-black/60">
              Image editing is not available in this version.
            </p>
          </div>
        </div>

        <div className="space-y-7">
          <div>
            <label
              className="mb-3 block text-base font-bold"
              htmlFor="name"
            >
              Restaurant name:
            </label>
            <input
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={Boolean(errors.name)}
              autoComplete="organization"
              className="min-h-12 w-full rounded-full border border-tailor-blue bg-tailor-blue px-5 py-3 text-tailor-white outline-none transition placeholder:text-white/65 hover:border-white focus:border-white focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              id="name"
              name="name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Restaurant name"
              type="text"
              value={name}
            />
            <FieldError id="name-error" message={errors.name} />
          </div>

          <div>
            <label
              className="mb-3 block text-base font-bold"
              htmlFor="address"
            >
              Restaurant address
            </label>
            <input
              aria-describedby={errors.address ? "address-error" : undefined}
              aria-invalid={Boolean(errors.address)}
              autoComplete="street-address"
              className="min-h-12 w-full rounded-full border border-tailor-blue bg-tailor-blue px-5 py-3 text-tailor-white outline-none transition placeholder:text-white/65 hover:border-white focus:border-white focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              id="address"
              name="address"
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Address"
              type="text"
              value={address}
            />
            <FieldError id="address-error" message={errors.address} />
          </div>

          <div>
            <label
              className="mb-3 block text-base font-bold"
              htmlFor="description"
            >
              Restaurant description
            </label>
            <textarea
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              aria-invalid={Boolean(errors.description)}
              className="min-h-40 w-full resize-y rounded-tailor-md border border-tailor-blue bg-tailor-blue px-5 py-4 text-tailor-white outline-none transition placeholder:text-white/65 hover:border-white focus:border-white focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              id="description"
              name="description"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write information about the restaurant"
              value={description}
            />
            <FieldError id="description-error" message={errors.description} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-tailor-white px-8 py-3 font-bold text-tailor-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              type="submit"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-tailor-border px-8 py-3 font-bold text-tailor-white transition hover:border-tailor-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              href={restaurantUrl}
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>

      {status === "success" ? (
        <RestaurantResultPopup
          buttonLabel="View restaurant"
          href={restaurantUrl}
          message="Restaurant saved"
        />
      ) : null}

      {status === "error" ? (
        <RestaurantResultPopup
          buttonLabel="Back"
          message={requestError ?? "Something went wrong."}
          onClick={closeErrorPopup}
        />
      ) : null}
    </>
  );
}
