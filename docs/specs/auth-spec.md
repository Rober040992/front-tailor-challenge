## Spec: Frontend Auth Flow

**Goal:**

Create the frontend authentication flow for user registration and login.

The register flow must have two steps.

The login flow must authenticate the user through the backend HttpOnly cookie flow.

**Endpoint(s):**

Backend endpoints:

POST /auth/register

POST /auth/login

Frontend routes:

/register

/register/password

/login

Redirects:

Successful register -> /login

Successful login -> /restaurants

**Input:**

Register step 1:

{
  email: string;
  username: string;
}

Register step 2:

{
  password: string;
  repeatPassword: string;
}

Final register request:

{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "Password123"
}

Login request:

{
  "username": "newuser",
  "password": "Password123"
}

**Output:**

Register success:

HTTP 201

Returns the created public user.

Redirect to /login

Login success:

HTTP 200

Returns:

{
  "id": "string",
  "username": "newuser"
}

The backend sets the authentication cookie.

Redirect to /restaurants

The frontend ignores successful register and login response bodies and proceeds based on the successful HTTP status.

Register duplicated email or username error:

{
  "statusCode": 409,
  "error": "CONFLICT",
  "message": "Email or username already exists.",
  "path": "/auth/register",
  "timestamp": "2026-06-23T09:19:34.342Z"
}

Login invalid credentials error:

{
  "statusCode": 401,
  "error": "UNAUTHORIZED",
  "message": "Invalid username or password.",
  "path": "/auth/login",
  "timestamp": "2026-06-23T09:19:34.342Z"
}

The same login error response is returned for invalid username and invalid password.

The login error response has no `details` field.

The documented `201`, `200`, `409` and `401` responses are confirmed as the stable backend contract.

If the backend contract changes, implementation must stop and the spec must be updated first.

For unexpected `400`, `500` or network errors, the UI displays the backend message when available.

If no usable backend message is returned, the UI displays `Something went wrong. Please try again.`

**Business rules:**

- Register step 1 collects `email` and `username`.
- Register step 1 does not call the backend.
- Register step 2 collects `password` and `repeatPassword`.
- `repeatPassword` is a frontend-only validation field.
- `repeatPassword` must not be sent to the backend.
- `password` and `repeatPassword` must match before submitting.
- If passwords do not match, show `Passwords must match.`
- The final register request sends only `email`, `username` and `password`.
- Successful registration does not authenticate the user.
- Successful registration redirects to `/login`.
- Login sends `username` and `password`.
- Successful login depends on the backend setting the HttpOnly cookie.
- Successful login redirects to `/restaurants`.
- The register progress is not persisted.
- `email` and `username` may only live in temporary in-memory state inside the register flow.
- If the user reloads the page, the register progress is lost.
- If the user opens `/register/password` directly without temporary register data, redirect to `/register`.
- Logout UI is out of scope for this spec because it belongs to the user dropdown flow.
- Register step 1 includes an `Already registered? Log in` action below `Next`.
- The register step 1 login action navigates to `/login`.
- Register step 2 includes a `Back` action below `Finish`.
- The register step 2 back action navigates to `/register`.

**Validation:**

Register step 1:

- `email` is required.
- `email` must have valid email format.
- `username` is required.
- `username` must not be empty after trimming.

Register step 2:

- `password` is required.
- `repeatPassword` is required.
- `password` and `repeatPassword` must match.

Login:

- `username` is required.
- `password` is required.

**UI details from PNGs:**

Auth layout:

- Black page background.
- Large rounded blue auth card.
- Tailor logo in white at the top left.
- Form labels in white.
- Inputs with blue background, white border and light placeholder.
- Main action button in white with black text.
- Large rounded restaurant image on the right side for wide screens.
- On smaller/card-only versions, the form card can be shown without the right image.
- Layout must be responsive.
- Pixel-perfect implementation is not required.

Register step 1:

- Fields:
  - Email
  - Username
- Placeholders:
  - Add your email
  - Add your username
- Button text:
  - Next

- Footer text:
  - Already registered? Log in
- The `Log in` footer action navigates to `/login`.

Register step 2:

- Text:
  - Create a new password
- Fields:
  - Password
  - Repeat password
- Placeholders:
  - Add a password
  - Repeat your password
- Button text:
  - Finish

- Back action:
  - Back
- The `Back` action navigates to `/register`.

Login:

- Fields:
  - Username
  - Password
- Placeholders:
  - Enter your username
  - Enter your password
- Button text:
  - Next
- Footer text:
  - Do not have an account? Register
- The `Register` footer action navigates to `/register`.

**Edge cases:**

- User submits register step 1 with empty email.
- User submits register step 1 with invalid email.
- User submits register step 1 with empty username.
- User opens `/register/password` directly.
- User reloads `/register/password`.
- User submits different passwords.
- Backend returns `409 CONFLICT` during register.
- Backend returns `401 UNAUTHORIZED` during login.
- Backend is unavailable.
- User double-clicks submit.

**Tests:**

- Register step 1 validates required email.
- Register step 1 validates email format.
- Register step 1 validates required username.
- Register step 1 navigates to `/register/password` when valid.
- Register step 1 `Log in` action navigates to `/login`.
- Register step 2 redirects to `/register` if temporary data is missing.
- Reloading `/register/password` redirects to `/register`.
- Register step 2 `Back` action navigates to `/register`.
- Register step 2 validates required password.
- Register step 2 validates required repeatPassword.
- Register step 2 shows `Passwords must match.` when passwords differ.
- Register step 2 calls register with only `email`, `username` and `password`.
- Successful register redirects to `/login`.
- Register conflict error shows the backend message.
- Login calls backend with `username` and `password`.
- Successful login redirects to `/restaurants`.
- Login invalid credentials error shows `Invalid username or password.`
- Unexpected backend errors show the backend message when available.
- Errors without a usable backend message show `Something went wrong. Please try again.`
- The login footer `Register` action navigates to `/register`.
- Submit buttons are disabled while pending.
