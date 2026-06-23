export type RestaurantListItem = {
  id: number;
  name: string;
  address: string;
  image: string | null;
  cuisineType: string;
  averageRating: number | null;
  commentsCount: number;
};

export type RestaurantDetail = {
  id: number;
  name: string;
  address: string;
  description: string;
  image: string | null;
  averageRating: number | null;
  commentsCount?: number;
};
