import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render";

import { CreateCommentForm } from "../components/create-comment-form";

const mocks = vi.hoisted(() => ({
  createCommentRequest: vi.fn(),
  refreshUser: vi.fn(),
  useAuth: vi.fn(),
  useCreateRestaurantCommentRequest: vi.fn(),
}));

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: mocks.useAuth,
}));

vi.mock("../hooks/use-create-restaurant-comment-request", () => ({
  useCreateRestaurantCommentRequest: mocks.useCreateRestaurantCommentRequest,
}));

describe("CreateCommentForm", () => {
  beforeEach(() => {
    mocks.createCommentRequest.mockReset();
    mocks.refreshUser.mockReset();
    mocks.useAuth.mockReturnValue({
      isLoading: false,
      refreshUser: mocks.refreshUser,
      user: {
        email: "aida@example.com",
        id: 1,
        username: "aida",
      },
    });
    mocks.useCreateRestaurantCommentRequest.mockReturnValue({
      createCommentRequest: mocks.createCommentRequest,
      isPending: false,
    });
  });

  it("validates rating and body", async () => {
    renderWithProviders(<CreateCommentForm restaurantId={7} />);

    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByText("Select a rating.")).toBeInTheDocument();
    expect(screen.getByText("Write a comment.")).toBeInTheDocument();
    expect(mocks.createCommentRequest).not.toHaveBeenCalled();
  });

  it("sends rating and body and shows success feedback", async () => {
    mocks.createCommentRequest.mockResolvedValue(undefined);
    renderWithProviders(<CreateCommentForm restaurantId={7} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Select 4 star rating" }),
    );
    await userEvent.type(screen.getByLabelText("Comment"), " Great food ");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(mocks.createCommentRequest).toHaveBeenCalledWith({
        body: "Great food",
        rating: 4,
      });
    });
    expect(await screen.findByText("comment sent!")).toBeInTheDocument();
  });
});
