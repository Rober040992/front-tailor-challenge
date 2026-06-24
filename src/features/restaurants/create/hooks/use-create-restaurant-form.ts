"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  type RestaurantFormErrors,
  validateRestaurantForm,
} from "../../shared/lib/validate-restaurant-form";
import { useCreateRestaurantRequest } from "./use-create-restaurant-request";

type CreateRestaurantErrors = RestaurantFormErrors & {
  imageFile?: string;
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
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
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

    const nextErrors = validateRestaurantForm(name, address, description);
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
