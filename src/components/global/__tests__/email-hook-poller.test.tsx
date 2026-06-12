import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { EmailHookPoller } from "@/components/global/email-hook-poller";

beforeEach(() => {
  vi.useFakeTimers();
  globalThis.fetch = vi.fn();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("EmailHookPoller", () => {
  it("renders null (no DOM output)", () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    const { container } = render(<EmailHookPoller />);
    expect(container.innerHTML).toBe("");
  });

  it("polls immediately on mount", () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    render(<EmailHookPoller />);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/email-hooks/notify",
      { method: "POST" },
    );
  });

  it("polls at regular interval", () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    render(<EmailHookPoller />);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
  });

  it("handles poll failure gracefully", () => {
    vi.mocked(globalThis.fetch).mockRejectedValue(
      new Error("Network error"),
    );

    render(<EmailHookPoller />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it("stops polling on unmount", () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    const { unmount } = render(<EmailHookPoller />);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    unmount();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("logs warning when poll returns non-ok status", async () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(globalThis.fetch).mockResolvedValue(
      { ok: false, status: 500 } as Response,
    );

    render(<EmailHookPoller />);

    await vi.waitFor(() => {
      expect(consoleWarn).toHaveBeenCalledWith(
        "[EmailHookPoller] poll failed",
        500,
      );
    });
    consoleWarn.mockRestore();
  });
});
