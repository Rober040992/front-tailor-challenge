## Spec: Reservation Creation From Availability

**Goal:**

Allow authenticated users to create a reservation from `/restaurants/:restaurantId/availability` after selecting a valid backend-confirmed availability slot.

This extends the existing availability flow only at the `slots -> confirm` step.

**Endpoint(s):**

Frontend route affected:

```txt
GET /restaurants/:restaurantId/availability
```

Backend endpoint consumed:

```txt
POST /reservations
```

Use plural `/reservations`.

**Input:**

Request body:

```json
{
  "restaurantId": 1,
  "date": "2026-07-15",
  "time": "19:00",
  "partySize": 2
}
```

Required fields:

- `restaurantId`: number
- `date`: `YYYY-MM-DD`
- `time`: string from the selected availability slot
- `partySize`: positive integer

**Output:**

Any successful `2xx` response means the reservation was created.

The frontend must not require extra response fields for this version.

**UI behavior:**

- Available slots on the availability page start reservation creation.
- Disabled slot rules from the availability spec remain unchanged.
- Clicking an enabled slot opens a confirmation modal.
- Modal text: `Are you sure you want to reserve this slot?`
- Modal shows restaurant name, selected date, selected time and party size.
- `Yes` submits the reservation.
- `No` closes the modal without submitting.
- While submitting, modal actions are disabled.
- On success, show clear success feedback.
- On failure, keep the user on the availability page and show a clear error.

**Auth behavior:**

- Reservation creation requires authentication.
- Use the existing auth provider state.
- If auth state is loading, do not allow reservation submission.
- If the user is unauthenticated, show an inline login CTA with a button navigating to `/login`.

**Validation:**

- Do not submit unless `restaurantId`, `selectedDate`, `selectedTime` and `partySize` are valid.
- `partySize` must be a positive integer.
- The selected slot must come from the latest successful availability response.
- The backend remains the source of truth for capacity.

**Loading, error and success states:**

- Disable modal actions and show submitting feedback during `POST /reservations`.
- Show a clear reservation-created message on success.
- Show a clear generic reservation creation error for unexpected failures.
- Show capacity conflicts as conflict errors.
- Show authentication feedback or login CTA for unauthenticated failures.

**Edge cases:**

- Changing date or party size clears selected slot and modal state.
- Availability reloading must not allow stale slot submission.
- `401` from reservation creation shows authentication feedback.
- `409` from reservation creation shows capacity conflict feedback.
- Other failed responses show generic reservation creation feedback.
- Duplicate clicks on `Yes` must not create duplicate submissions.

**Test/manual check plan:**

- Enabled available slot opens confirmation modal.
- Disabled booked, unavailable and low-capacity slots cannot open the modal.
- Modal displays restaurant name, date, time and party size.
- `No` closes modal without calling `POST /reservations`.
- `Yes` sends `restaurantId`, `date`, `time` and `partySize` to `POST /reservations`.
- Submit actions are disabled while the request is pending.
- Success response shows reservation-created feedback.
- `409 CONFLICT` shows a capacity conflict message.
- `401 UNAUTHORIZED` shows login CTA or authentication feedback.
- Other failed responses show a clear error.
- Changing date or party size clears selected slot state.
- `npm run lint` passes.
- `npm run build` passes.

**Affected screens/components/hooks/API files:**

- Availability page at `/restaurants/:restaurantId/availability`
- `src/features/availability/components/availability-page.tsx`
- Reservation API, hook and types under `src/features/reservations/`
