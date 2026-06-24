"use client";

import { type FormEvent, useState } from "react";
import { useSWRConfig } from "swr";

import type { ApiError } from "@/shared/lib/api-client";

import { useCreateRestaurantCommentRequest } from "./use-create-restaurant-comment-request";

type CommentFormErrors = {
  body?: string;
  form?: string;
  rating?: string;
};

type CommentFormStatus = "idle" | "success" | "error" | "unauthenticated";

type UseCreateRestaurantCommentFormParams = {
  refreshUser: () => Promise<void>;
  restaurantId: number;
};

function hasApiStatus(error: unknown, statusCode: number): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    (error as ApiError).statusCode === statusCode
  );
}

function validateCommentForm(
  rating: number | null,
  body: string,
): CommentFormErrors {
  const errors: CommentFormErrors = {};

  if (rating === null) {
    errors.rating = "Select a rating.";
  }

  if (!body.trim()) {
    errors.body = "Write a comment.";
  }

  return errors;
}

export function useCreateRestaurantCommentForm({
  refreshUser,
  restaurantId,
}: UseCreateRestaurantCommentFormParams) {
  const { mutate } = useSWRConfig();
  const {
    createCommentRequest,
    isPending,
  } = useCreateRestaurantCommentRequest(restaurantId);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<CommentFormErrors>({});
  const [rating, setRating] = useState<number | null>(null);
  const [status, setStatus] = useState<CommentFormStatus>("idle");

  function handleRatingChange(nextRating: number) {
    setRating(nextRating);
    setStatus("idle");
    setErrors((currentErrors) => ({
      ...currentErrors,
      form: undefined,
      rating: undefined,
    }));
  }

  function handleBodyChange(nextBody: string) {
    setBody(nextBody);
    setStatus("idle");
    setErrors((currentErrors) => ({
      ...currentErrors,
      body: undefined,
      form: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const nextErrors = validateCommentForm(rating, body);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || rating === null) {
      setStatus("idle");
      return;
    }

    setStatus("idle");

    try {
      await createCommentRequest({
        rating,
        body: body.trim(),
      });
      setBody("");
      setRating(null);
      setStatus("success");
      await Promise.allSettled([
        mutate(`/restaurants/${restaurantId}/comments`),
        mutate(`/restaurants/${restaurantId}`),
      ]);
    } catch (error) {
      if (hasApiStatus(error, 401)) {
        setStatus("unauthenticated");
        await refreshUser();
        return;
      }

      if (hasApiStatus(error, 400)) {
        setErrors({
          form: "Check the rating and comment.",
        });
        setStatus("idle");
        return;
      }

      setStatus("error");
    }
  }

  return {
    body,
    errors,
    handleBodyChange,
    handleRatingChange,
    handleSubmit,
    isPending,
    rating,
    status,
  };
}
