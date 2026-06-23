import Image from "next/image";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
};

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <main className="min-h-svh bg-tailor-black p-4 font-tailor sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-7xl gap-4 sm:min-h-[calc(100svh-3rem)] lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(22rem,0.82fr)_minmax(0,1.18fr)]">
        <section className="flex flex-col self-end rounded-tailor-lg bg-tailor-blue p-6 text-tailor-white sm:p-10 lg:p-10">
          <Image
            src="/Logo.png"
            alt="Tailor"
            width={194}
            height={44}
            priority
            className="h-auto w-36 sm:w-40"
          />

          <div className="py-1">
            <div className="w-full">
              <h1 className="max-w-md text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                {title}
              </h1>
              <div className="mt-9">{children}</div>
            </div>
          </div>
        </section>

        <section
          className="relative hidden min-h-152 overflow-hidden rounded-tailor-lg bg-tailor-surface lg:block"
          aria-label="Restaurant atmosphere"
        >
          <Image
            src="/side-form-2.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-black/10"
            aria-hidden="true"
          />
        </section>
      </div>
    </main>
  );
}
