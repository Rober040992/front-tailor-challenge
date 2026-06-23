import { RestaurantDetailPage } from "@/features/restaurants/components/restaurant-detail-page";
import { ErrorState } from "@/shared/components/states";

type RestaurantPageProps = {
  params: Promise<{
    restaurantId: string;
  }>;
};

export default async function RestaurantPage({
  params,
}: RestaurantPageProps) {
  const { restaurantId: restaurantIdParam } = await params;
  const restaurantId = Number(restaurantIdParam);
  const isValidRestaurantId =
    Number.isInteger(restaurantId) && restaurantId > 0;

  if (!isValidRestaurantId) {
    return (
      <main className="min-h-screen bg-tailor-black px-4 py-20 text-tailor-white sm:px-6">
        <div className="mx-auto max-w-3xl">
          <ErrorState
            message="The restaurant identifier must be a positive number."
            title="Invalid restaurant."
          />
        </div>
      </main>
    );
  }

  return <RestaurantDetailPage restaurantId={restaurantId} />;
}
