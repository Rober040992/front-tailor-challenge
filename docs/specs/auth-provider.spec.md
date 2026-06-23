## Spec: Auth Provider

**Goal:**

Expose the current authenticated user to client components using the backend HttpOnly cookie session.

**Endpoint(s):**

Backend endpoint:

GET /auth/me

Authenticated response:

```json
{
  "id": 1,
  "email": "roberto@example.com",
  "username": "roberto"
}
```

Unauthenticated response:

```json
{
  "statusCode": 401,
  "error": "UNAUTHORIZED",
  "message": "Unauthorized",
  "path": "/auth/me",
  "timestamp": "2026-06-23T15:56:32.354Z"
}
```

**Output:**

CurrentUser:

- id: number
- email: string
- username: string

Auth state:

- user: CurrentUser | null
- isLoading: boolean
- error: unknown
- refreshUser: () => Promise<void>

**Business rules:**

- `GET /auth/me` is the source of truth for the current frontend auth state.
- `401 UNAUTHORIZED` from `/auth/me` means the user is unauthenticated.
- Unauthenticated state must be exposed as `user: null`.
- Unexpected `/auth/me` failures must be exposed through the auth state error.
- Successful login refreshes the current user before redirecting to `/restaurants`.
- Registration must not set the current user.
- The frontend must not store, read or parse JWTs.
- The user dropdown remains out of scope for this spec.

**Edge cases:**

- User has a valid cookie and `/auth/me` returns the current user.
- User has no valid cookie and `/auth/me` returns `401`.
- Backend is unavailable while loading the current user.
- Login succeeds and the current user is refreshed.

**Tests:**

- Auth provider loads the current user from `/auth/me`.
- Auth provider treats `/auth/me` `401` as `user: null`.
- Auth provider exposes unexpected `/auth/me` errors.
- Login still calls `/auth/login`.
- Successful login refreshes the current user and redirects to `/restaurants`.
