import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { CourseLandingView } from "../course-landing-view";

vi.mock("next/navigation", () => ({
  useParams: () => ({ slug: "budget-policy-statement" }),
}));

vi.mock("@/components/ui/progress", () => ({
  Progress: ({ value }: { value: number }) => <div data-testid="progress-bar" data-value={value} />,
}));

describe("CourseLandingView", () => {
  it("renders punchy civic intro, fast stats, and enrollment CTA for BPS", async () => {
    render(<CourseLandingView />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: /Before Budget Day/i })
      ).toBeInTheDocument();
    });

    // 1. Verify punchy hook tagline
    expect(
      screen.getByText(/95% of Kenya's national budget is decided before June/i)
    ).toBeInTheDocument();

    // 2. Verify statutory urgency pill
    expect(
      screen.getByText(/Feb 15th Statutory Deadline/i)
    ).toBeInTheDocument();

    // 3. Verify high-conversion enrollment CTA buttons (hero card & bottom banner)
    const ctaButtons = screen.getAllByRole("link", { name: /Start Module/i });
    expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
    expect(ctaButtons[0]).toHaveAttribute("href", expect.stringContaining("/learn/modules/budget-policy-statement/"));

    // 4. Verify core competencies / What You'll Master
    expect(screen.getByText(/What You'll Master/i)).toBeInTheDocument();
    expect(screen.getByText(/The February Window/i)).toBeInTheDocument();
    expect(screen.getByText(/Audit Sector Ceilings/i)).toBeInTheDocument();

    // 5. Verify syllabus chapters
    expect(screen.getByText(/Course Syllabus/i)).toBeInTheDocument();
  });
});
