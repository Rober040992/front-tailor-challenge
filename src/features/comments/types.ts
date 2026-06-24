export type RestaurantComment = {
  name: string;
  rating: number | null;
  body: string;
};

export type CreateRestaurantCommentRequest = {
  rating: number;
  body: string;
};
