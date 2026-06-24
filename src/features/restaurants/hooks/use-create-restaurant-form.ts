"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { createRestaurant } from "../api/create-restaurant";

type CreateRestaurantErrors = {
  address?: string;
  description?: string;
  imageFile?: string;
  name?: string;
};

type CreationStatus = "idle" | "success" | "error";

function validateRequiredFields(
  name: string,
  address: string,
  description: string,
): CreateRestaurantErrors {
  const errors: CreateRestaurantErrors = {};

  if (!name.trim()) {
    errors.name = "Restaurant name is required.";
  }

  if (!address.trim()) {
    errors.address = "Restaurant address is required.";
  }

  if (!description.trim()) {
    errors.description = "Restaurant description is required.";
  }

  return errors;
}

function isValidRestaurantId(id: unknown): id is number | string {
  if (typeof id === "number") {
    return Number.isInteger(id) && id > 0;
  }

  if (typeof id === "string") {
    return id.trim().length > 0;
  }

  return false;
}

export function useCreateRestaurantForm() {
  const [address, setAddress] = useState("");
  const [createdRestaurantId, setCreatedRestaurantId] = useState<
    number | string | null
  >(null);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<CreateRestaurantErrors>({});
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<CreationStatus>("idle");

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const restaurantUrl = useMemo(() => {
    if (!createdRestaurantId) {
      return null;
    }

    return `/restaurants/${createdRestaurantId}`;
  }, [createdRestaurantId]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(event.target.files ?? []);

    setErrors((currentErrors) => ({
      ...currentErrors,
      imageFile: undefined,
    }));

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      setErrors((currentErrors) => ({
        ...currentErrors,
        imageFile: "Select a valid image file.",
      }));
      return;
    }

    let nextPreviewUrl: string;

    try {
      nextPreviewUrl = URL.createObjectURL(file);
    } catch {
      event.target.value = "";
      setImagePreviewUrl((currentPreviewUrl) => {
        if (currentPreviewUrl) {
          URL.revokeObjectURL(currentPreviewUrl);
        }

        return null;
      });
      return;
    }

    setImagePreviewUrl((currentPreviewUrl) => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }

      return nextPreviewUrl;
    });
  };

  const handleImagePreviewError = () => {
    setImagePreviewUrl((currentPreviewUrl) => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }

      return null;
    });
  };

  const closeErrorPopup = () => {
    setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const nextErrors = validateRequiredFields(name, address, description);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsPending(true);
    setCreatedRestaurantId(null);
    setStatus("idle");

    try {
      const restaurant = await createRestaurant({
        name: name.trim(),
        address: address.trim(),
        description: description.trim(),
      });

      if (!isValidRestaurantId(restaurant.id)) {
        setStatus("error");
        return;
      }

      setCreatedRestaurantId(restaurant.id);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsPending(false);
    }
  };

  return {
    address,
    closeErrorPopup,
    description,
    errors,
    handleImageChange,
    handleImagePreviewError,
    handleSubmit,
    imagePreviewUrl,
    isPending,
    name,
    restaurantUrl,
    setAddress,
    setDescription,
    setName,
    status,
  };
}
