import type { ApiError } from "@/shared/lib/api-client";

export function hasApiStatus(error: unknown, statusCode: number): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    (error as ApiError).statusCode === statusCode
  );
}

export function isDuplicateFavouriteError(error: unknown): boolean {
  return (
    hasApiStatus(error, 409) &&
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    (error as ApiError).message === "Restaurant is already a favourite."
  );
}
