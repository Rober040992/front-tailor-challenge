"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
} from "react";
import useSWR from "swr";

import { getCurrentUser } from "../api/get-current-user";
import type { CurrentUser } from "../types";

type AuthContextValue = {
  error: unknown;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  user: CurrentUser | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = Readonly<{
  children: ReactNode;
}>;

export function AuthProvider({ children }: AuthProviderProps) {
  const { data, error, isLoading, mutate } = useSWR<CurrentUser | null>(
    "auth/me",
    getCurrentUser,
  );

  const refreshUser = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      error,
      isLoading,
      refreshUser,
      user: data ?? null,
    }),
    [data, error, isLoading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
