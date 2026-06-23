## Spec: Restaurant Detail Page

**Goal:**

Create a public restaurant detail page where users can view the selected restaurant information and its public comments.

This feature covers read-only restaurant detail, read-only comments, and a non-interactive reservation section placeholder.

It does not include comment creation, comment editing, comment deletion, availability requests, slot selection, or reservation creation.

**Endpoint(s):**

Frontend route:

GET /restaurants/:restaurantId

Backend endpoints consumed:

GET /restaurants/:id

GET /restaurants/:restaurantId/comments

**Input:**

Route param:

restaurantId: number

**Output:**

The page must display the selected restaurant information:

- restaurant.image
- restaurant.name
- restaurant.address
- restaurant.description
- restaurant.averageRating, when available
- restaurant.commentsCount, when available

The page must display the restaurant public comments list.

Each comment item must display:

- comment.name
- comment.rating
- comment.body

- The comment author name is shown on the left side.
- The comment content is shown on the right side.
- The rating is shown above the comment body.
- The rating is read-only.
- The rating is displayed visually with filled and unfilled dots or stars.
- Each comment has a blue separator line at the bottom.
- No avatar is required.
- No comment date is required.
- No edit or delete buttons are shown in this feature.


- Large restaurant image at the top. restaurant.image
- Restaurant name centered over the image.
- Restaurant address centered below the name.
- Dark visual style consistent with the current app UI.

The page must display a reservation-related section:

- The section is a non-interactive placeholder for the future reservation flow.
- The section must not display date, party-size, or slot controls.
- The section must not request availability.
- The section must not allow slot selection.
- The section must not display a reservation submission action.
- The section must not create a reservation.

**Business rules:**

- The page is public.
- Users do not need to be authenticated to view restaurant detail.
- Users do not need to be authenticated to view restaurant comments.
- Comments are read-only in this feature.
- The frontend must fetch the restaurant detail from the backend.
- The frontend must fetch the restaurant comments from the backend.
- The frontend must not invent missing restaurant data.
- The frontend must not invent missing comments.
- The frontend must not calculate restaurant rating manually in this feature.
- If restaurant averageRating is null, the UI must not show a fake restaurant rating.
- If restaurant commentsCount is unavailable, the UI must not invent a value.
- Comment creation is intentionally out of scope.
- Comment editing is intentionally out of scope.
- Comment deletion is intentionally out of scope.
- Availability logic, slot selection, and reservation creation are intentionally out of scope.

**Validation:**

- restaurantId must be treated as a numeric route param.
- If restaurantId is invalid, the page must show an error state.
- If a comment rating is missing or outside the expected range, the UI must avoid crashing.
- If a restaurant image is missing or invalid, the UI must show a safe fallback or keep the layout usable.

**Edge cases:**

- Restaurant request is loading.
- Comments request is loading.
- Restaurant request fails.
- Comments request fails.
- Restaurant does not exist.
- Restaurant exists but has no comments.
- Restaurant image is missing or invalid.
- Comment rating is missing.
- Comment rating is outside the expected range.
- Comments array is empty.

**Tests:**

- Renders restaurant hero with image, name and address.
- Renders restaurant description.
- Renders restaurant average rating when available.
- Does not render a fake restaurant rating when averageRating is null.
- Renders restaurant comments count when available.
- Renders comments list.
- Renders comment author name on the left side.
- Renders read-only rating above the comment body.
- Renders comment body.
- Renders blue separator between comments.
- Shows restaurant loading state.
- Shows comments loading state.
- Shows an error state when restaurantId is invalid.
- Shows restaurant error state.
- Shows comments error state.
- Shows not-found state when the restaurant does not exist.
- Shows empty comments state when there are no comments.
- Does not render comment form.
- Does not render submit comment button.
- Does not render edit comment button.
- Does not render delete comment button.
- Renders a non-interactive reservation section placeholder.
- Does not render date, party-size, or slot controls.
- Does not request availability.
- Does not allow slot selection.
- Does not render a reservation submission action.
- Does not create a reservation.
