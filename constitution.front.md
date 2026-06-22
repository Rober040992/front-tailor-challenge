# Project Constitution

## Mandatory rules

This file is the main source of truth for the frontend repository.

All code, comments, commits, documentation and technical files must be written in English.

The project must stay simple, pragmatic and maintainable.

Every feature must have an approved spec before implementation.

Frontend implementation must follow stable backend API contracts.

Do not invent screens, flows, fields or business rules.

Do not modify unrelated files.

If a requirement is unclear, stop and ask.

Pixel-perfect Figma implementation is not required.

The UI must be usable, responsive and clear.

## Source hierarchy

Follow this order:

1. `constitution.front.md`
2. Feature specs in `docs/specs/`
3. `AGENTS.md`
4. UI skill files in `.codex/skills/`
5. Current Codex prompt
6. Implementation

If there is a conflict, the higher-level file wins.

## Feature priority

Frontend features must be implemented after backend contracts are stable.

Recommended order:

1. Project setup and base layout
2. API client and SWR setup
3. Auth flow
4. Restaurant list
5. Restaurant detail
6. Availability flow
7. Reservation creation
8. My reservations
9. Favourites
10. Comments
11. Restaurant CRUD UI
12. Loading, empty and error states
13. Responsive polish
14. Optional end-to-end tests

## Stack

Use:

* Next.js
* App Router
* TypeScript
* Tailwind CSS
* SWR
* fetch through a shared API client
* npm

Do not store JWT in frontend state, `localStorage` or `sessionStorage`.

## Architecture

Use a feature-based structure:

```txt
src/
  app/
  features/
  shared/
```

Rules:

* Feature folders own their API calls, hooks and components.
* Components mainly render UI.
* Client-side logic lives in hooks.
* API calls must not be written directly inside UI components.
* Shared components must stay generic.
* Feature-specific components must stay inside their feature folder.
* Do not create a large UI library before it is needed.

## Suggested structure

```txt
src/
  app/
  features/
    auth/
    restaurants/
    availability/
    reservations/
    favourites/
    comments/
  shared/
    components/
    lib/
    types/
```

## Shared components

Only create shared components when reused across features.

Allowed minimal shared components:

```txt
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
api-client.ts
routes.ts
format-date.ts
```

Do not build a full design system unless approved.

## API client

All HTTP requests must go through the shared API client.

Expected file:

```txt
src/shared/lib/api-client.ts
```

Rules:

* Always include `credentials: "include"`.
* Always parse JSON responses consistently.
* Always throw the backend error response when the API fails.
* Do not duplicate fetch logic across features.
* Do not manually read or store JWT.
* Do not put API calls directly inside UI components.

## SWR

Use SWR for server state.

Rules:

* Use one hook per server-state use case.
* Hooks must call feature API functions.
* Components must consume hooks.
* Components must handle loading states.
* Components must handle empty states.
* Components must handle error states.
* Mutations must avoid duplicate submissions.

Suggested hooks:

```txt
useRestaurants()
useRestaurant(restaurantId)
useRestaurantComments(restaurantId)
useAvailability(restaurantId, date, partySize)
useMyReservations()
useMyFavourites()
```

## Auth with HttpOnly cookie

The frontend must not handle JWT manually.

Registration flow:

```txt
Register page
-> user enters email and username
-> user clicks next
-> password page
-> user enters password
-> user clicks finish
-> frontend sends email, username and password to POST /auth/register
-> backend creates the user
-> frontend redirects user to login
```

Login flow:

```txt
Login form
-> POST /auth/login
-> backend sets HttpOnly cookie
-> frontend redirects user
```

Authenticated requests:

```txt
frontend request
-> fetch with credentials: "include"
-> browser sends HttpOnly cookie
-> backend validates JWT
```

Logout flow:

```txt
logout action
-> POST /auth/logout
-> backend clears cookie
-> frontend redirects user
```

Rules:

