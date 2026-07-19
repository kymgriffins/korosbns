import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SignUpCta } from "../sign-up-cta";

const authState = { isLoggedIn: false, loading: false };

vi.mock("@/contexts/auth-context", () => ({
  useAuth: () => authState,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const store: Record<string, string> = {};

describe("SignUpCta soft login (P0 Free read)", () => {
  beforeEach(() => {
    authState.isLoggedIn = false;
    authState.loading = false;
    for (const k of Object.keys(store)) delete store[k];
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => {
          store[k] = String(v);
        },
        removeItem: (k: string) => {
          delete store[k];
        },
      },
    });
  });

  it("does not claim content is locked or unlocked by login", async () => {
    render(<SignUpCta />);
    const cta = await screen.findByTestId("soft-login-cta");
    expect(cta.textContent?.toLowerCase()).not.toMatch(/unlock/);
    expect(cta.textContent?.toLowerCase()).toMatch(/free/);
    expect(cta.textContent?.toLowerCase()).toMatch(/without signing in|stay free|free to read/);
  });

  it("is dismissible and stays dismissed", async () => {
    const { unmount } = render(<SignUpCta dismissKey="test-dismiss" />);
    await screen.findByTestId("soft-login-cta");
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(screen.queryByTestId("soft-login-cta")).toBeNull();
    expect(store["test-dismiss"]).toBe("1");
    unmount();
    render(<SignUpCta dismissKey="test-dismiss" />);
    expect(screen.queryByTestId("soft-login-cta")).toBeNull();
  });

  it("hides when logged in", () => {
    authState.isLoggedIn = true;
    render(<SignUpCta />);
    expect(screen.queryByTestId("soft-login-cta")).toBeNull();
  });
});
