## Spec: Frontend Critical Tests

**Goal:**

Add only the essential frontend tests that protect implemented critical functionality.

**Scope:**

- Shared API client.
- Auth login and register.
- Availability slot selection.
- Restaurant detail owner actions.
- Reservation creation.
- Reservation cancellation.
- Favourite toggle.
- Comment creation.

**Out of scope:**

- Pixel-perfect UI tests.
- MapLibre rendering tests.
- Full page smoke tests for every screen.
- Exhaustive loading, empty and error tests for all components.
- End-to-end tests.

**Tests:**

- API client sends requests with cookie credentials.
- API client throws backend error responses.
- Login sends `username` and `password`.
- Login invalid credentials show the backend message.
- Register password step sends only `email`, `username` and `password`.
- Availability disables unavailable slots.
- Availability disables slots where `availableSeats < partySize`.
- Restaurant detail shows edit and delete actions only when `canEdit === true`.
- Reservation creation sends `restaurantId`, `date`, `time` and `partySize`.
- Reservation creation handles authentication and capacity conflict feedback.
- Cancelled reservations stay visible and cannot be cancelled again.
- Favourite toggle adds favourites using `restaurantId`.
- Favourite toggle removes favourites using `restaurantId`.
- Duplicate favourite conflict leaves the restaurant favourited.
- Comment creation validates rating and body.
- Comment creation sends `rating` and `body`.
- Comment creation success shows success feedback.
