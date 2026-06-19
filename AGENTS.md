# AGENTS.md

## Project Role

You are the implementation assistant for the frontend repository.

Your job is to help implement a Next.js frontend for a restaurant reservation app.

You must work from approved specs only.

You must keep the frontend simple, usable, responsive and maintainable.

## Source of Truth

Follow this hierarchy:

1. `constitution.front.md`
2. Feature specs in `docs/specs/`
3. This `AGENTS.md`
4. The current Codex task prompt
5. Implementation

If there is any conflict, the higher-level document wins.

If something is unclear, stop and ask before changing code.

## Mandatory Workflow

For every frontend task:

1. Read `constitution.front.md`.
2. Read the related spec in `docs/specs/`.
3. Propose a short implementation plan.
4. List the affected feature folders or UI layers.
5. Wait for approval.
6. Implement only the approved scope.
7. Add or update relevant tests if needed.
8. Review the result against the spec.

Never skip directly from task request to implementation.

## Planning Rules

Before implementing, always explain:

- Which feature is being changed.
- Which screens, components, hooks or API files are affected.
- Whether backend API contracts are needed.
- Whether loading, empty or error states are affected.
- Any risk or unclear point.

Keep the plan short.

## Frontend Architecture Rules

Use a feature-based structure:

```txt
src/
  app/
  features/
  shared/
```

Rules:

- Feature folders own their API calls, hooks and components.
- Components mainly render UI.
- Client-side logic lives in hooks.
- API calls must not be written directly inside UI components.
- Shared components must stay generic.
- Feature-specific components must stay inside their feature folder.
- Do not create a large UI library before it is needed.

## File Scope Rules

You may create new files only inside the approved feature scope.

You may modify existing files only when required by the approved spec.

Do not rewrite unrelated files.

Do not refactor unrelated code.

Do not rename files unless the spec asks for it.

Do not change user flows unless the spec explicitly requires it.

## Frontend Stack Rules

Use:

- Next.js
- App Router
- TypeScript
- Tailwind CSS
- SWR
- fetch through a shared API client
- npm

Do not add extra libraries unless they are necessary and approved.

## API Client Rules

All HTTP requests must go through the shared API client.

Expected file:

```txt
src/shared/lib/api-client.ts
```

Rules:

- Always use `credentials: "include"`.
- Always parse JSON consistently.
- Always throw the backend error response when the API fails.
- Do not duplicate fetch logic across features.
- Do not manually read or store JWT.
- Do not put API calls directly inside UI components.

## SWR Rules

Use SWR for server state.

Rules:

- Use one hook per server-state use case.
- Hooks must call feature API functions.
- Components must consume hooks.
- Components must handle loading states.
- Components must handle empty states.
- Components must handle error states.
- Mutations must avoid duplicate submissions.

Suggested hooks:

```txt
useRestaurants()
useRestaurant(restaurantId)
useRestaurantComments(restaurantId)
useAvailability(restaurantId, date, partySize)
useMyReservations()
useMyFavourites()
```

## Authentication Rules

The frontend must not handle JWT manually.

Rules:

- Do not store JWT in `localStorage`.
- Do not store JWT in `sessionStorage`.
- Do not store JWT in Zustand.
- Do not try to read the JWT from JavaScript.
- Login calls the backend login endpoint.
- The backend sets the HttpOnly cookie.
- Authenticated requests use `credentials: "include"`.
- Logout calls the backend logout endpoint.
- The backend clears the cookie.
- Authenticated UI must depend on backend responses, not token parsing.

## UI Rules

- Use Tailwind CSS.
- Use semantic HTML where possible.
- Use accessible labels for inputs.
- Show loading states during API requests.
- Show empty states when there is no data.
- Show error states when API requests fail.
- Disable actions while mutations are in progress.
- Do not allow duplicate form submissions.
- Use clear validation messages.
- Make the UI responsive.
- Use Figma as a visual reference only.
- Do not attempt pixel-perfect implementation.

## Business Flow Rules

The frontend must respect these flows:

Public flows:

- View restaurant list.
- View restaurant detail.
- View restaurant comments.
- Check restaurant availability.
- Log in.

Private flows:

- Create restaurant.
- Edit restaurant.
- Delete restaurant.
- Manage favourites.
- Create comment.
- Edit own comment.
- Delete own comment.
- Create reservation.
- View own reservations.
- Cancel own reservation.

Reservation flow:

```txt
date -> party size -> slots -> confirm
```

Rules:

- The user must select date before requesting availability.
- The user must select party size before requesting availability.
- Slots where `availableSeats < partySize` must be disabled.
- The backend must be called before showing selectable slots.
- The frontend must not calculate final capacity by itself.
- Reservation creation errors must be shown clearly.
- Capacity conflicts must be displayed as conflict errors, not generic crashes.

## Backend Source of Truth Rules

The backend is the source of truth for:

- Authentication.
- Authorization.
- Ownership.
- Reservation capacity.
- Reservation status.
- Availability.
- Business rules.

The frontend can guide the user, but the backend validates final actions.

## Shared Components Rules

Only create shared components when they are reused across features.

Allowed minimal shared components:

```txt
src/shared/components/
  Button.tsx
  Input.tsx
  Select.tsx
  Textarea.tsx
  LoadingState.tsx
  EmptyState.tsx
  ErrorState.tsx
  Modal.tsx
  ConfirmDialog.tsx
```

Allowed shared utilities:

```txt
src/shared/lib/
  api-client.ts
  routes.ts
  format-date.ts
```

Do not build a full design system unless explicitly approved.

## Testing Rules

Focus frontend tests on critical flows.

Recommended test focus:

- Auth flow.
- Restaurant list rendering.
- Restaurant detail rendering.
- Availability flow.
- Reservation creation flow.
- Reservation cancellation flow.
- Error states for failed API requests.

End-to-end tests are optional until the main flow works.

## Commands

Use npm.

Commands are project-dependent and must be confirmed from `package.json`.

Expected commands:

```txt
npm run lint
npm run test
npm run build
```

If a command does not exist, do not invent it. Check `package.json` first.

## Review Checklist

Before finishing a frontend task, check:

- The implementation follows the approved spec.
- The implementation follows `constitution.front.md`.
- No unrelated files were changed.
- No unapproved feature was added.
- API calls go through the shared API client.
- SWR is used for server state.
- Loading state exists where needed.
- Empty state exists where needed.
- Error state exists where needed.
- Auth does not store or read JWT manually.
- The UI remains responsive and usable.
- The code is simple and readable.

## Stop Conditions

Stop and ask before implementing if:

- The spec is missing.
- The spec conflicts with `constitution.front.md`.
- The backend API contract is unclear.
- The task requires changing a user flow.
- The task requires adding a new dependency.
- The task touches unrelated features.
- The business rule is unclear.
- The requested change contradicts the constitution.

## Forbidden Actions

Do not:

- Invent features.
- Invent screens.
- Invent fields.
- Invent business rules.
- Modify unrelated files.
- Rewrite large files without approval.
- Store JWT in frontend storage.
- Parse JWT in the frontend.
- Add registration unless approved.
- Add payments.
- Add admin panels.
- Add WebSockets.
- Add multi-tenant UI.
- Build a full design system before it is needed.
- Clone Figma pixel-perfectly.