type MyAccountFavouriteRestaurant = {
  id: number;
  name: string;
  address: string;
  image: string | null;
};

export type MyAccountFavouriteItem = {
  id: number;
  restaurantId: number;
  createdAt: string;
  restaurant: MyAccountFavouriteRestaurant;
};

export type MyAccountFavouriteListResponse = {
  results: MyAccountFavouriteItem[];
};

export type MyAccountReservation = {
  id: number;
  userId: number;
  restaurantId: number;
  date: string;
  time: string;
  partySize: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
  restaurantName: string;
};

export type MyAccountReservationDetail = MyAccountReservation;
