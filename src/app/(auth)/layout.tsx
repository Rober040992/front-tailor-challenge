import type { ReactNode } from "react";

import { RegisterFlowProvider } from "@/features/auth/context/register-flow-context";

type AuthRoutesLayoutProps = {
  children: ReactNode;
};

export default function AuthRoutesLayout({
  children,
}: AuthRoutesLayoutProps) {
  return <RegisterFlowProvider>{children}</RegisterFlowProvider>;
}