* Do not store JWT in `localStorage`.
* Do not store JWT in `sessionStorage`.
* Do not store JWT in Zustand.
* Do not read the JWT from JavaScript.
* Registration must not authenticate the user automatically.
* Registration success must redirect the user to login.
* Password must not be persisted in `localStorage` or `sessionStorage`.
* Authenticated UI depends on backend responses, not token parsing.

## Public and private flows

Public flows:

* View restaurant list.
* View restaurant detail.
* View restaurant comments.
* Check restaurant availability.
* Register.
* Log in.

Private flows:

* Create restaurant.
* Edit restaurant.
* Delete restaurant.
* Manage favourites.
* Create comment.
* Edit own comment.
* Delete own comment.
* Create reservation.
* View own reservations.
* Cancel own reservation.

## UI and UX rules

* Show loading states during API requests.
* Show empty states when there is no data.
* Show error states when an API request fails.
* Disable actions while a mutation is in progress.
* Do not allow duplicate form submissions.
* Use clear validation messages.
* Use accessible labels for inputs.
* Use semantic HTML where possible.
* Make the interface responsive.
* Use Figma as visual reference only.
* Prioritize usable flows over pixel-perfect matching.

## Business rules

### Restaurants UI

The initial page must display the home screen.

Users must be able to open a restaurant detail page.

Restaurant cards must show enough information for discovery.

Restaurant detail must show reservation-related UI.

Restaurant list and detail must show `averageRating` and `commentsCount` when available.

If `averageRating` is `null`, the UI must not show a fake rating.

### Auth UI

Users must be able to register.

Users must be able to log in.

Registration UI is split into two steps.

The first registration step must collect `email` and `username`.

The second registration step must collect `password`.

The user must not be registered until the password step is submitted.

The password step must submit `email`, `username` and `password` together to the backend register endpoint.

Registration must call the backend register endpoint.

Registration success must redirect the user to login.

Registration must not store JWT or mark the user as authenticated.

Registration errors must be displayed clearly.

Duplicated email or username errors must be handled clearly.

Login must call the backend login endpoint.

Login success depends on the backend setting the cookie.

Logout must call the backend logout endpoint.

Private UI actions must not appear available to unauthenticated users unless the flow redirects to login.

### Comments UI

Comments are readable publicly.

Creating comments requires authentication.

Editing comments requires authentication.

Deleting comments requires authentication.

The UI must not offer edit or delete actions for comments that do not belong to the current user.

The backend remains the source of truth for ownership.

### Favourites UI

Favourite management requires authentication.

Users can add a restaurant to favourites.

Users can remove a restaurant from favourites.

Users can view their own favourites.

Duplicated favourite errors must be handled clearly.

### Availability UI

The user must select a date before requesting availability.

The user must select a party size before requesting availability.

Availability must be requested from the backend.

Available and unavailable slots must be clearly displayed.

Slots where `availableSeats < partySize` must be disabled.

The UI must not trust frontend-only capacity calculations.

The backend response is required before showing selectable slots.

### Reservation UI

Reservation flow:

```txt
date -> party size -> slots -> confirm
```

Users can create a reservation only after selecting a valid slot.

Creating a reservation requires authentication.

Reservation creation errors must be displayed clearly.

Capacity conflicts must be shown as conflict errors, not generic crashes.

Users must be able to view their own reservations.

Reservation status must be visible.

Users must be able to cancel their own reservations.

Cancelled reservations must remain visible with cancelled status.

## Backend source of truth

The frontend is never the source of truth for:

* Authentication.
* Authorization.
* Ownership.
* Reservation capacity.
* Reservation status.
* Availability.
* Business rules.

The frontend can guide the user, but the backend validates final actions.

## Out of scope

* Payments
* Admin panels
* Multi-tenant support
* WebSockets
* Real-time updates
* Complex RBAC UI
* External authentication providers
* Email notifications
* SMS notifications
* Advanced design system
* Full component library
* Pixel-perfect Figma clone
* SEO optimization
* Production deployment unless there is time
* End-to-end tests before the main flow works
