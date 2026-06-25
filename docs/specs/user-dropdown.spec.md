## Spec: User Menu Dropdown

**Goal:**

Create a reusable dropdown menu for user actions on restaurant screens.

This spec does not create a global header.

**Placement:**

Render the user menu only where the consuming screen adds it:

- Restaurant list
- Restaurant detail
- Create restaurant
- Update restaurant

Hidden on auth screens.

**Endpoint(s):**

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

Authenticated state:

- Closed state:
  - Username + down arrow
- Expanded state:
  - Username + up arrow
  - Dropdown panel with:
    - My account
    - Add restaurant
    - Log out

Unauthenticated state:

- Show a link to `/register` with the text `Don't have an account yet?`

**Business rules:**

- The dropdown base component must be reusable and shared.
- The generic dropdown must not contain auth or logout logic.
- The user menu must use the shared dropdown component.
- The user menu must use the current user from the auth provider.
- The auth provider obtains the current user from GET /auth/me.
- The user menu must not read or decode the JWT.
- When the auth provider has a user, show the username on every supported screen that renders the dropdown.
- When the auth provider has no user, show the register link instead.
- My account navigates to `/my-account`.
- Add restaurant navigates to `/restaurants/new`.
- Log out calls POST `/auth/logout`.
- Successful logout redirects to `/login`.

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
- Calls the logout handler when clicking Log out.
- Shows the register link when there is no current user.
