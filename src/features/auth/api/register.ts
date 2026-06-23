import { apiClient } from "@/shared/lib/api-client";

import type { RegisterRequest } from "../types";

export async function registerUser(input: RegisterRequest): Promise<void> {
  await apiClient<unknown>("/auth/register", {
    method: "POST",
    body: input,
  });
}
