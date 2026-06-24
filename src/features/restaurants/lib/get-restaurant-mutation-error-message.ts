import type { ApiError } from "@/shared/lib/api-client";

function hasStatusCode(error: unknown, statusCode: number): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    (error as ApiError).statusCode === statusCode
  );
}

export function getRestaurantMutationErrorMessage(error: unknown): string {
  if (hasStatusCode(error, 403)) {
    return "You cannot edit this restaurant.";
  }

  if (hasStatusCode(error, 404)) {
    return "Restaurant not found.";
  }

  return "Something went wrong.";
}

export function isRestaurantNotFoundError(error: unknown): boolean {
  return hasStatusCode(error, 404);
}
