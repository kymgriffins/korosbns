import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MarketingError from "@/app/(marketing)/error";

describe("MarketingError (upgraded copy)", () => {
  it("does not use the bare 'Could not load content' headline alone", () => {
    render(
      <MarketingError
        error={Object.assign(new Error("NetworkError"), { digest: "abc123" })}
        reset={() => undefined}
      />,
    );
    expect(screen.queryByText("Could not load content")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      /temporarily unavailable|try again|offline/i,
    );
    expect(screen.getByRole("button", { name: /retry|try again/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /home|learn|back/i }).length).toBeGreaterThan(0);
  });
});
