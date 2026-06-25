## Spec: Create Restaurant Page

**Goal:**

Create a private page where an authenticated user can create a restaurant using a simple form based on the provided visual reference.

**Endpoint(s):**

Frontend route:

GET /restaurants/new

Backend endpoint:

POST /restaurants

Success navigation target:

/restaurants/:restaurantId

**Input:**

Form fields:

- `name`
- `address`
- `description`
- `image`

`image` is optional and must be a URL string.

Request body sent to the backend:

```json
{
  "name": "string",
  "address": "string",
  "description": "string",
  "image": "https://example.com/image.jpg"
}
```

If no image URL is provided, omit `image` from the request body.

**Output:**

Initial page:

- Black full-page background.
- Tailor logo centered at the top.
- Tailor logo centered at the bottom.
- Left section with a large white image preview area.
- Preview area fallback text: `Image will show here`.
- When an image URL is entered, it is previewed inside the preview area.
- Right section with:
  - Label: `Restaurant name:`
  - Placeholder: `Restaurant name`
  - Label: `Restaurant address`
  - Placeholder: `Address`
  - Label: `Restaurant description`
  - Placeholder: `Write information about the restaurant`
  - Label: `Restaurant image URL`
  - Placeholder: `https://example.com/image.jpg`
  - Submit button: `Save`

Successful creation popup:

- Tailor logo centered at the top.
- Text: `Restaurant saved`.
- Button: `View restaurant`.
- The button navigates to `/restaurants/:restaurantId` using the `id` returned by `POST /restaurants`.

Failed creation popup:

- Tailor logo centered at the top.
- Text: `Something went wrong`.
- Button: `Back`.
- The button closes the popup and returns the user to the form.

**Business rules:**

- Creating a restaurant requires authentication.
- The frontend must call `POST /restaurants`.
- The frontend must send only `name`, `address`, `description` and optional `image`.
- The backend is responsible for any default restaurant fields not sent by the frontend.
- Image persistence for this MVP is URL-based only.
- This MVP stores an already-hosted image URL because file upload/storage infrastructure is intentionally out of scope.
- The frontend must not upload files for restaurant images in this MVP.
- The frontend must not use `multipart/form-data` for restaurant creation in this MVP.
- The frontend must not add Multer-based upload flows in this MVP.
- The frontend must not add direct upload flows to external storage in this MVP.
- On success, the UI must show the success popup.
- On failure, the UI must show the error popup.
- The form data must remain visible after closing the error popup.

**Validation:**

- `name` is required.
- `address` is required.
- `description` is required.
- Empty or whitespace-only values are invalid.
- `image` is optional.
- If `image` is provided, it must be a valid `http` or `https` URL.
- The submit button must be disabled while submitting.
- Clear validation messages must be shown near the relevant fields.

**Edge cases:**

- If the image URL is invalid, the preview area must keep the `Image will show here` fallback.
- If the image URL cannot be previewed, the preview area must keep the `Image will show here` fallback.
- If `POST /restaurants` returns an error, show the failed creation popup.
- If the success response does not include `id`, do not navigate automatically and show the failed creation popup.
- If the user is not authenticated, the backend may return `401`; the UI must handle it as a failed creation request.

**Tests:**

- Render the create restaurant form.
- Show validation errors when required fields are empty.
- Show validation error when image URL is invalid.
- Preview a valid image URL.
- Send `name`, `address`, `description` and optional `image` to `POST /restaurants`.
- Omit `image` when no image URL is provided.
- Do not send file data.
- Do not use `multipart/form-data`.
- Disable submit while the request is pending.
- Show success popup after successful creation.
- Navigate to `/restaurants/:restaurantId` from the success popup.
- Show failed popup when the request fails.
- Preserve form values after closing the failed popup.
