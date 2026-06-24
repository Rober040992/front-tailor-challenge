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
  canEdit: boolean;
  commentsCount?: number;
  operatingHours?: Record<string, string>;
  ownerId?: number;
};

export type CreateRestaurantRequest = {
  name: string;
  address: string;
  description: string;
};

export type CreateRestaurantResponse = {
  id?: number | string;
};

export type UpdateRestaurantRequest = {
  name: string;
  address: string;
  description: string;
};
