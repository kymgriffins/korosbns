import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import WhatsAppSupport from "../whatsapp-support";

const pathnameMock = vi.fn(() => "/");

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

describe("WhatsAppSupport", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    pathnameMock.mockReturnValue("/");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renders icon-only WhatsApp link with accessible label (no popover copy)", async () => {
    render(<WhatsAppSupport />);

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    const link = screen.getByRole("link", { name: /Chat with us on WhatsApp/i });
    expect(link).toHaveAttribute("href", "https://wa.me/254790631623");
    expect(link).toHaveAttribute("aria-label", "Chat with us on WhatsApp");

    const root = screen.getByTestId("whatsapp-support");
    expect(root.getAttribute("data-variant")).toBe("icon-only");

    expect(screen.queryByText(/Chat with us/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Usually replies in minutes/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Close WhatsApp/i }),
    ).not.toBeInTheDocument();
  });

  it("stays hidden on learn routes", () => {
    pathnameMock.mockReturnValue("/learn");
    const { container } = render(<WhatsAppSupport />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(container).toBeEmptyDOMElement();
  });
});
