import { apiClient } from "@/shared/lib/api-client";

import type { UpdateRestaurantCommentRequest } from "../types";

export async function updateRestaurantComment(
  commentId: number,
  input: UpdateRestaurantCommentRequest,
): Promise<void> {
  await apiClient<unknown>(`/comments/${commentId}`, {
    method: "PATCH",
    body: input,
  });
}
