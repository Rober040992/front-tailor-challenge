import Image from "next/image";

import { UserMenuDropdown } from "@/features/auth/components/user-menu-dropdown";
import { RestaurantList } from "@/features/restaurants/components/restaurant-list";

export default function RestaurantsPage() {
  return (
    <main className="min-h-screen bg-tailor-black px-4 py-6 text-tailor-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)]">
        <aside
          aria-label="Map placeholder"
          className="relative hidden min-h-[calc(100vh-3rem)] overflow-hidden rounded-tailor-lg border border-tailor-border lg:block"
        >
          <Image
            alt=""
            className="object-cover opacity-55"
            fill
            priority
            sizes="55vw"
            src="/restaurant-detail.png"
          />
          <div className="absolute inset-0 bg-linear-to-t from-tailor-black via-transparent to-transparent" />
          <p className="absolute bottom-8 left-8 rounded-full border border-tailor-blue bg-tailor-black/80 px-5 py-2 text-sm font-bold">
            Map view
          </p>
        </aside>

        <section aria-labelledby="restaurants-heading" className="min-w-0">
          <header className="mb-8 flex items-start justify-between gap-4">
            <Image
              alt="Tailor"
              className="h-auto w-28"
              height={48}
              priority
              src="/Logo.png"
              width={112}
            />
            <UserMenuDropdown />
          </header>

          <RestaurantList />
        </section>
      </div>
    </main>
  );
}
