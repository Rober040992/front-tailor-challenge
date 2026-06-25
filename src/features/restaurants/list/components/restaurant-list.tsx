import type { RestaurantListItem } from "../../shared/types";
import { RestaurantCard } from "./restaurant-card";

type RestaurantListProps = {
  onRestaurantSelect: (restaurant: RestaurantListItem) => void;
  restaurants: RestaurantListItem[];
  selectedRestaurantId: number | null;
};

export function RestaurantList({
  onRestaurantSelect,
  restaurants,
  selectedRestaurantId,
}: RestaurantListProps) {
  return (
    <div className="space-y-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          isSelected={selectedRestaurantId === restaurant.id}
          key={restaurant.id}
          onSelect={onRestaurantSelect}
          restaurant={restaurant}
        />
      ))}
    </div>
  );
}
