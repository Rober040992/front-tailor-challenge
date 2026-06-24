"use client";

import { type FormEvent, useState } from "react";

import {
  type RestaurantFormErrors,
  validateRestaurantForm,
} from "../../shared/lib/validate-restaurant-form";
import type { RestaurantDetail } from "../../shared/types";
import { useUpdateRestaurantRequest } from "./use-update-restaurant-request";

type UpdateStatus = "idle" | "success" | "error";

export function useUpdateRestaurantForm(restaurant: RestaurantDetail) {
  const {
    errorMessage,
    isPending,
    updateRestaurantRequest,
  } = useUpdateRestaurantRequest(restaurant.id);
  const [address, setAddress] = useState(restaurant.address);
  const [description, setDescription] = useState(restaurant.description);
  const [errors, setErrors] = useState<RestaurantFormErrors>({});
  const [name, setName] = useState(restaurant.name);
  const [status, setStatus] = useState<UpdateStatus>("idle");

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

    setStatus("idle");

    try {
      await updateRestaurantRequest({
        name: name.trim(),
        address: address.trim(),
        description: description.trim(),
      });
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
    handleSubmit,
    isPending,
    name,
    requestError: errorMessage,
    restaurantUrl: `/restaurants/${restaurant.id}`,
    setAddress,
    setDescription,
    setName,
    status,
  };
}
