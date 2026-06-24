## Spec: Restaurant Hooks Refactor

**Goal:**

Refactor restaurant create, update and delete hooks so API request hooks stay small and form hooks only own form-specific state.

Reorganize the restaurants feature into pragmatic flow-based folders.

The refactor must preserve the current create, update and delete behavior.

**Scope:**

Affected restaurant feature files may include:

- restaurant list files
- restaurant detail files
- create restaurant API and hooks
- update restaurant API and hooks
- delete restaurant API and hooks
- shared restaurant components
- shared restaurant types
- restaurant form validation helpers
- restaurant create and update form components, only if needed to consume the refactored hooks

**Required structure:**

Use this restaurants feature structure:

```txt
src/features/restaurants/
  list/
    api/
    hooks/
    components/
  detail/
    api/
    hooks/
    components/
  create/
    api/
    hooks/
    components/
  edit/
    api/
    hooks/
    components/
  delete/
    api/
    hooks/
  shared/
    components/
    lib/
    types.ts
```

Folder ownership:

- `list` owns restaurant list fetching, hooks and UI.
- `detail` owns restaurant detail fetching, hooks and UI.
- `create` owns create restaurant API, hooks and UI.
- `edit` owns update restaurant API, hooks and UI.
- `delete` owns delete restaurant API and hooks.
- `shared` owns restaurant-only components, helpers and types reused by more than one restaurant flow.

Keep read hooks small:

- `useRestaurants()`
- `useRestaurant(restaurantId)`

Add or keep small request hooks:

- `useCreateRestaurantRequest()`
- `useUpdateRestaurantRequest()`
- `useDeleteRestaurantRequest()`

Request hooks must only own:

- request pending state
- backend request call
- backend request error state or thrown error handling
- duplicate submission guard

Form hooks must own:

- field values
- field validation
- image preview state for create form
- popup state
- calling the relevant request hook

Shared restaurant form validation may be extracted when it removes duplication between create and update.

**Backend contracts:**

Do not change backend endpoints:

- `POST /restaurants`
- `PATCH /restaurants/:id`
- `DELETE /restaurants/:id`

Create and update payloads must still send only:

- `name`
- `address`
- `description`

Image data must not be sent.

**Business rules:**

- Do not change create restaurant behavior.
- Do not change update restaurant behavior.
- Do not change delete restaurant behavior.
- Do not change owner permission behavior.
- Do not use `ownerId` to calculate permissions.
- Do not parse JWT or use stored auth data.
- Do not add new fields.
- Do not add new endpoints.
- Do not change user-facing copy unless required by the refactor.
- Do not move logic outside the restaurants feature unless it is already shared.
- Do not create generic names such as `public`, `owner`, `browsing`, or `management` for this refactor.

**Validation:**

- Create validation must still reject empty or whitespace-only `name`, `address` and `description`.
- Update validation must still reject empty or whitespace-only `name`, `address` and `description`.
- Submit actions must remain disabled while their request is pending.
- Duplicate submissions must still be prevented.

**Edge cases:**

- Create request fails.
- Create success response has no `id`.
- Update request returns 403 Forbidden.
- Update request returns 404 Not Found.
- Delete request returns 403 Forbidden.
- Delete request returns 404 Not Found.
- Invalid create image file is selected.
- Create image preview cannot be rendered.

**Tests:**

- Create form still sends only `name`, `address` and `description`.
- Update form still sends only `name`, `address` and `description`.
- Delete still calls `DELETE /restaurants/:id`.
- Create and update submit buttons remain disabled while pending.
- Required field validation still works for create and update.
- Create image preview behavior still works.
- Create success and failure popups still work.
- Update success and failure popups still work.
- Delete 403 still shows `You cannot edit this restaurant.`
- Delete 404 still shows restaurant not found.
