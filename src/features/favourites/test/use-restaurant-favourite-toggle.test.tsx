import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useRestaurantFavouriteToggle } from "../hooks/use-restaurant-favourite-toggle";

const mocks = vi.hoisted(() => ({
  addFavourite: vi.fn(),
  mutate: vi.fn(),
  refreshUser: vi.fn(),
  removeFavourite: vi.fn(),
  useAuth: vi.fn(),
  useSWR: vi.fn(),
}));

vi.mock("swr", () => ({
  default: mocks.useSWR,
}));

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: mocks.useAuth,
}));

vi.mock("../api/add-favourite", () => ({
  addFavourite: mocks.addFavourite,
}));

vi.mock("../api/remove-favourite", () => ({
  removeFavourite: mocks.removeFavourite,
}));

describe("useRestaurantFavouriteToggle", () => {
  beforeEach(() => {
    mocks.addFavourite.mockReset();
    mocks.mutate.mockReset();
    mocks.refreshUser.mockReset();
    mocks.removeFavourite.mockReset();
    mocks.useAuth.mockReturnValue({
      isLoading: false,
      refreshUser: mocks.refreshUser,
      user: {
        email: "aida@example.com",
        id: 1,
        username: "aida",
      },
    });
    mocks.useSWR.mockReturnValue({
      data: { results: [] },
      error: undefined,
      isLoading: false,
      mutate: mocks.mutate,
    });
    mocks.mutate.mockResolvedValue(undefined);
  });

  it("adds favourites using the restaurant id", async () => {
    mocks.addFavourite.mockResolvedValue({
      createdAt: "2026-06-25T10:00:00.000Z",
      id: 10,
      restaurantId: 7,
    });
    const { result } = renderHook(() => useRestaurantFavouriteToggle(7));

    await act(async () => result.current.handleToggle());

    expect(mocks.addFavourite).toHaveBeenCalledWith(7);
    expect(result.current.isFavourite).toBe(true);
  });

  it("removes favourites using the restaurant id", async () => {
    mocks.useSWR.mockReturnValue({
      data: {
        results: [
          {
            createdAt: "2026-06-25T10:00:00.000Z",
            id: 10,
            restaurantId: 7,
          },
        ],
      },
      error: undefined,
      isLoading: false,
      mutate: mocks.mutate,
    });
    mocks.removeFavourite.mockResolvedValue(undefined);
    const { result } = renderHook(() => useRestaurantFavouriteToggle(7));

    await act(async () => result.current.handleToggle());

    expect(mocks.removeFavourite).toHaveBeenCalledWith(7);
    expect(result.current.isFavourite).toBe(false);
  });

  it("keeps the restaurant favourited after a duplicate conflict", async () => {
    mocks.addFavourite.mockRejectedValue({
      message: "Restaurant is already a favourite.",
      statusCode: 409,
    });
    const { result } = renderHook(() => useRestaurantFavouriteToggle(7));

    await act(async () => result.current.handleToggle());

    expect(result.current.isFavourite).toBe(true);
    expect(result.current.errorMessage).toBe(
      "Restaurant is already a favourite.",
    );
  });
});
