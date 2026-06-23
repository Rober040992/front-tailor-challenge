"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Dropdown } from "@/shared/components/dropdown";

import { logoutUser } from "../api/logout";
import { useAuth } from "../hooks/use-auth";

const ARROW_DOWN = "\u2193";
const ARROW_UP = "\u2191";

export type UserMenuDropdownProps = Readonly<{
  username: string;
}>;

const userMenuItemClassName =
  "block w-full cursor-pointer px-4 py-3 text-left text-sm font-bold text-tailor-white transition hover:bg-blue-500 focus-visible:bg-blue-500 focus-visible:outline-none";

function AuthenticatedUserMenuDropdown({
  username,
}: UserMenuDropdownProps) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [isLogoutPending, setIsLogoutPending] = useState(false);
  const [logoutErrorMessage, setLogoutErrorMessage] = useState<string | null>(
    null,
  );

  async function handleLogout() {
    if (isLogoutPending) {
      return;
    }

    setIsLogoutPending(true);
    setLogoutErrorMessage(null);

    try {
      await logoutUser();
      await refreshUser();
      router.push("/login");
      router.refresh();
    } catch {
      setLogoutErrorMessage("Logout failed. Please try again.");
      setIsLogoutPending(false);
    }
  }

  return (
    <Dropdown
      renderTriggerContent={(isOpen) => (
        <span className="inline-flex items-center gap-2">
          <span className="max-w-40 truncate">{username}</span>
          <span aria-hidden="true">{isOpen ? ARROW_UP : ARROW_DOWN}</span>
        </span>
      )}
      triggerButtonClassName="inline-flex min-h-11 items-center rounded-full border border-tailor-border bg-tailor-surface px-3 text-sm font-bold text-tailor-white transition hover:border-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue"
    >
      <Link className={userMenuItemClassName} href="/account" role="menuitem">
        My account
      </Link>
      <Link
        className={userMenuItemClassName}
        href="/restaurants/new"
        role="menuitem"
      >
        Add restaurant
      </Link>
      <button
        className={`${userMenuItemClassName} disabled:cursor-not-allowed disabled:opacity-60`}
        disabled={isLogoutPending}
        onClick={handleLogout}
        role="menuitem"
        type="button"
      >
        {isLogoutPending ? "Logging out..." : "Log out"}
      </button>
      {logoutErrorMessage && (
        <p className="border-t border-tailor-border px-4 py-3 text-sm font-bold text-tailor-error">
          {logoutErrorMessage}
        </p>
      )}
    </Dropdown>
  );
}

export function UserMenuDropdown() {
  const { error, isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  const username = user?.username?.trim();

  if (error || !username) {
    return (
      <Link
        className="inline-flex min-h-11 items-center rounded-full border border-tailor-border bg-tailor-surface px-4 py-2 text-sm font-bold text-tailor-white transition hover:border-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue"
        href="/register"
      >
        Don&apos;t have an account yet?
      </Link>
    );
  }

  return <AuthenticatedUserMenuDropdown username={username} />;
}
