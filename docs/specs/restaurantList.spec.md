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
* If `averageRating` is `null`, the UI must not show a fake rating.
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
* Restaurant has `averageRating: null`.

**Tests:**

Manual checks only for this feature because the frontend test infrastructure is not approved yet:

* The page renders restaurants from API data.
* The page shows a loading state while fetching.
* The page shows an error state when the request fails.
* The page shows an empty state when the list is empty.
* The page does not render a fake rating when `averageRating` is `null`.
* The page uses `/restaurant-miniature.png` when the restaurant image is missing or invalid.
* Clicking a restaurant card navigates to `/restaurants/:id`.
