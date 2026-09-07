import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextRevealOnScroll } from "../text-reveal-on-scroll";

describe("TextRevealOnScroll Primitive", () => {
  it("renders text with accessibility region and label", () => {
    const text = "Within 4 hours of the Treasury release, BNS flags public debt discrepancy.";
    render(<TextRevealOnScroll text={text} />);

    const region = screen.getByRole("region", { name: text });
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-label", text);
  });

  it("splits text into word tokens in default mode", () => {
    const text = "Tracking the public shilling";
    const { container } = render(<TextRevealOnScroll text={text} mode="word" />);

    // Check that words exist inside aria-hidden container
    const ariaHidden = container.querySelector('[aria-hidden="true"]');
    expect(ariaHidden).toBeInTheDocument();
    expect(ariaHidden?.textContent).toContain("Tracking");
    expect(ariaHidden?.textContent).toContain("public");
    expect(ariaHidden?.textContent).toContain("shilling");
  });

  it("renders as custom element such as h2 or blockquote", () => {
    const text = "Sovereign citizen scrutiny across 47 counties";
    render(<TextRevealOnScroll text={text} as="h2" />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute("aria-label", text);
  });

  it("handles sentence mode splitting cleanly", () => {
    const text = "The Treasury published 400 pages. We distilled it into 3 signals. Citizens mobilized.";
    const { container } = render(<TextRevealOnScroll text={text} mode="sentence" />);

    const ariaHidden = container.querySelector('[aria-hidden="true"]');
    expect(ariaHidden?.textContent).toContain("The Treasury published 400 pages.");
    expect(ariaHidden?.textContent).toContain("We distilled it into 3 signals.");
  });
});
