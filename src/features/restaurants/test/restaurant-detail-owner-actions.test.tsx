import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render";

import { RestaurantDetailPage } from "../detail/components/restaurant-detail-page";
import type { RestaurantDetail } from "../shared/types";

const mocks = vi.hoisted(() => ({
  useDeleteRestaurant: vi.fn(),
  useRestaurant: vi.fn(),
}));

vi.mock("../detail/hooks/use-restaurant", () => ({
  useRestaurant: mocks.useRestaurant,
}));

vi.mock("../delete/hooks/use-delete-restaurant", () => ({
  useDeleteRestaurant: mocks.useDeleteRestaurant,
}));

vi.mock("@/features/auth/components/user-menu-dropdown", () => ({
  UserMenuDropdown: () => <div>User menu</div>,
}));

vi.mock("@/features/comments/components/create-comment-form", () => ({
  CreateCommentForm: () => <div>Create comment form</div>,
}));

vi.mock("@/features/comments/components/comment-list", () => ({
  CommentList: () => <div>Comment list</div>,
}));

vi.mock("../detail/components/restaurant-hero", () => ({
  RestaurantHero: () => <div>Restaurant hero</div>,
}));

const restaurant: RestaurantDetail = {
  address: "Carrer de Mallorca 1",
  averageRating: null,
  canEdit: true,
  commentsCount: 0,
  description: "Seasonal food.",
  id: 7,
  image: null,
  name: "Tailor Table",
};

describe("RestaurantDetailPage owner actions", () => {
  beforeEach(() => {
    mocks.useDeleteRestaurant.mockReturnValue({
      closeErrorPopup: vi.fn(),
      errorMessage: null,
      handleDelete: vi.fn(),
      isPending: false,
    });
  });

  it("shows edit and delete actions only when canEdit is true", () => {
    mocks.useRestaurant.mockReturnValue({
      data: restaurant,
      error: undefined,
      isLoading: false,
    });

    const { rerender } = renderWithProviders(
      <RestaurantDetailPage restaurantId={7} />,
    );

    expect(
      screen.getByRole("link", { name: "Edit restaurant" }),
    ).toHaveAttribute("href", "/restaurants/7/edit");
    expect(
      screen.getByRole("button", { name: "Delete restaurant" }),
    ).toBeInTheDocument();

    mocks.useRestaurant.mockReturnValue({
      data: {
        ...restaurant,
        canEdit: false,
      },
      error: undefined,
      isLoading: false,
    });

    rerender(<RestaurantDetailPage restaurantId={7} />);

    expect(screen.queryByRole("link", { name: "Edit restaurant" })).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Delete restaurant" }),
    ).toBeNull();
  });
});
