## Spec: Restaurant Detail Favourite Toggle

**Goal:**

Allow authenticated users to add or remove the current restaurant from their favourites from the restaurant detail page.

The action is shown as a heart icon below `Check availability`.

**Endpoint(s):**

Frontend route affected:

```txt
GET /restaurants/:restaurantId
```

Backend endpoints consumed:

```txt
GET /me/favourites
POST /me/favourites/:restaurantId
DELETE /me/favourites/:restaurantId
```

**Input:**

Route param:

- `restaurantId`: number

Favourite item shape used by this feature:

```ts
type FavouriteItem = {
  id: number;
  restaurantId: number;
  createdAt: string;
};
```

Favourite list response shape used by this feature:

```ts
type FavouriteListResponse = {
  results: FavouriteItem[];
};
```

`GET /me/favourites` result items and `POST /me/favourites/:restaurantId` success responses use the `FavouriteItem` shape.

The backend may include a nested `restaurant` object in favourite responses, but this feature must only depend on `id`, `restaurantId` and `createdAt`.

**Output:**

The restaurant detail page must show a heart icon action below `Check availability` only for authenticated users.

The heart icon must be empty when the current restaurant is not in the authenticated user's favourites.

The heart icon must be filled when the current restaurant is already in the authenticated user's favourites.

Clicking the empty heart must call:

```txt
POST /me/favourites/:restaurantId
```

Clicking the filled heart must call:

```txt
DELETE /me/favourites/:restaurantId
```

A successful add must update the heart to filled.

A successful remove must update the heart to empty.

**Auth behavior:**

- Favourite management requires authentication.
- If auth state is loading, do not show the favourite action yet.
- If the user is unauthenticated, do not show the favourite action.
- The frontend must not parse JWT.
- Authenticated requests must use browser cookie authentication through the shared API client.
- The frontend must not read, store or send JWT manually as a Bearer token.
- If the backend only accepts `Authorization: Bearer <token>`, implementation must stop.

**Business rules:**

- The frontend must request `GET /me/favourites` only for authenticated users.
- The initial heart state must come from `GET /me/favourites`.
- The favourite action must stay hidden while auth state or favourite state is loading.
- The current restaurant is favourited when one favourite item has `restaurantId` equal to the current route `restaurantId`.
- `DELETE /me/favourites/:restaurantId` uses the restaurant id, not the favourite record id.
- The backend remains the source of truth for whether the favourite belongs to the authenticated user.
- The frontend must not calculate favourite ownership.
- The frontend must not depend on the nested `restaurant` object returned by favourite endpoints.
- Do not show favourite management as available to unauthenticated users.
- Do not invent additional favourite fields.

**Validation:**

- `restaurantId` must be treated as a numeric route param.
- If `restaurantId` is invalid, the restaurant detail page must keep its existing error behavior.
- Add and remove actions must be disabled while a favourite mutation is pending.
- Duplicate clicks must not send duplicate mutation requests.

**Loading, error and success states:**

- While auth state is loading, the favourite action must remain hidden.
- While `GET /me/favourites` is loading, the favourite action must remain hidden.
- While `POST /me/favourites/:restaurantId` is pending, the heart action must be disabled.
- While `DELETE /me/favourites/:restaurantId` is pending, the heart action must be disabled.
- A successful add must show the filled heart without requiring a full page reload.
- A successful remove must show the empty heart without requiring a full page reload.
- `409 CONFLICT` with `message: "Restaurant is already a favourite."` must show a clear duplicate favourite message and treat the restaurant as already favourited.
- After that duplicate favourite response, the heart must remain filled or update to filled.
- Duplicate favourite errors must not be treated as unexpected failures.
- `401 Unauthorized` from `GET /me/favourites`, `POST /me/favourites/:restaurantId` or `DELETE /me/favourites/:restaurantId` must be handled as an auth/session error.
- After a favourite `401 Unauthorized`, the frontend must treat the user as unauthenticated for this action, hide the favourite control and show a clear auth/session error.
- `404` from remove must be handled clearly and must leave the heart empty.
- Unexpected add or remove failures must show a clear error message.
- Failed favourite mutations must not be treated as successful.

**Edge cases:**

- Auth state is loading.
- User is unauthenticated.
- Favourite list request is loading.
- Favourite list request fails.
- Current restaurant is not in `GET /me/favourites` results.
- Current restaurant is in `GET /me/favourites` results.
- Add request succeeds.
- Add request returns a duplicate favourite error.
- Add request returns `401 Unauthorized`.
- Add request fails unexpectedly.
- Remove request succeeds with `204 No Content`.
- Remove request returns `401 Unauthorized`.
- Remove request returns `404 Not Found`.
- Remove request fails unexpectedly.
- Favourite list request returns `401 Unauthorized`.

**Test/manual check plan:**

- Unauthenticated users do not see the favourite heart.
- Authenticated users see the favourite heart below `Check availability`.
- Empty heart renders when `GET /me/favourites` does not include the current `restaurantId`.
- Filled heart renders when `GET /me/favourites` includes the current `restaurantId`.
- Clicking the empty heart sends `POST /me/favourites/:restaurantId`.
- Successful add updates the heart to filled.
- Duplicate favourite conflict shows a clear message and leaves or updates the heart filled.
- Clicking the filled heart sends `DELETE /me/favourites/:restaurantId`.
- Successful remove updates the heart to empty.
- Heart action is disabled while add or remove is pending.
- Duplicate clicks do not send duplicate mutation requests.
- Favourite `401 Unauthorized` hides the control and shows a clear auth/session error.
- Remove `404` is visible and leaves the heart empty.
- Unexpected failures show a clear error.
- `npm run lint` passes.
- `npm run build` passes.

**Affected screens/components/hooks/API files:**

- Restaurant detail page at `/restaurants/:restaurantId`
- `src/features/restaurants/detail/components/restaurant-hero.tsx`
- Favourites API functions under `src/features/favourites/api/`
- Favourites hooks under `src/features/favourites/hooks/`
- Favourites types under `src/features/favourites/types.ts`
