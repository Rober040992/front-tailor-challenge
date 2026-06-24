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
- `imageFile` for local preview only

Request body sent to the backend:

    {
      "name": "string",
      "address": "string",
      "description": "string"
    }

The selected image is optional and must not be sent to the backend in this version.

**Output:**

Initial page:

- Black full-page background.
- Tailor logo centered at the top.
- Tailor logo centered at the bottom.
- Left section with a large white image upload area.
- Upload area text: `Añadir imagen`.
- When an image is selected, it is previewed immediately inside the upload area.
- Right section with:
  - Label: `Nombre de restaurante:`
  - Placeholder: `Nombre del restaurante`
  - Label: `Dirección del restaurante`
  - Placeholder: `Dirección`
  - Label: `Descripción del restaurante`
  - Placeholder: `Escribe información acerca del restaurante`
  - Submit button: `Guardar`

Successful creation popup:

- Tailor logo centered at the top.
- Text: `Restaurante guardado`.
- Button: `Ver restaurante`.
- The button navigates to `/restaurants/:restaurantId` using the `id` returned by `POST /restaurants`.

Failed creation popup:

- Tailor logo centered at the top.
- Text: `Ups, algo salió mal`.
- Button: `Volver`.
- The button closes the popup and returns the user to the form.

**Business rules:**

- Creating a restaurant requires authentication.
- The frontend must call `POST /restaurants`.
- The frontend must only send `name`, `address` and `description`.
- The backend is responsible for any default restaurant fields not sent by the frontend.
- The image upload is only a local preview in this version.
- On success, the UI must show the success popup.
- On failure, the UI must show the error popup.
- The form data must remain visible after closing the error popup.

**Validation:**

- `name` is required.
- `address` is required.
- `description` is required.
- Empty or whitespace-only values are invalid.
- The submit button must be disabled while submitting.
- Clear validation messages must be shown near the relevant fields.

**Edge cases:**

- If the user selects an invalid image file, the preview must not be updated.
- If the selected image cannot be previewed, the upload area must keep the `Añadir imagen` fallback.
- If `POST /restaurants` returns an error, show the failed creation popup.
- If the success response does not include `id`, do not navigate automatically and show the failed creation popup.
- If the user is not authenticated, the backend may return `401`; the UI must handle it as a failed creation request.

**Tests:**

- Render the create restaurant form.
- Show validation errors when required fields are empty.
- Preview the selected image locally.
- Send only `name`, `address` and `description` to `POST /restaurants`.
- Disable submit while the request is pending.
- Show success popup after successful creation.
- Navigate to `/restaurants/:restaurantId` from the success popup.
- Show failed popup when the request fails.
- Preserve form values after closing the failed popup.