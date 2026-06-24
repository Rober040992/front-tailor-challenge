export type FavouriteItem = {
  id: number;
  restaurantId: number;
  createdAt: string;
};

export type FavouriteListResponse = {
  results: FavouriteItem[];
};
