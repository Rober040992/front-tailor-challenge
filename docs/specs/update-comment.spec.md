## Spec: Update Restaurant Comment

**Goal:**

Allow authenticated users to update their own comments inline from the restaurant detail comments list.

**Endpoint(s):**

Frontend route affected:

```txt
GET /restaurants/:restaurantId
```

Backend endpoints consumed:

```txt
GET /restaurants/:restaurantId/comments
PATCH /comments/:commentId
```

**Input:**

Route param:

- `restaurantId`: number

Patch route param:

- `commentId`: number

Request body:

```json
{
  "rating": 5,
  "body": "Updated comment."
}
```

Required fields:

- `rating`: integer from 1 to 5
- `body`: non-empty string

**Output:**

Any successful `2xx` response from `PATCH /comments/:commentId` means the comment was updated.

The frontend must not require extra response fields for this version.

**UI behavior:**

- The update action appears on comments in the restaurant detail comments list.
- The update action text is `Update`.
- The update action is visible only for authenticated users.
- The update action is visible only when `comment.userId` matches the authenticated user's `id`.
- The update action is not shown for comments owned by other users.
- Only one comment can be in edit mode at a time.
- Clicking `Update` replaces that comment's displayed rating and body with an inline edit form.
- The inline edit form is prefilled with the current comment `rating` and `body`.
- The inline edit form uses the same interactive 1 to 5 star rating selector as create comment.
- The inline edit form actions are `Save` and `Cancel`.
- `Cancel` exits edit mode without calling the backend.
- While saving, `Save`, `Cancel`, `Delete` and other update actions are disabled if needed.
- On success, show an inline green success message.
- On success, refresh the comments list.
- On success, refresh the restaurant detail data so `averageRating` and `commentsCount` update.

**Auth and ownership behavior:**

- Comment update requires authentication.
- Use the existing auth provider state.
- If auth state is loading, do not show update actions yet.
- If the user is unauthenticated, do not show update actions.
- The frontend may use `comment.userId` and the authenticated user's `id` only to hide update actions that should not be offered.
- The backend remains the source of truth for ownership and must validate the final update request.

**Validation:**

- The frontend must not call `PATCH /comments/:commentId` if `commentId` is not a positive integer.
- The frontend must not call `PATCH /comments/:commentId` for a comment whose `userId` does not match the authenticated user's `id`.
- The frontend must not submit if no rating has been selected.
- The frontend must not submit if `body` is empty or whitespace-only.
- `rating` must be sent as a number.
- `rating` must be an integer from 1 to 5.
- The selected star value is the rating sent to the backend.

**Loading, error and success states:**

- Disable the selected comment save action while `PATCH /comments/:commentId` is pending.
- Prevent duplicate update submissions for the same comment while the request is pending.
- Show a clear validation error when rating is missing.
- Show a clear validation error when body is empty.
- Show backend `400` responses as validation errors.
- Show a clear authentication error if `PATCH /comments/:commentId` returns `401`.
- Show a clear permissions error if `PATCH /comments/:commentId` returns `403`.
- Show a clear not-found error if `PATCH /comments/:commentId` returns `404`.
- Show a clear generic update error for unexpected failures.
- Do not treat failed comment update as successful.

**Edge cases:**

- Auth state is loading.
- User is unauthenticated.
- Comment belongs to the authenticated user.
- Comment belongs to another user.
- `commentId` is invalid.
- User submits without selecting a rating.
- User submits with an empty or whitespace-only body.
- `PATCH /comments/:commentId` returns `400`.
- `PATCH /comments/:commentId` returns `401`.
- `PATCH /comments/:commentId` returns `403`.
- `PATCH /comments/:commentId` returns `404`.
- `PATCH /comments/:commentId` fails unexpectedly.
- Duplicate clicks on `Save` must not create duplicate submissions.
- Restaurant detail refresh fails after the comment was updated.
- Comments list refresh fails after the comment was updated.

**Test/manual check plan:**

- Unauthenticated users do not see update actions.
- Authenticated users see `Update` only on comments where `comment.userId` matches their `id`.
- Authenticated users do not see `Update` on comments owned by other users.
- Clicking `Update` opens inline edit mode for that comment only.
- Form is prefilled with existing rating and body.
- Star selector selects ratings 1 through 5.
- `Cancel` exits edit mode without calling `PATCH /comments/:commentId`.
- `Save` sends `rating` and trimmed `body` to `PATCH /comments/:commentId`.
- Submit is blocked when no rating is selected.
- Submit is blocked when body is empty or whitespace-only.
- `Save` is disabled while the request is pending.
- Success response shows a green inline message.
- Success response refreshes the comments list.
- Success response refreshes restaurant detail data.
- `400` response shows a validation error.
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
