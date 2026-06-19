# Project Constitution

## Mandatory Rules

- This file is the main source of truth for the frontend repository.
- All code, comments, commits, documentation and technical files must be written in English.
- The project must stay simple, pragmatic and maintainable.
- Do not add features that are not explicitly required or approved.
- Do not overengineer the frontend.
- Follow SOLID principles where they improve clarity.
- Every feature must have an approved spec before implementation.
- Never jump directly from an idea to code.
- Frontend implementation must follow stable backend API contracts.
- Codex must not modify unrelated files.
- Codex must not invent screens, flows, fields or business rules.
- If a requirement is unclear, Codex must stop and ask before implementing.
- Pixel-perfect Figma implementation is not required.
- The UI must be usable, responsive and clear.

## Shared Workflow

### Source hierarchy

The frontend repository must follow this hierarchy:

1. `constitution.front.md`
2. Feature specs
3. `AGENTS.md`
4. Codex task prompt
5. Implementation

If there is a conflict, the higher-level document wins.

### Feature workflow

Every frontend feature must follow this flow:

1. Read the related constitution section.
2. Read the related feature spec.
3. Propose a short plan.
4. Wait for approval.
5. Implement only the approved scope.
6. Add or update relevant tests if needed.
7. Review the result against the spec and constitution.

### Feature priority

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

## Frontend Constitution

### Stack

- Use Next.js.
- Use App Router.
- Use TypeScript.
- Use Tailwind CSS.
- Use SWR for server state.
- Use feature-based organization.
- Use `fetch` through a shared API client.
- Do not store JWT in frontend state, `localStorage` or `sessionStorage`.

### Architecture

Use a feature-based frontend structure:

```txt
src/
  app/
  features/
  shared/
```

Feature folders must own their own API calls, hooks and components.

Suggested structure:

```txt
src/
  app/
    layout.tsx
    page.tsx
    restaurants/
      page.tsx
      [restaurantId]/
        page.tsx
    login/
      page.tsx
    me/
      reservations/
        page.tsx
      favourites/
        page.tsx

  features/
    auth/
      api.ts
      hooks/
      components/

    restaurants/
      api.ts
      hooks/
      components/

    availability/
      api.ts
      hooks/
      components/

    reservations/
      api.ts
      hooks/
      components/

    favourites/
      api.ts
      hooks/
      components/

    comments/
      api.ts
      hooks/
      components/

  shared/
    components/
    lib/
    types/
```

### Component rules

- Components should mainly render UI.
- Client-side logic should live in hooks.
- API calls must not be written directly inside UI components.
- Shared components must stay generic.
- Feature-specific components must stay inside their feature folder.
- Do not create a large UI library before it is needed.

### Minimal shared components

Only create shared components when reused across features.

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

### API client

All HTTP requests must go through a shared API client.

Suggested file:

```txt
src/shared/lib/api-client.ts
```

Rules:

- Always include `credentials: "include"`.
- Always parse JSON responses consistently.
- Always throw the backend error response when the API fails.
- Do not duplicate fetch logic across features.
- Do not manually read or store JWT.

Example behaviour:

```ts
export async function apiClient<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw await response.json();
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
```

### SWR rules

- Use SWR for server state.
- Use one hook per server-state use case.
- Hooks must call feature API functions.
- Components must consume hooks.
- Use SWR loading, error and empty states clearly.

Suggested hooks:

```txt
useRestaurants()
useRestaurant(restaurantId)
useRestaurantComments(restaurantId)
useAvailability(restaurantId, date, partySize)
useMyReservations()
useMyFavourites()
```

### Auth with HttpOnly cookie

The frontend must not handle JWT manually.

Login flow:

```txt
Login form
-> POST /auth/login
-> backend validates credentials
-> backend sets HttpOnly cookie
-> browser stores cookie automatically
-> frontend redirects user
```

Authenticated requests:

