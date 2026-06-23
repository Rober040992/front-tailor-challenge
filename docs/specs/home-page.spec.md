## Spec: Home Page

**Goal:**

Create a simple public home page that introduces the app and gives the user a clear entry point to the restaurant list.

**Endpoint(s):**

Frontend route:

```txt
GET /
```

Navigation target:

```txt
/restaurants
```

**Input:**

None.

**Output:**

A public home page containing:

* Tailor logo.
* Short welcome message.
* Primary action button.
* Decorative restaurant image or visual section.
* Responsive layout based on the approved Home visual pattern from the UI skill.

**Business rules:**

* The home page is public.
* The primary CTA text is `Enter`.
* Clicking `Enter` must navigate to `/restaurants`.
* The home page must not require authentication.
* The home page must not call the backend.
* The home page must not load restaurant data.
* The UI skill only guides the visual implementation after this spec approves the screen.

**Validation:**

None.

**Edge cases:**

* If the decorative image is missing, the page must remain usable.
* If the logo asset is missing, the page must not crash.
* On small screens, the content must remain readable and the `Enter` action must stay easy to tap.

**Tests:**

* Render the home page.
* Verify the `Enter` link points to `/restaurants`.
* Verify the page renders without requiring authenticated state.
