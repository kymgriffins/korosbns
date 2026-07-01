import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RequireAuth } from "../require-auth";

vi.mock("@/contexts/auth-context", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/contexts/auth-context";
const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

describe("RequireAuth", () => {
  it("renders children when authenticated", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true, user: { role: { slug: "admin", name: "Admin" } } });
    render(<RequireAuth><div data-testid="child">Protected Content</div></RequireAuth>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.queryByText("Authentication Required")).not.toBeInTheDocument();
  });

  it("renders fallback when not authenticated", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false, user: null });
    render(<RequireAuth><div data-testid="child">Protected Content</div></RequireAuth>);
    expect(screen.getByText("Authentication Required")).toBeInTheDocument();
    expect(screen.getByText("Please sign in to access this feature.")).toBeInTheDocument();
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false, user: null });
    render(
      <RequireAuth fallback={<div data-testid="custom">Custom Fallback</div>}>
        <div data-testid="child">Protected Content</div>
      </RequireAuth>
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
    expect(screen.queryByText("Authentication Required")).not.toBeInTheDocument();
  });

  it("renders sign-in link in default fallback", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false, user: null });
    render(<RequireAuth><div>Protected</div></RequireAuth>);
    const signInLink = screen.getByRole("link", { name: /sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute("href", "/auth/login");
  });

  it("renders access denied when role doesn't match", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true, user: { role: { slug: "viewer", name: "Viewer" } } });
    render(<RequireAuth roles={["admin"]}><div data-testid="child">Admin Content</div></RequireAuth>);
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });

  it("renders children when role matches", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true, user: { role: { slug: "admin", name: "Admin" } } });
    render(<RequireAuth roles={["admin"]}><div data-testid="child">Admin Content</div></RequireAuth>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.queryByText("Access Denied")).not.toBeInTheDocument();
  });
});
