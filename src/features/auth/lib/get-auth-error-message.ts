const FALLBACK_ERROR_MESSAGE = "Something went wrong. Please try again.";

export function getAuthErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    const message = error.message.trim();

    if (message) {
      return message;
    }
  }

  return FALLBACK_ERROR_MESSAGE;
}
