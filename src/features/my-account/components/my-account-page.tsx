"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { UserMenuDropdown } from "@/features/auth/components/user-menu-dropdown";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { LoadingState } from "@/shared/components/states";

import { MyFavouritesSection } from "./my-favourites-section";
import { MyReservationsSection } from "./my-reservations-section";

export function MyAccountPage() {
  const router = useRouter();
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-tailor-black px-5 py-12 text-tailor-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <LoadingState message="Checking your session..." />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-tailor-black text-tailor-white">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-5 py-16 text-center">
          <p className="text-2xl font-bold">Sign in to view your account.</p>
          <button
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-tailor-white px-8 py-3 font-bold text-tailor-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            onClick={() => router.push("/login")}
            type="button"
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-tailor-black text-tailor-white">
      <header className="border-b border-tailor-border bg-tailor-surface/60">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              aria-label="Back to restaurants"
              className="inline-flex rounded-full bg-black/70 p-3 transition hover:bg-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue"
              href="/restaurants"
            >
              <Image alt="Tailor" height={32} src="/Logo.png" width={76} />
            </Link>
            <UserMenuDropdown />
          </div>

          <section className="py-14 sm:py-18" aria-labelledby="account-heading">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-tailor-blue">
              Private area
            </p>
            <h1
              className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl"
              id="account-heading"
            >
              My account
            </h1>
            <dl className="mt-6 flex flex-col gap-4 text-sm sm:flex-row sm:gap-10">
              <div>
                <dt className="font-bold text-tailor-muted">Username</dt>
                <dd className="mt-1 text-lg font-bold text-tailor-white">
                  {user.username}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-tailor-muted">Email</dt>
                <dd className="mt-1 text-lg font-bold text-tailor-white">
                  {user.email}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <MyFavouritesSection />
        <MyReservationsSection />
      </div>
    </main>
  );
}
