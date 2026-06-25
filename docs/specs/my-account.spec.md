## Spec: My Account

**Goal:**

Allow authenticated users to view and manage their own favourites and reservations from `/my-account`.

**Frontend route affected:**

```txt
GET /my-account
```

**Backend endpoints consumed:**

```txt
GET /me/favourites
DELETE /me/favourites/:restaurantId
GET /me/reservations
GET /reservations/:reservationId
PATCH /reservations/:reservationId/cancel
```

**Auth source:**

The page must use the existing AuthProvider state.

The page must not make a new request only to fetch the current user.

The header must render:

- `user.username`
- `user.email`

If AuthProvider is loading, the page must show a loading state.

If there is no authenticated user, the page must follow the existing private-route behaviour.

**Favourite response shape:**

`GET /me/favourites` returns:

```ts
type MyAccountFavouriteListResponse = {
  results: {
    id: number;
    restaurantId: number;
    createdAt: string;
    restaurant: {
      id: number;
      name: string;
      address: string;
      image: string | null;
    };
  }[];
};
```

The page must use the `results` array.

**Reservations response shape:**

`GET /me/reservations` returns an array:

```ts
type MyAccountReservation = {
  id: number;
  userId: number;
  restaurantId: number;
  date: string;
  time: string;
  partySize: number;
  status: "confirmed" | "cancelled" | string;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
  restaurantName: string;
};
```

`GET /reservations/:reservationId` returns the selected reservation detail with the same fields.

**Page layout:**

- The page must visually follow the Restaurant Detail page style.
- The page must include a header section.
- The dropdown menu component must appear on the right side of the header.
- Below the header, the page must show two side-by-side sections on desktop:
  - `My favourites`
  - `My reservations`
- On smaller screens, both sections must stack vertically.

**My favourites UI:**

- Fetch favourites with `GET /me/favourites`.
- Show a loading state.
- Show an empty state when there are no favourites.
- Show an error state if the request fails.
- Each favourite card must show:
  - `restaurant.name`
  - `restaurant.address`
  - `restaurant.image`
- Favourite cards must follow the same visual style as restaurant list cards.
- Each favourite must include an action to remove it using `DELETE /me/favourites/:restaurantId`.
- The remove action must use the restaurant id, not the favourite record id.
- Disable the remove action while deleting.
- Revalidate the favourites list after delete.

**My reservations UI:**

- Fetch reservations with `GET /me/reservations`.
- Show a loading state.
- Show an empty state when there are no reservations.
- Show an error state if the request fails.
- Each reservation item must show:
  - `restaurantName`
  - `date`
- Clicking a reservation must fetch its detail with `GET /reservations/:reservationId`.
- The selected reservation detail must show:
  - `restaurantName`
  - `date`
  - `time`
  - `partySize`
  - `status`
  - `createdAt`
- Confirmed reservations can be cancelled with `PATCH /reservations/:reservationId/cancel`.
- Disable the cancel action while cancelling.
- Revalidate the reservations list after cancellation.
- Revalidate the selected reservation detail after cancellation.
- Do not hide cancelled reservations.
- Cancelled reservations must remain visible.
- Cancelled reservations must show `status: cancelled`.
- The cancel action must not appear or must be disabled for cancelled reservations.

**Business rules:**

- My Account is private UI.
- The frontend must not parse JWT.
- The backend remains the source of truth for favourite ownership and reservation status.
- Do not add registration, payments, admin UI or new reservation flows.
- Do not invent additional user, favourite or reservation fields.

**Loading, empty and error states:**

- Auth loading shows a session loading state.
- Favourites loading shows a favourites loading state.
- Empty favourites shows a clear empty state.
- Failed favourites request shows a clear error state.
- Reservations loading shows a reservations loading state.
- Empty reservations shows a clear empty state.
- Failed reservations request shows a clear error state.
- Failed reservation detail request shows a clear error state.
- Failed remove or cancel mutations show clear inline feedback.

**Test/manual check plan:**

- Auth loading shows a loading state.
- Unauthenticated users see the existing private-route behaviour.
- Header renders username and email from AuthProvider.
- Dropdown appears on the right side of the header.
- Dropdown My account link navigates to `/my-account`.
- Favourites list uses `GET /me/favourites` results.
- Empty favourites state renders when results is empty.
- Favourite remove sends `DELETE /me/favourites/:restaurantId`.
- Favourite remove button is disabled while deleting.
- Reservations list uses `GET /me/reservations`.
- Empty reservations state renders when the array is empty.
- Clicking a reservation sends `GET /reservations/:reservationId`.
- Selected reservation detail renders the required fields.
- Confirmed reservation cancel sends `PATCH /reservations/:reservationId/cancel`.
- Cancel button is disabled while cancelling.
- Cancelled reservations stay visible and show `status: cancelled`.
- `npm run lint` passes.
- `npm run build` passes.

**Affected screens/components/hooks/API files:**

- `src/app/my-account/page.tsx`
- `src/features/my-account/`
- `src/features/auth/components/user-menu-dropdown.tsx`
- `docs/specs/user-dropdown.spec.md`
