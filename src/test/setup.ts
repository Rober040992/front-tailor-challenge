import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

const routerMock = {
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
};

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => routerMock,
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  }) => React.createElement("a", { href, ...props }, children),
}));

vi.mock("next/image", () => ({
  default: (
    imageProps: React.ImgHTMLAttributes<HTMLImageElement> & {
      fill?: boolean;
      priority?: boolean;
      unoptimized?: boolean;
    },
  ) => {
    const { alt, height, src, width, ...props } = imageProps;
    delete props.fill;
    delete props.priority;
    delete props.sizes;
    delete props.unoptimized;

    return React.createElement("img", {
      alt,
      height,
      src: typeof src === "string" ? src : "",
      width,
      ...props,
    });
  },
}));

afterEach(() => {
  cleanup();
  Object.values(routerMock).forEach((mock) => mock.mockReset());
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
