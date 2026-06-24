## Spec: Delete Restaurant Comment

**Goal:**

Allow authenticated users to delete their own comments from the restaurant detail comments list.

**Endpoint(s):**

Frontend route affected:

```txt
GET /restaurants/:restaurantId
```

Backend endpoints consumed:

```txt
GET /restaurants/:restaurantId/comments
DELETE /comments/:commentId
```

**Input:**

Route param:

- `restaurantId`: number

Comment fields required from `GET /restaurants/:restaurantId/comments`:

```ts
type RestaurantComment = {
  id: number;
  userId: number;
  restaurantId: number;
  name: string;
  date: string;
  rating: number | null;
  body: string;
  createdAt: string;
  updatedAt: string;
};
```

Delete route param:

- `commentId`: number

**Output:**

Any successful `2xx` response from `DELETE /comments/:commentId` means the comment was deleted.

The frontend must not require extra response fields for this version.

**UI behavior:**

- The delete action appears on comments in the restaurant detail comments list.
- The delete action text is `Delete`.
- The delete action is visible only for authenticated users.
- The delete action is visible only when `comment.userId` matches the authenticated user's `id`.
- The delete action is not shown for comments owned by other users.
- No confirmation modal is shown before deletion.
- While deleting, the delete action is disabled.
- On success, remove the deleted comment from the visible list by refreshing the comments list.
- On success, refresh the restaurant detail data so `averageRating` and `commentsCount` update.

**Auth and ownership behavior:**

- Comment deletion requires authentication.
- Use the existing auth provider state.
- If auth state is loading, do not show delete actions yet.
- If the user is unauthenticated, do not show delete actions.
- The frontend may use `comment.userId` and the authenticated user's `id` only to hide delete actions that should not be offered.
- The backend remains the source of truth for ownership and must validate the final delete request.

**Validation:**

- The frontend must not call `DELETE /comments/:commentId` if `commentId` is not a positive integer.
- The frontend must not call `DELETE /comments/:commentId` for a comment whose `userId` does not match the authenticated user's `id`.

**Loading, error and success states:**

- Disable the selected comment delete action while `DELETE /comments/:commentId` is pending.
- Prevent duplicate delete submissions for the same comment while the request is pending.
- Show a clear authentication error if `DELETE /comments/:commentId` returns `401`.
- Show a clear permissions error if `DELETE /comments/:commentId` returns `403`.
- Show a clear not-found error if `DELETE /comments/:commentId` returns `404`.
- Show a clear generic delete error for unexpected failures.
- Do not treat failed comment deletion as successful.

**Edge cases:**

- Auth state is loading.
- User is unauthenticated.
- Comment belongs to the authenticated user.
- Comment belongs to another user.
- `commentId` is invalid.
- `DELETE /comments/:commentId` returns `401`.
- `DELETE /comments/:commentId` returns `403`.
- `DELETE /comments/:commentId` returns `404`.
- `DELETE /comments/:commentId` fails unexpectedly.
- Duplicate clicks on `Delete` must not create duplicate submissions.
- Restaurant detail refresh fails after the comment was deleted.
- Comments list refresh fails after the comment was deleted.

**Test/manual check plan:**

- Unauthenticated users do not see delete actions.
- Authenticated users see `Delete` only on comments where `comment.userId` matches their `id`.
- Authenticated users do not see `Delete` on comments owned by other users.
- Clicking `Delete` calls `DELETE /comments/:commentId`.
- `Delete` is disabled while the request is pending.
- No confirmation modal is shown.
- Success response refreshes the comments list.
- Success response refreshes restaurant detail data.
- `401` response shows an authentication error.
- `403` response shows a permissions error.
- `404` response shows a not-found error.
- Unexpected failures show a clear error.
- `npm run lint` passes.
- `npm run build` passes.

**Affected screens/components/hooks/API files:**

- Restaurant detail page at `/restaurants/:restaurantId`
- Comments list under `src/features/comments/components/`
- Comments hooks under `src/features/comments/hooks/`
- Comments API functions under `src/features/comments/api/`
- Comments types in `src/features/comments/types.ts`
