import Image from "next/image";

import { CreateRestaurantForm } from "@/features/restaurants/create/components/create-restaurant-form";

export default function NewRestaurantPage() {
  return (
    <main className="flex min-h-screen flex-col bg-tailor-black text-tailor-white">
      <header className="flex justify-center px-5 py-6">
        <Image
          alt="Tailor"
          className="h-auto w-28"
          height={48}
          priority
          src="/Logo.png"
          width={112}
        />
      </header>

      <section
        aria-label="Create restaurant"
        className="flex flex-1 items-center"
      >
        <CreateRestaurantForm />
      </section>

      <footer className="flex justify-center px-5 py-6">
        <Image
          alt="Tailor"
          className="h-auto w-28"
          height={48}
          src="/Logo.png"
          width={112}
        />
      </footer>
    </main>
  );
}
