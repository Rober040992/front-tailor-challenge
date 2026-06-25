# Restaurant Reservation Frontend

Frontend application for a restaurant reservation product. Users can browse restaurants, open restaurant detail pages, check backend-confirmed availability, create reservations, manage favourites, write comments, and review their own account activity.

This repository contains only the frontend. The backend API is required for the full app to work locally.

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- SWR for server state
- MapLibre GL for the restaurant map
- Vitest
- Testing Library
- ESLint
- npm

## Backend Dependency

The backend API must be running before testing the full frontend locally. Restaurant data, authentication, favourites, comments, availability, reservations, ownership, and business rules all come from the backend.

The backend repository has its own README for database setup, seed data, migrations, backend environment variables, and backend credentials.

## Environment Variables

Create a `.env` file in the project root from `.env.example`, then confirm it uses the expected backend URL for how the frontend is running.

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Expected local values when the frontend runs directly on the host machine:

```env
BACKEND_API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
```

`BACKEND_API_URL` is read by the runtime API proxy route at `src/app/api/[...path]/route.ts`. Frontend `/api/*` requests are proxied to `${BACKEND_API_URL}/*`.

`NEXT_PUBLIC_API_URL` is used by the shared API client. The value must remain `/api` so browser requests go through the frontend API proxy.

## Local Ports

With the current repository configuration:

- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3000`
- Backend URL used by the runtime API proxy: `BACKEND_API_URL=http://localhost:3000`
- Client API base URL: `NEXT_PUBLIC_API_URL=/api`

If the backend runs on a different port, update `BACKEND_API_URL` in `.env` to match the backend base URL.

## Installation

Install dependencies:

```bash
npm install
```

Create the local environment file and confirm the backend URL:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Start the backend API using the backend repository instructions.

Start the frontend development server:

