import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render";

import { LoginForm } from "../components/login-form";

const mocks = vi.hoisted(() => ({
  loginUser: vi.fn(),
  refreshUser: vi.fn(),
  useAuth: vi.fn(),
}));

vi.mock("../api/login", () => ({
  loginUser: mocks.loginUser,
}));

vi.mock("../hooks/use-auth", () => ({
  useAuth: mocks.useAuth,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mocks.loginUser.mockReset();
    mocks.refreshUser.mockReset();
    mocks.useAuth.mockReturnValue({
      error: null,
      isLoading: false,
      refreshUser: mocks.refreshUser,
      user: null,
    });
  });

  it("sends username and password", async () => {
    mocks.loginUser.mockResolvedValue(undefined);
    mocks.refreshUser.mockResolvedValue(undefined);
    renderWithProviders(<LoginForm />);

    await userEvent.type(screen.getByLabelText("Username"), " aida ");
    await userEvent.type(screen.getByLabelText("Password"), "Password123");
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(mocks.loginUser).toHaveBeenCalledWith({
        password: "Password123",
        username: "aida",
      });
    });
    expect(mocks.refreshUser).toHaveBeenCalled();
  });

  it("shows the backend invalid credentials message", async () => {
    mocks.loginUser.mockRejectedValue({
      error: "UNAUTHORIZED",
      message: "Invalid username or password.",
      statusCode: 401,
    });
    renderWithProviders(<LoginForm />);

    await userEvent.type(screen.getByLabelText("Username"), "aida");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(
      await screen.findByText("Invalid username or password."),
    ).toBeInTheDocument();
  });
});
