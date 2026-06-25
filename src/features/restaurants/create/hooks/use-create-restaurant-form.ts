"use client";

import { type FormEvent, useMemo, useState } from "react";

import {
  type RestaurantFormErrors,
  validateRestaurantForm,
} from "../../shared/lib/validate-restaurant-form";
import { useCreateRestaurantRequest } from "./use-create-restaurant-request";

type CreateRestaurantErrors = RestaurantFormErrors & {
  image?: string;
};

type CreationStatus = "idle" | "success" | "error";

function isValidRestaurantId(id: unknown): id is number | string {
  if (typeof id === "number") {
    return Number.isInteger(id) && id > 0;
  }

  if (typeof id === "string") {
    return id.trim().length > 0;
  }

  return false;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function useCreateRestaurantForm() {
  const {
    createRestaurantRequest,
    isPending,
  } = useCreateRestaurantRequest();
  const [address, setAddress] = useState("");
  const [createdRestaurantId, setCreatedRestaurantId] = useState<
    number | string | null
  >(null);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<CreateRestaurantErrors>({});
  const [image, setImage] = useState("");
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<CreationStatus>("idle");

  const restaurantUrl = useMemo(() => {
    if (!createdRestaurantId) {
      return null;
    }

    return `/restaurants/${createdRestaurantId}`;
  }, [createdRestaurantId]);

  const trimmedImage = image.trim();
  const imagePreviewUrl =
    trimmedImage && isValidHttpUrl(trimmedImage) && !imagePreviewFailed
      ? trimmedImage
      : null;

  const setImageUrl = (value: string) => {
    setImage(value);
    setImagePreviewFailed(false);
    setErrors((currentErrors) => ({
      ...currentErrors,
      image: undefined,
    }));
  };

  const handleImagePreviewError = () => {
    setImagePreviewFailed(true);
  };

  const closeErrorPopup = () => {
    setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const nextErrors: CreateRestaurantErrors = validateRestaurantForm(
      name,
      address,
      description,
    );

    if (trimmedImage && !isValidHttpUrl(trimmedImage)) {
      nextErrors.image = "Image must be a valid http or https URL.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setCreatedRestaurantId(null);
    setStatus("idle");

    try {
      const restaurant = await createRestaurantRequest({
        name: name.trim(),
        address: address.trim(),
        description: description.trim(),
        ...(trimmedImage ? { image: trimmedImage } : {}),
      });

      if (!restaurant || !isValidRestaurantId(restaurant.id)) {
        setStatus("error");
        return;
      }

      setCreatedRestaurantId(restaurant.id);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return {
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
  };
}
