"use client";

import { type FormEvent, useState } from "react";

import { updateRestaurant } from "../api/update-restaurant";
import { getRestaurantMutationErrorMessage } from "../lib/get-restaurant-mutation-error-message";
import type { RestaurantDetail } from "../types";

type UpdateRestaurantErrors = {
  address?: string;
  description?: string;
  name?: string;
};

type UpdateStatus = "idle" | "success" | "error";

function validateUpdateFields(
  name: string,
  address: string,
  description: string,
): UpdateRestaurantErrors {
  const errors: UpdateRestaurantErrors = {};

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

export function useUpdateRestaurantForm(restaurant: RestaurantDetail) {
  const [address, setAddress] = useState(restaurant.address);
  const [description, setDescription] = useState(restaurant.description);
  const [errors, setErrors] = useState<UpdateRestaurantErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState(restaurant.name);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [status, setStatus] = useState<UpdateStatus>("idle");

  const closeErrorPopup = () => {
    setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const nextErrors = validateUpdateFields(name, address, description);
    setErrors(nextErrors);
    setRequestError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsPending(true);
    setStatus("idle");

    try {
      await updateRestaurant(restaurant.id, {
        name: name.trim(),
        address: address.trim(),
        description: description.trim(),
      });
      setStatus("success");
    } catch (error) {
      setRequestError(getRestaurantMutationErrorMessage(error));
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
    handleSubmit,
    isPending,
    name,
    requestError,
    restaurantUrl: `/restaurants/${restaurant.id}`,
    setAddress,
    setDescription,
    setName,
    status,
  };
}
