import { apiClient } from "@/shared/lib/api-client";

import type { LoginRequest } from "../types";

export async function loginUser(input: LoginRequest): Promise<void> {
  await apiClient<unknown>("/auth/login", {
    method: "POST",
    body: input,
  });
}
