import { apiClient, type ApiError } from "@/shared/lib/api-client";

import type { CurrentUser } from "../types";

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  );
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await apiClient<CurrentUser>("/auth/me");
  } catch (error) {
    if (isApiError(error) && error.statusCode === 401) {
      return null;
    }

    throw error;
  }
}
