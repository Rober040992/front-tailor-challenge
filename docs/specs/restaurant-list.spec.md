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
};
```

The page must display:

* The Tailor logo using `/Logo.png`.
* A responsive restaurant list.
* Restaurant cards rendered from the backend response.
* A left-side static visual placeholder reserved for a future map.
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
* The left-side section is only a static visual placeholder for a future map.
* No real map integration is implemented in this feature.

**Validation:**

None.

**Edge cases:**

* API request is loading.
* API request fails.
* API returns an empty array.
* Restaurant image is missing, empty or invalid.
* Restaurant has `averageRating: null` or `undefined`.
* Restaurant has an `averageRating` outside the `0–5` range.

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
* Clicking a restaurant card navigates to `/restaurants/:id`.
