## Spec: Restaurant Availability

**Goal:**

Add a public restaurant availability flow.

Users can open availability from a restaurant detail page, select a date and party size, and view backend-confirmed slots.

This feature does not create reservations.

**Endpoint(s):**

Existing frontend route:

```txt
GET /restaurants/:restaurantId
```

New frontend route:

```txt
GET /restaurants/:restaurantId/availability
```

Backend endpoints consumed:

```txt
GET /restaurants/:id
GET /restaurants/:id/availability?date=YYYY-MM-DD&partySize=number
```

**Input:**

Route param:

- `restaurantId`: number

Availability query:

- `date`: ISO date string in `YYYY-MM-DD` format
- `partySize`: positive integer

Restaurant detail data used by this flow:

```ts
type RestaurantAvailabilityContext = {
  id: number;
  name: string;
  address: string;
  operatingHours: Record<string, string>;
};
```

Availability response:

```ts
type AvailabilitySlot = {
  time: string;
  availableSeats: number;
  available: boolean;
};

type AvailabilityResponse = {
  restaurantId: number;
  date: string;
  partySize: number;
  slots: AvailabilitySlot[];
};
```

**Output:**

The restaurant detail page must show a `Check availability` button below the restaurant address.

The button must navigate to:

```txt
/restaurants/:restaurantId/availability
```

The availability page must display:

- Restaurant name.
- Restaurant address.
- A custom month selector.
- Selectable days for the selected month.
- Party size input.
- Selected day operating hours.
- Availability slots returned by the backend.
- Loading state.
- Empty state.
- Error state.

The month selector must default to July 2026.

No calendar dependency is approved for this feature.

**Business rules:**

- The flow is public.
- The frontend must request restaurant context from `GET /restaurants/:id`.
- The frontend must request slots from `GET /restaurants/:id/availability?date=YYYY-MM-DD&partySize=number`.
- The user must select a date before requesting availability.
- The user must select a party size before requesting availability.
- Slots must not be shown as selectable before the backend availability response succeeds.
- The backend remains the source of truth for availability.
- The backend response must already apply operating hours and capacity rules.
- The frontend must not derive final availability from `capacity`.
- The frontend must not derive final availability from `defaultSlotCapacity`.
- The frontend must not derive final availability from `reservedSeats`.
- The frontend must not trust `bookedSlots` as the final source of availability.
- Slots with `available: false` must be disabled.
- Slots where `availableSeats < partySize` must be disabled.
- Available slots must be clearly distinguishable from disabled slots.
- Reservation creation is out of scope.
- Do not invent additional availability fields.
- Do not invent reservation creation behavior.

**Validation:**

- `restaurantId` must be treated as a numeric route param.
- If `restaurantId` is invalid, the page must show an error state.
- `date` is required before requesting availability.
- `partySize` is required before requesting availability.
- `partySize` must be a positive integer.
- Invalid inputs must show clear validation messages.
- Availability requests must not run until both `date` and `partySize` are valid.

**Edge cases:**

- Restaurant context request is loading.
- Restaurant context request fails.
- Restaurant does not exist.
- Availability request is loading.
- Availability request fails.
- Availability response contains an empty `slots` array.
- Selected day has no operating hours.
- Selected slot is booked.
- Selected slot is unavailable.
- Selected slot has fewer available seats than the selected party size.

**Error handling:**

- 404 from restaurant context must be shown as restaurant not found.
- Failed restaurant context requests must show a restaurant load error.
- Failed availability requests must show an availability load error.
- Validation errors must prevent the availability request.
- Backend errors must be displayed without crashing the page.

**Tests:**

Manual checks only for this feature because the frontend test infrastructure is not approved yet:

- Detail page shows `Check availability` below the address.
- `Check availability` navigates to `/restaurants/:restaurantId/availability`.
- Availability page loads restaurant context from `GET /restaurants/:id`.
- Invalid `restaurantId` shows an error state.
- Date cannot request availability without party size.
- Party size cannot request availability without date.
- Invalid party size shows a validation error.
- Availability request uses `date` and `partySize`.
- Slots are not selectable before the backend availability response succeeds.
- Slots with `available: false` render disabled.
- Slots with `availableSeats < partySize` render disabled.
- Empty slots response shows an empty state.
- Loading and error states are visible for failed restaurant or availability requests.
- `npm run lint` passes.
- `npm run build` passes.
