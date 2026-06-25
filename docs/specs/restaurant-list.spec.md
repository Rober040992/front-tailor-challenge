## Spec: Restaurant List

**Goal:**

Display a public restaurant list page using real restaurant data from the backend API.

**Endpoint(s):**

Frontend route:

GET /restaurants

Backend API:

GET /restaurants

Restaurant detail navigation target:

GET /restaurants/:id

**Input:**

None.

**Output:**

The backend response is a direct array of restaurants:

```ts
type RestaurantListItem = {
  id: number;
  name: string;
  address: string;
  image: string | null;
  cuisineType: string;
  averageRating: number | null;
  commentsCount: number;
  lat?: number | null;
  lng?: number | null;
};
```

The page must display:

* The Tailor logo using `/Logo.png`.
* A responsive restaurant list.
* Restaurant cards rendered from the backend response.
* A left-side map area.
* A placeholder using `/Logo.png` in the left-side section when no restaurant is selected.
* Loading state.
* Empty state.
* Error state.

Each restaurant card must display:

* Restaurant image.
* Restaurant name.
* Restaurant address.
* Cuisine type.
* Average rating when available.
* Comments count.

Each restaurant card must navigate to:

```txt
/restaurants/:id
```

**Map requirements:**

* The map feature must use `maplibre-gl` as the browser map library.
* The map feature must use OpenFreeMap as the map style provider.
* The OpenFreeMap style URL must be `https://tiles.openfreemap.org/styles/liberty`.
* Implementation requires installing `maplibre-gl` with npm.
* Implementation requires importing `maplibre-gl/dist/maplibre-gl.css` once.
* The map must use the restaurant coordinates from the backend response.
* Restaurant coordinates must be passed to MapLibre as `[lng, lat]`, not `[lat, lng]`.
* If a selected restaurant does not have valid `lat` and `lng` values, the left section must show the `/Logo.png` placeholder.
* Coordinates with `lat: 0` and `lng: 0` must be treated as missing coordinates and must show the `/Logo.png` placeholder.
* The map must render only on the client side.
* The map must not require an API key.
* The map must not require registration.
* The map must not require a connection string.
* The map must not require a deploy-only environment variable.

**UI behavior:**

* On first click over a restaurant item, the item becomes selected and the left section shows the map centered on that restaurant location.
* If the user clicks outside the selected item, the item is deselected.
* If the user clicks again on the already selected restaurant item, navigate to `/restaurants/:id`.
* If no restaurant is selected, the left section shows a placeholder using `/Logo.png`.

**Business rules:**

* The page is public.
* The list must render only restaurants returned by `GET /restaurants`.
* No mock restaurants.
* No fake restaurant names.
* The raw `averageRating` value must be passed to the rating component without transformation.
* The rating component must render exactly five neutral `★` characters as its base layer.
* The rating component must overlay an identical amber `★` row clipped horizontally with `overflow: hidden`.
* The overlay width must use `(Math.max(0, Math.min(5, averageRating)) / 5) * 100`.
* `averageRating` values of `null` or `undefined` must render as `0%` fill.
* The internal clamp is only a rendering guard and must not mutate the original value.
* The rating fill must be continuous, without per-star rounding or half-star steps.
* The rating fill width must transition smoothly when the value changes.
* The rating component must support `sm`, `md` and `lg` font sizes.
* The rating component must optionally display the numeric value.
* The rating component must provide an accessible rating label.
* If `image` is `null`, empty or fails to load, the UI must use `/restaurant-miniature.png`.

**Validation:**

None.

**Edge cases:**

* API request is loading.
* API request fails.
* API returns an empty array.
* Restaurant image is missing, empty or invalid.
* Restaurant has `averageRating: null` or `undefined`.
* Restaurant has an `averageRating` outside the `0–5` range.
* No restaurant item is selected.
* A selected restaurant item is deselected by clicking outside it.
* A selected restaurant does not have valid `lat` and `lng` values.
* A selected restaurant has `lat: 0` and `lng: 0`.

**Tests:**

Manual checks only for this feature because the frontend test infrastructure is not approved yet:

* The page renders restaurants from API data.
* The page shows a loading state while fetching.
* The page shows an error state when the request fails.
* The page shows an empty state when the list is empty.
* Rating `0` renders five empty stars.
* Rating `2.2` renders a continuous `44%` fill.
* Rating `3.7` renders a continuous `74%` fill.
* Rating `5` renders a continuous `100%` fill.
* Rating `null` renders five empty stars without an error.
* Rating `5.8` renders a continuous `100%` fill without mutating the value.
* Rating prop changes transition the overlay width smoothly.
* The raw `averageRating` reaches the rating component without preprocessing.
* The page uses `/restaurant-miniature.png` when the restaurant image is missing or invalid.
* The left-side section shows the `/Logo.png` placeholder when no restaurant is selected.
* First click on a restaurant item selects it and centers the map on its location.
* Restaurant coordinates are passed to MapLibre as `[lng, lat]`.
* A selected restaurant without valid `lat` and `lng` values shows the `/Logo.png` placeholder.
* A selected restaurant with `lat: 0` and `lng: 0` shows the `/Logo.png` placeholder.
* Clicking outside the selected restaurant item deselects it.
* Clicking the already selected restaurant item navigates to `/restaurants/:id`.
