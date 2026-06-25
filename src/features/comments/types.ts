export type RestaurantComment = {
  id: number;
  userId: number;
  restaurantId: number;
  name: string;
  date: string;
  rating: number | null;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateRestaurantCommentRequest = {
  rating: number;
  body: string;
};

export type UpdateRestaurantCommentRequest = {
  rating: number;
  body: string;
};
