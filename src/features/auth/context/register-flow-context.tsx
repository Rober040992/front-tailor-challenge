"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import type { RegisterDetails } from "../types";

type RegisterFlowContextValue = {
  details: RegisterDetails | null;
  clearDetails: () => void;
  setDetails: (details: RegisterDetails) => void;
};

const RegisterFlowContext = createContext<RegisterFlowContextValue | null>(
  null,
);

type RegisterFlowProviderProps = {
  children: ReactNode;
};

export function RegisterFlowProvider({
  children,
}: RegisterFlowProviderProps) {
  const [details, setDetails] = useState<RegisterDetails | null>(null);

  const value = useMemo(
    () => ({
      details,
      clearDetails: () => setDetails(null),
      setDetails,
    }),
    [details],
  );

  return (
    <RegisterFlowContext.Provider value={value}>
      {children}
    </RegisterFlowContext.Provider>
  );
}

export function useRegisterFlow(): RegisterFlowContextValue {
  const context = useContext(RegisterFlowContext);

  if (!context) {
    throw new Error(
      "useRegisterFlow must be used within a RegisterFlowProvider.",
    );
  }

  return context;
}
