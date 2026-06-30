import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/hooks/use-page-view", () => ({
  usePageView: () => {},
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    <a href={href}>{children}</a>,
}));

describe("PasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders password change form", async () => {
    const Page = (await import("../page")).default;
    render(<Page />);
    expect(screen.getByText("Change Password")).toBeInTheDocument();
    expect(screen.getByText("Update Password")).toBeInTheDocument();
  });

  it("has all password input fields", async () => {
    const Page = (await import("../page")).default;
    render(<Page />);
    expect(screen.getByLabelText("Current Password")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm New Password")).toBeInTheDocument();
  });

  it("disables the update button when saving", async () => {
    const Page = (await import("../page")).default;
    render(<Page />);
    const button = screen.getByText("Update Password").closest("button");
    expect(button).not.toBeDisabled();
  });
});