```txt
frontend request
-> fetch with credentials: "include"
-> browser sends HttpOnly cookie automatically
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

- Do not store JWT in `localStorage`.
- Do not store JWT in `sessionStorage`.
- Do not store JWT in Zustand.
- Do not try to read the JWT from JavaScript.
- Authenticated UI should be based on backend responses, not token parsing.

### Public and private frontend flows

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

### UI and UX rules

- Always show loading states during API requests.
- Always show empty states when there is no data.
- Always show error states when an API request fails.
- Disable actions while a mutation is in progress.
- Do not allow duplicate form submissions.
- Use clear validation messages.
- Use accessible labels for inputs.
- Use semantic HTML where possible.
- Make the interface responsive.
- Use Figma as visual reference only.
- Prioritize usable flows over pixel-perfect matching.

## Business Rules

### Restaurants UI

- The initial page must display a restaurant list.
- Users must be able to open a restaurant detail page.
- Restaurant cards should show enough information for discovery.
- Restaurant detail should show reservation-related UI.
- Restaurant list and detail should show `averageRating` and `commentsCount` when available.
- If `averageRating` is `null`, the UI must not show a fake rating.

### Auth UI

- Users must be able to log in.
- Login must call the backend login endpoint.
- Login success depends on the backend setting the cookie.
- Logout must call the backend logout endpoint.
- Private UI actions must not be shown as available to unauthenticated users unless the flow redirects to login.

### Comments UI

- Comments must be readable publicly.
- Creating comments requires authentication.
- Editing comments requires authentication.
- Deleting comments requires authentication.
- The UI must not offer edit/delete actions for comments that do not belong to the current user.
- The backend remains the source of truth for ownership.

### Favourites UI

- Favourite management requires authentication.
- Users can add a restaurant to favourites.
- Users can remove a restaurant from favourites.
- Users can view their own favourites.
- The UI must handle duplicated favourite errors gracefully.

### Availability UI

- The user must select a date before requesting availability.
- The user must select a party size before requesting availability.
- Availability must be requested from the backend.
- Available and unavailable slots must be clearly displayed.
- Slots where `availableSeats < partySize` must be disabled.
- The UI must not trust frontend-only capacity calculations.
- The backend response is required before showing selectable slots.

### Reservation UI

- Reservation flow must be: date -> party size -> slots -> confirm.
- Users can create a reservation only after selecting a valid slot.
- Creating a reservation requires authentication.
- The UI must display reservation creation errors clearly.
- Capacity conflicts must be shown as a conflict, not as a generic crash.
- Users must be able to view their own reservations.
- Reservation status must be visible.
- Users must be able to cancel their own reservations.
- Cancelled reservations must remain visible with cancelled status.

### Backend source of truth

- The frontend is never the source of truth for authentication.
- The frontend is never the source of truth for ownership.
- The frontend is never the source of truth for reservation capacity.
- The frontend is never the source of truth for reservation status.
- The frontend can guide the user, but the backend validates final actions.

## AI Workflow

- Codex is the implementation assistant inside VS Code.
- Codex must implement only from approved specs.
- Codex must not invent features.
- Codex must not modify unrelated files.
- Codex must not rewrite files without explicit approval.
- Codex must propose a short plan before implementation.
- Codex must list affected layers before implementation.
- Codex must review the result against the related spec.
- `AGENTS.md` must exist in the repository root.
- `.codex/` may be used only for optional prompts or notes.
- AI usage must be documented in the README.
- The README must explain what AI helped with, what was reviewed, and what was rejected or changed.

## Decisions

- The frontend repository is separate from the backend repository.
- The frontend is implemented after backend contracts are stable.
- Next.js App Router is used.
- TypeScript is used.
- Tailwind CSS is used.
- SWR is used for server state.
- The frontend is organized by features.
- API calls live inside feature API files.
- Client-side logic lives in hooks.
- Components mainly render UI.
- JWT is stored in an `HttpOnly` cookie by the backend.
- The frontend does not manually manage JWT.
- All API requests use `credentials: "include"`.
- A shared API client is used.
- Shared components are minimal.
- Figma is used only as a visual reference.
- Pixel-perfect implementation is not required.
- The reservation flow is date -> party size -> slots -> confirm.
- Swagger is not relevant to the frontend.
- Docker is optional and can be added at the end if useful.

## Out of Scope

- User registration.
- Payments.
- Admin panels.
- Multi-tenant support.
- WebSockets.
- Real-time updates.
- Complex RBAC UI.
- External authentication providers.
- Email notifications.
- SMS notifications.
- Advanced design system.
- Full component library.
- Pixel-perfect Figma clone.
- SEO optimization.
- Production deployment unless there is time.
- End-to-end tests before the main flow works.