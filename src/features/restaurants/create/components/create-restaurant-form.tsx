"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { LoadingState } from "@/shared/components/states";

import { RestaurantResultPopup } from "../../shared/components/restaurant-result-popup";
import { useCreateRestaurantForm } from "../hooks/use-create-restaurant-form";

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

export function CreateRestaurantForm() {
  const router = useRouter();
  const { isLoading, user } = useAuth();
  const {
    address,
    closeErrorPopup,
    description,
    errors,
    handleImagePreviewError,
    handleSubmit,
    image,
    imagePreviewUrl,
    isPending,
    name,
    restaurantUrl,
    setAddress,
    setDescription,
    setImageUrl,
    setName,
    status,
  } = useCreateRestaurantForm();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-5 py-16">
        <LoadingState message="Checking your session..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-5 py-16 text-center">
        <p className="text-2xl font-bold">Sign in to create a restaurant.</p>
        <button
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-tailor-white px-8 py-3 font-bold text-tailor-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          onClick={() => router.push("/login")}
          type="button"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <>
      <form
        className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-8 md:grid-cols-[minmax(0,1fr)_minmax(21rem,0.85fr)] md:items-start md:px-8 lg:gap-16"
        noValidate
        onSubmit={handleSubmit}
      >
        <div>
          <div
            className="relative flex min-h-88 items-center justify-center overflow-hidden rounded-tailor-lg bg-tailor-white text-tailor-black sm:min-h-112"
            aria-label="Restaurant image preview"
          >
            {imagePreviewUrl ? (
              <Image
                alt="Restaurant image preview"
                className="object-cover"
                fill
                onError={handleImagePreviewError}
                sizes="(min-width: 768px) 50vw, 90vw"
                src={imagePreviewUrl}
                unoptimized
              />
            ) : (
              <span className="text-xl font-bold">Image will show here</span>
            )}
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

          <div>
            <label
              className="mb-3 block text-base font-bold"
              htmlFor="image"
            >
              Restaurant image URL
            </label>
            <input
              aria-describedby={errors.image ? "image-error" : undefined}
              aria-invalid={Boolean(errors.image)}
              autoComplete="url"
              className="min-h-12 w-full rounded-full border border-tailor-blue bg-tailor-blue px-5 py-3 text-tailor-white outline-none transition placeholder:text-white/65 hover:border-white focus:border-white focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              id="image"
              name="image"
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/image.jpg"
              type="url"
              value={image}
            />
            <FieldError id="image-error" message={errors.image} />
          </div>

          <button
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-tailor-white px-8 py-3 font-bold text-tailor-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {status === "success" && restaurantUrl ? (
        <RestaurantResultPopup
          buttonLabel="View restaurant"
          href={restaurantUrl}
          message="Restaurant saved"
        />
      ) : null}

      {status === "error" ? (
        <RestaurantResultPopup
          buttonLabel="Back"
          message="Something went wrong"
          onClick={closeErrorPopup}
        />
      ) : null}
    </>
  );
}
