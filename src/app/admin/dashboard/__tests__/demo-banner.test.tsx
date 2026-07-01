import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DemoBanner } from "@/components/admin/demo-banner";

describe("DemoBanner", () => {
  it("renders the demo warning message", () => {
    render(<DemoBanner />);
    expect(screen.getByText(/demo template page/i)).toBeInTheDocument();
    expect(screen.getByText(/no real data is displayed/i)).toBeInTheDocument();
    expect(screen.getByText(/remove or replace/i)).toBeInTheDocument();
  });

  it("has a warning role or styling", () => {
    const { container } = render(<DemoBanner />);
    const banner = container.firstChild as HTMLElement;
    expect(banner.className).toContain("bg-amber");
  });
});
