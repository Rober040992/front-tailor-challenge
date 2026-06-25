import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { SWRConfig } from "swr";

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(
    <SWRConfig
      value={{
        dedupingInterval: 0,
        provider: () => new Map(),
      }}
    >
      {ui}
    </SWRConfig>,
    options,
  );
}
