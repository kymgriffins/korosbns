import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

const mockGet = vi.fn();
const mockPush = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: mockGet }),
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/hooks/use-auth-actions", () => ({
  useVerifyEmail: () => ({ mutateAsync: mockMutateAsync }),
}));

import VerifyPage from "../page";

describe("VerifyPage", () => {
  it("displays missing token error when no token provided", async () => {
    mockGet.mockReturnValue(null);
    render(<VerifyPage />);
    expect(await screen.findByText("Missing verification token.")).toBeInTheDocument();
  });

  it("calls verify mutation and displays success when token is provided", async () => {
    mockGet.mockReturnValue("valid-verify-token");
    mockMutateAsync.mockResolvedValue({ detail: "Email verified successfully." });

    render(<VerifyPage />);
    expect(await screen.findByText("Email verified successfully.")).toBeInTheDocument();
    expect(mockMutateAsync).toHaveBeenCalledWith("valid-verify-token");
  });
});