```bash
npm run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001).

## Docker

The Docker setup runs only the frontend. The backend must already be running separately.

`NEXT_PUBLIC_API_URL` must stay `/api`. The browser calls the frontend at `/api/*`, and the frontend runtime proxy forwards those requests to `BACKEND_API_URL`.

When the frontend runs inside Docker and the backend runs on the host machine, use:

```env
BACKEND_API_URL=http://host.docker.internal:3000
NEXT_PUBLIC_API_URL=/api
```

Do not use `http://localhost:3000` for the backend from inside the frontend container. Inside a container, `localhost` points to the frontend container itself, not the host machine.

Other valid backend URL examples:

- Backend in the same Docker network: `BACKEND_API_URL=http://backend:3000`
- Deployed backend: `BACKEND_API_URL=https://api.example.com`

### Essential Docker Flow

Start the backend using the backend repository instructions, then build the frontend image:

```bash
npm run docker:build
```

This creates a local Docker image for the frontend using `npm ci`, `npm run build`, and the Next.js standalone output.

Run the frontend container with Compose:

```bash
npm run docker:up
```

This builds the image if needed, starts the frontend on [http://localhost:3001](http://localhost:3001), and uses the local Docker backend URL from `docker-compose.yml`.

Open [http://localhost:3001](http://localhost:3001), then verify that frontend API calls use `/api` and are proxied to `BACKEND_API_URL`.

Stop the local frontend container with:

```bash
npm run docker:down
```

This stops and removes the local frontend container created by Compose.

### Docker Script Reference

```bash
npm run docker:build
```

Builds the local frontend Docker image.

```bash
npm run docker:up
```

Builds and starts the local frontend Compose service.

```bash
npm run docker:down
```

Stops and removes the local frontend Compose service.

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server.

For the expected local frontend port, run:

```bash
npm run dev -- -p 3001
```

```bash
npm run build
```

Builds the application for production.

```bash
npm run start
```

Starts the production server after a successful build.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run test
```

Runs the Vitest test suite.

```bash
npm run docker:build
npm run docker:up
npm run docker:down
```

Builds, starts, and stops the local frontend Docker image and container.

## Test Credentials

Use the sample users documented in the backend README after running the backend seed.

## Project Structure

```txt
src/
  app/
  features/
  shared/
  test/
docs/
  specs/
public/
```

### `src/app`

Next.js App Router routes and layouts.

Current route areas:

- `/`
- `/login`
- `/register`
- `/register/password`
- `/restaurants`
- `/restaurants/new`
- `/restaurants/:restaurantId`
- `/restaurants/:restaurantId/edit`
- `/restaurants/:restaurantId/availability`
- `/my-account`

### `src/features`

Feature-owned API calls, hooks, components, types, tests, and local utilities.

Current feature areas:

- `auth`
- `availability`
- `comments`
- `favourites`
- `my-account`
- `reservations`
- `restaurants`

### `src/shared`

Generic shared code used across features.

Important shared areas:

- `src/shared/lib/api-client.ts`
- `src/shared/components`
- `src/shared/types`

### `src/test`

Shared Vitest and Testing Library setup helpers.

### `docs/specs`

Approved frontend feature specifications. Frontend work should follow `constitution.front.md` first, then the related spec.

### `public`

Static assets used by the frontend.

## Implemented Features

- Public home page with entry navigation to the restaurant list.
- Two-step registration flow.
- Login flow using the backend HttpOnly cookie session.
- Logout from the user dropdown.
- Auth provider based on `GET /auth/me`.
- Public restaurant list from backend data.
- Restaurant map using MapLibre GL and OpenFreeMap.
- Public restaurant detail page.
- Restaurant availability page with date and party size selection.
- Reservation creation from a backend-confirmed available slot.
- My Account page with own favourites and own reservations.
- Reservation detail and cancellation from My Account.
- Favourite add/remove from restaurant detail.
- Favourite removal from My Account.
- Public restaurant comments list.
- Authenticated comment creation.
- Own comment update and delete actions.
- Restaurant creation.
- Owner-controlled restaurant edit and delete actions based on backend-provided permissions.
- Restaurant creation persists an optional image URL through the backend `image` field.

## User Flows

Public flows:

- Open the home page.
- Navigate to the restaurant list.
- Browse restaurants returned by the backend.
- Select a restaurant on the list map area.
- Open a restaurant detail page.
- Read restaurant comments.
- Check availability by selecting a date and party size.
- Register.
- Log in.

Authenticated flows:

- Open the user dropdown.
- Log out.
- Open My Account.
- View own favourites.
- Remove own favourites.
- View own reservations.
- Open own reservation details.
- Create a reservation from an available slot.
- Cancel a confirmed own reservation.
- Add a restaurant to favourites.
- Remove a restaurant from favourites.
- Create a comment.
- Create a restaurant.

Authorized flows:

- Edit an owned restaurant when the backend returns permission for that restaurant.
- Delete an owned restaurant when the backend returns permission for that restaurant.
- Update own comments when the frontend can identify ownership and the backend authorizes the request.
- Delete own comments when the frontend can identify ownership and the backend authorizes the request.
- Cancel own confirmed reservations when the backend accepts the cancellation.
- Remove own favourites when the backend confirms ownership.

The frontend can hide or disable actions to guide the user, but the backend remains the final source of truth for authorization and ownership.

## My Account Area

The My Account page is available at `/my-account` for authenticated users.

It shows:

- Current username and email from the AuthProvider.
- User dropdown in the page header.
- Own favourite restaurants.
- Favourite removal.
- Own reservations.
- Reservation status.
- Reservation detail after selecting a reservation.
- Reservation cancellation for confirmed reservations.

Cancelled reservations stay visible and show their cancelled status.

## Local Verification Flow

1. Start the backend API using the backend README.
2. Confirm the backend URL matches `BACKEND_API_URL` in `.env`.
3. Start the frontend with `npm run dev -- -p 3001`.
4. Open [http://localhost:3001](http://localhost:3001).
5. Use the home page `Enter` action to go to `/restaurants`.
6. Confirm the restaurant list loads backend data.
7. Select a restaurant in the list and then open its detail page.
8. On the detail page, open `Check availability`.
9. Select a date and party size.
10. Confirm availability slots load from the backend.
11. Log in using a backend seed user.
12. Return to a restaurant availability page.
13. Select an available slot.
14. Confirm the reservation.
15. Open My Account from the user dropdown.
16. View the reservation status.
17. Open the reservation detail.
18. Cancel the reservation if it is confirmed.
19. Return to a restaurant detail page.
20. Add the restaurant to favourites.
21. Remove the restaurant from favourites.
22. Create a comment.
23. Log out from the user dropdown.

## API Client

All HTTP requests should go through the shared API client:

```txt
src/shared/lib/api-client.ts
```

The API client:

- Builds URLs from `NEXT_PUBLIC_API_URL`.
- Sends requests with `credentials: "include"`.
- Serializes object request bodies as JSON.
- Parses JSON responses consistently.
- Throws backend error responses when requests fail.

## Authentication

Authentication is controlled by the backend through HttpOnly cookies.

Frontend rules:

- Do not store JWTs in `localStorage`.
- Do not store JWTs in `sessionStorage`.
- Do not store JWTs in frontend state.
- Do not parse JWTs in the frontend.
- Authenticated UI depends on backend responses, especially `GET /auth/me`.

The browser sends the HttpOnly cookie automatically because API requests use `credentials: "include"`.

## Testing

Tests use Vitest with a jsdom environment and Testing Library.

Current test coverage includes:

- Shared API client behavior.
- Login form behavior.
- Register password step behavior.
- Availability slot disabling.
- Reservation creation hook behavior.
- My Account reservation detail behavior.
- Favourite toggle behavior.
- Comment creation behavior.
- Restaurant detail owner actions.

Run tests with:

```bash
npm run test
```

Run linting with:

```bash
npm run lint
```

Build the app with:

```bash
npm run build
```

## Technical Decisions and Trade-offs

- The frontend is a separate repository and depends on a running backend API.
- Next.js App Router is used for routing and layouts.
- TypeScript is used across the frontend.
- Tailwind CSS v4 is used for styling.
- SWR is used for server state.
- HTTP requests go through a shared API client.
- Authentication uses backend-controlled HttpOnly cookies.
- The frontend does not store, read, or parse JWTs.
- Restaurant image persistence in this MVP is URL-based: `POST /restaurants` sends optional `image` as a string in the JSON body. This keeps the MVP focused on restaurant CRUD without adding file storage infrastructure.
- The frontend does not upload restaurant image files in this MVP, does not use `multipart/form-data`, does not add Multer flows, and does not perform direct uploads to external storage.
- MapLibre GL is used for the restaurant map.
- Figma is treated as a visual reference, not as a pixel-perfect target.
- The backend remains the source of truth for authentication, authorization, ownership, availability, reservation capacity, reservation status, and business rules.

## Current Limitations

- Backend setup, database setup, seed data, migrations, and test user credentials are documented in the backend repository, not in this frontend repository.
- Restaurant image creation accepts an optional URL string only; local file upload is outside this MVP because it would require upload/storage infrastructure that is intentionally not part of this version.
- End-to-end tests are not included in this repository.

## Troubleshooting

### Missing Environment Variables

If the app fails with a missing environment variable error, confirm that `.env` contains:

```env
BACKEND_API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
```

Restart the dev server after changing environment variables.

### API Requests Fail Locally

Confirm that:

- The backend server is running.
- `BACKEND_API_URL` points to the backend base URL.
- `NEXT_PUBLIC_API_URL` points to `/api` for the frontend runtime proxy.
- The backend supports cookie-based authentication for the frontend origin.

### Authenticated Requests Do Not Work

Confirm that:

- Login succeeds on the backend.
- The backend sets the HttpOnly cookie.
- Frontend requests go through the shared API client.
- Requests include credentials through `credentials: "include"`.


## Author note

Built by Roberto Gomez Fabrega as part of a technical challenge, with a focus on clean frontend architecture, clear business rules, and maintainable design.
