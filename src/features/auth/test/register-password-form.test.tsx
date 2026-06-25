import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render";

import { RegisterPasswordForm } from "../components/register-password-form";

const mocks = vi.hoisted(() => ({
  clearDetails: vi.fn(),
  registerUser: vi.fn(),
  useRegisterFlow: vi.fn(),
}));

vi.mock("../api/register", () => ({
  registerUser: mocks.registerUser,
}));

vi.mock("../context/register-flow-context", () => ({
  useRegisterFlow: mocks.useRegisterFlow,
}));

describe("RegisterPasswordForm", () => {
  beforeEach(() => {
    mocks.clearDetails.mockReset();
    mocks.registerUser.mockReset();
    mocks.useRegisterFlow.mockReset();
  });

  it("registers with email, username and password only", async () => {
    mocks.registerUser.mockResolvedValue(undefined);
    mocks.useRegisterFlow.mockReturnValue({
      clearDetails: mocks.clearDetails,
      details: {
        email: "newuser@example.com",
        username: "newuser",
      },
      setDetails: vi.fn(),
    });

    renderWithProviders(<RegisterPasswordForm />);

    await userEvent.type(screen.getByLabelText("Password"), "Password123");
    await userEvent.type(
      screen.getByLabelText("Repeat password"),
      "Password123",
    );
    await userEvent.click(screen.getByRole("button", { name: "Finish" }));

    await waitFor(() => {
      expect(mocks.registerUser).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "Password123",
        username: "newuser",
      });
    });
    expect(mocks.registerUser.mock.calls[0][0]).not.toHaveProperty(
      "repeatPassword",
    );
  });
});
