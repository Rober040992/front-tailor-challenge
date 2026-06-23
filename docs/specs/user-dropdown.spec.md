## Spec: User Menu Dropdown

**Goal:**

Create a reusable dropdown menu for user actions on the top rigt header.

**Endpoint(s):**

Frontend placement:

Hidden on:

- /login
- /register
- /register/password

Navigation targets:

- /account
- /restaurants/new
- /login

Backend action:

- GET /auth/me
- POST /auth/logout

Current user response:

```json
{
  "username": "string"
}
```

**Input:**

UserMenuDropdownProps:

- username: string

**Output:**

Closed state:

- Username + down arrow

Expanded state:

- Username + up arrow
- Dropdown panel with:
  - Mi cuenta
  - Añadir restaurante
  - Salir

**Business rules:**

- The dropdown base component must be reusable and shared.
- The generic dropdown must not contain logout logic.
- The user menu must use the shared dropdown component.
- The username must be obtained from GET /auth/me.
- The browser must send the HttpOnly authentication cookie with the request.
- The backend must validate and decode the JWT.
- The frontend must not read or decode the JWT.
- The user menu must not render on login or register routes.
- Mi cuenta navigates to /account.
- Añadir restaurante navigates to /restaurants/new.
- Salir calls logout and redirects to /login.

**Validation:**

- If username is missing, the menu must not render fake user data.
- Logout action must be disabled while logout is pending.

**Edge cases:**

- Clicking the trigger opens and closes the dropdown.
- The arrow changes direction depending on the open state.
- Clicking outside closes the dropdown.
- Pressing Escape closes the dropdown.
- Duplicate logout submissions must be prevented.

**Tests:**

- Renders the closed dropdown with username.
- Opens the dropdown when clicking the trigger.
- Closes the dropdown when clicking the trigger again.
- Shows the expected menu actions.
- Calls the logout handler when clicking Salir.
- Does not render on /login, /register, or /register/password.
