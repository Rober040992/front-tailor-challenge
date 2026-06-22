import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-tailor-black p-4 font-tailor text-tailor-black sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.2fr)]">
        <section className="flex flex-col justify-center rounded-tailor-lg bg-tailor-white p-8 sm:p-10 lg:p-12">
          <div className="flex flex-col gap-12">
            <div className="w-fit rounded-2xl bg-tailor-blue px-5 py-4">
              <Image
                src="/Logo.png"
                alt="Tailor"
                width={200}
                height={48}
                priority
                className="h-auto w-36 sm:w-40"
              />
            </div>

            <div className="max-w-md">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-tailor-blue">
                Welcome
              </p>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Your table is waiting.
              </h1>
              <p className="mt-5 max-w-sm text-base leading-7 text-tailor-muted sm:text-lg">
                Discover restaurants and find the right place for your next
                meal.
              </p>
            </div>

            <Link
              href="/restaurants"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-tailor-blue px-8 py-3 font-bold text-tailor-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue sm:w-fit"
            >
              Enter
            </Link>
          </div>
        </section>

        <section
          className="relative hidden min-h-128 overflow-hidden rounded-tailor-lg bg-tailor-surface md:block"
          aria-label="Restaurant atmosphere"
        >
          <Image
            src="/side-forms.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10"
            aria-hidden="true"
          />
        </section>
      </div>
    </main>
  );
}
