"use client";

import Image from "next/image";
import Link from "next/link";

type RestaurantResultPopupProps = {
  buttonLabel: string;
  message: string;
  href?: string;
  onClick?: () => void;
};

export function RestaurantResultPopup({
  buttonLabel,
  href,
  message,
  onClick,
}: RestaurantResultPopupProps) {
  const buttonClassName =
    "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-tailor-white px-7 py-3 text-center font-bold text-tailor-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto";

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-tailor-lg border border-tailor-border bg-tailor-black px-8 py-10 text-center shadow-2xl">
        <Image
          alt="Tailor"
          className="mx-auto h-auto w-28"
          height={48}
          priority
          src="/Logo.png"
          width={112}
        />
        <p className="mt-10 text-2xl font-bold text-tailor-white">
          {message}
        </p>
        <div className="mt-10">
          {href ? (
            <Link className={buttonClassName} href={href}>
              {buttonLabel}
            </Link>
          ) : (
            <button
              className={buttonClassName}
              onClick={onClick}
              type="button"
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
