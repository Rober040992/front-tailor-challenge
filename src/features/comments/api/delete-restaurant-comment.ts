import { apiClient } from "@/shared/lib/api-client";

export async function deleteRestaurantComment(
  commentId: number,
): Promise<void> {
  await apiClient<unknown>(`/comments/${commentId}`, {
    method: "DELETE",
  });
}
