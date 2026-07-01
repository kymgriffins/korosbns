import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InlineError } from "../inline-error";

describe("InlineError", () => {
  it("renders default message when no message prop", () => {
    render(<InlineError />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(<InlineError message="Custom error message" />);
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("shows error detail when error is a string", () => {
    render(<InlineError message="Failed" error="Network error occurred" />);
    expect(screen.getByText("Network error occurred")).toBeInTheDocument();
  });

  it("shows error detail when error is an Error instance", () => {
    render(<InlineError message="Failed" error={new Error("Something broke")} />);
    expect(screen.getByText("Something broke")).toBeInTheDocument();
  });

  it("retry button appears when onRetry is provided", () => {
    const onRetry = vi.fn();
    render(<InlineError onRetry={onRetry} />);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("retry button calls onRetry when clicked", () => {
    const onRetry = vi.fn();
    render(<InlineError onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not render retry button without onRetry", () => {
    render(<InlineError />);
    expect(screen.queryByRole("button", { name: /try again/i })).not.toBeInTheDocument();
  });

  it("compact variant renders with smaller text", () => {
    const { container } = render(<InlineError compact />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("p-3");
  });
});
