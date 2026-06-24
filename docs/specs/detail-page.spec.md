## Spec: Restaurant Detail Owner Actions and Update Page

**Goal:**

Extend the existing restaurant detail page with owner-only edit and delete actions.

Add an owner-only update restaurant page using the same visual style as the create restaurant form.

**Endpoint(s):**

Existing frontend route:

GET /restaurants/:restaurantId

New frontend route:

GET /restaurants/:restaurantId/edit

Backend endpoints consumed:

GET /restaurants/:id

PATCH /restaurants/:id

DELETE /restaurants/:id

**Input:**

Route param:

restaurantId: number

Editable restaurant fields:

- `name`
- `address`
- `description`

Request body sent by `PATCH /restaurants/:id`:

```json
{
  "name": "string",
  "address": "string",
  "description": "string"
}
```

The update form must not send image data.

**Output:**

Restaurant detail responses include:

- ownerId
- canEdit

The existing restaurant detail page must show edit and delete actions only when `canEdit === true`.

The existing restaurant detail page must hide edit and delete actions when `canEdit === false`.

The edit action must navigate to:

```txt
/restaurants/:restaurantId/edit
```

The update page must render a form with:

- `name`
- `address`
- `description`

The update page must use the same visual style as the create restaurant form.

**Business rules:**

- The frontend must use `canEdit` to control edit and delete action visibility.
- The frontend must not calculate edit or delete permissions using `ownerId`.
- The frontend must not parse JWT or use stored auth data to decide edit or delete visibility.
- If cookies are not sent, the backend returns `canEdit: false`.
- The backend remains the source of truth for ownership.
- `PATCH /restaurants/:id` must send only `name`, `address` and `description`.
- `PATCH /restaurants/:id` only works for the owner.
- `DELETE /restaurants/:id` only works for the owner.
- Non-owner update or delete returns 403 Forbidden.
- Missing restaurant returns 404 Not Found.
- Do not invent backend fields.
- Do not invent endpoints.

**Validation:**

- restaurantId must be treated as a numeric route param.
- If restaurantId is invalid, the page must show an error state.
- `name` is required for update.
- `address` is required for update.
- `description` is required for update.
- Empty or whitespace-only update values are invalid.
- The update submit action must be disabled while submitting.

**Edge cases:**

- Restaurant detail response has `canEdit: true`.
- Restaurant detail response has `canEdit: false`.
- Restaurant request is loading.
- Restaurant request fails.
- Restaurant does not exist.
- Update request returns 403 Forbidden.
- Update request returns 404 Not Found.
- Delete request returns 403 Forbidden.
- Delete request returns 404 Not Found.

**Error handling:**

- 403 from update or delete must be shown as: `You cannot edit this restaurant.`
- 404 from restaurant detail, update, or delete must be shown as restaurant not found.
- Failed update or delete requests must not be treated as successful owner actions.

**Tests:**

- Renders edit and delete actions when `canEdit === true`.
- Does not render edit or delete actions when `canEdit === false`.
- Does not use `ownerId` to decide edit or delete visibility.
- Edit action navigates to `/restaurants/:restaurantId/edit`.
- Update page renders the restaurant form in the create form style.
- Update form sends only `name`, `address` and `description` to `PATCH /restaurants/:id`.
- Update form does not send image data.
- Disables update submit while the request is pending.
- Shows validation errors when update required fields are empty.
- Shows `You cannot edit this restaurant.` for update 403.
- Shows restaurant not found for update 404.
- Shows `You cannot edit this restaurant.` for delete 403.
- Shows restaurant not found for delete 404.
