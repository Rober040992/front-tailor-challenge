## Spec: Create Restaurant Comment

**Goal:**

Allow authenticated users to create a comment from the restaurant detail page.

The form is shown next to the restaurant rating summary so the updated rating and comment count can refresh after a successful submission.

**Endpoint(s):**

Frontend route affected:

```txt
GET /restaurants/:restaurantId
```

Backend endpoint consumed:

```txt
POST /restaurants/:restaurantId/comments
```

**Input:**

Route param:

- `restaurantId`: number

Request body:

```json
{
  "rating": 5,
  "body": "TEST AIDA comment just excellent food"
}
```

Required fields:

- `rating`: integer from 1 to 5
- `body`: non-empty string

**Output:**

Any successful `2xx` response means the comment was created.

The frontend must not require extra response fields for this version.

**UI behavior:**

- The create comment form appears on the right side of the restaurant detail page, next to `averageRating` and `commentsCount`.
- Unauthenticated users do not see the create comment form.
- The rating selector appears at the top of the create comment container.
- The rating selector displays exactly five stars.
- The stars reuse the same visual style as the existing restaurant rating stars.
- In this form, the stars are interactive.
- Clicking a star selects an integer rating from 1 to 5.
- The selected rating is visually clear.
- The comment body field appears below the rating selector.
- The comment body field placeholder is `write a comment here`.
- The submit button text is `Send`.
- The submit action sends the selected `rating` and written `body`.
- While submitting, the submit action is disabled.
- On success, show the green mini message `comment sent!`.
- On success, refresh the comments list.
- On success, refresh the restaurant detail data so `averageRating` and `commentsCount` update.

**Auth behavior:**

- Comment creation requires authentication.
- Use the existing auth provider state.
- If auth state is loading, do not show the create comment form yet.
- If the user is unauthenticated, do not show the create comment form.

**Validation:**

- The frontend must not submit if no rating has been selected.
- The frontend must not submit if `body` is empty or whitespace-only.
- `rating` must be sent as a number.
- `rating` must be an integer from 1 to 5.
- The selected star value is the rating sent to the backend.

**Loading, error and success states:**

- Disable submit while `POST /restaurants/:restaurantId/comments` is pending.
- Show a clear validation error when rating is missing.
- Show a clear validation error when body is empty.
- Show backend `400` responses as validation errors.
- If `POST /restaurants/:restaurantId/comments` returns `401`, hide the form state if needed and show a clear authentication error.
- Show a clear generic comment creation error for unexpected failures.
- Do not treat failed comment creation as successful.

**Edge cases:**

- Auth state is loading.
- User is unauthenticated.
- User submits without selecting a rating.
- User submits with an empty or whitespace-only body.
- `POST /restaurants/:restaurantId/comments` returns `400`.
- `POST /restaurants/:restaurantId/comments` returns `401`.
- `POST /restaurants/:restaurantId/comments` fails unexpectedly.
- Duplicate clicks on submit must not create duplicate submissions.
- Restaurant detail refresh fails after the comment was created.
- Comments list refresh fails after the comment was created.

**Test/manual check plan:**

- Unauthenticated users do not see the create comment form.
- Authenticated users see the create comment form next to `averageRating` and `commentsCount`.
- Rating selector renders five stars.
- Clicking each star selects ratings 1 through 5.
- Selected rating is visually clear.
- Submit sends `rating` and `body` to `POST /restaurants/:restaurantId/comments`.
- Submit is blocked when no rating is selected.
- Submit is blocked when body is empty or whitespace-only.
- Submit is disabled while the request is pending.
- Success response shows `comment sent!`.
- Success response refreshes the comments list.
- Success response refreshes restaurant detail data.
- Backend `400` response shows a validation error.
- Unexpected failures show a clear error.
- `npm run lint` passes.
- `npm run build` passes.

**Affected screens/components/hooks/API files:**

- Restaurant detail page at `/restaurants/:restaurantId`
- `src/features/restaurants/detail/components/restaurant-detail-page.tsx`
- Comments components under `src/features/comments/components/`
- Comments hooks under `src/features/comments/hooks/`
- Comments API functions under `src/features/comments/api/`
- Comments types in `src/features/comments/types.ts`
