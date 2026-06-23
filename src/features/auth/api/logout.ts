import { apiClient } from "@/shared/lib/api-client";

export async function logoutUser(): Promise<void> {
  await apiClient<unknown>("/auth/logout", {
    method: "POST",
  });
}
