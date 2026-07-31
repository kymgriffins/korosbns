import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

const mockGet = vi.fn();
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: mockGet }),
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/hooks/use-auth-actions", () => ({
  useRequestPasswordReset: () => ({ mutateAsync: vi.fn() }),
  useConfirmPasswordReset: () => ({ mutateAsync: vi.fn() }),
}));

import ResetPage from "../page";

describe("ResetPage", () => {
  it("renders request reset form when no token is present", () => {
    mockGet.mockReturnValue(null);
    render(<ResetPage />);
    expect(screen.getByText("Reset password")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("renders confirm reset form when token is present", () => {
    mockGet.mockReturnValue("valid-reset-token");
    render(<ResetPage />);
    expect(screen.getByText("Set new password")).toBeInTheDocument();
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update password/i })).toBeInTheDocument();
  });
});
