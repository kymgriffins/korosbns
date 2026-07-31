import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/shadcn-space/blocks/forgot-password-01/forgot-password", () => ({
  default: () => <div data-testid="forgot-password-component">Forgot Password Form</div>,
}));

import ForgotPasswordPage from "../page";

describe("ForgotPasswordPage", () => {
  it("renders the forgot password component cleanly", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByTestId("forgot-password-component")).toBeInTheDocument();
  });
});
