import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { YearTabs } from "../year-tabs";
import type { BudgetNewsYear } from "@/lib/learn-hub";

const mockYears: BudgetNewsYear[] = [
  {
    fiscal_year_id: "1",
    label: "FY2025/26",
    fiscal_year_num: 2025,
    is_current: false,
    module_slug: "fy2025-26",
    module_title: "FY2025/26 Analysis",
    chapter_count: 3,
    prev_module_slug: null,
    prev_module_label: null,
    next_module_slug: "fy2026-27",
    next_module_label: "FY2026/27",
  },
  {
    fiscal_year_id: "2",
    label: "FY2026/27",
    fiscal_year_num: 2026,
    is_current: true,
    module_slug: "fy2026-27",
    module_title: "FY2026/27 Analysis",
    chapter_count: 5,
    prev_module_slug: "fy2025-26",
    prev_module_label: "FY2025/26",
    next_module_slug: null,
    next_module_label: null,
  },
  {
    fiscal_year_id: "3",
    label: "FY2027/28",
    fiscal_year_num: 2027,
    is_current: false,
    module_slug: "fy2027-28",
    module_title: "FY2027/28 Analysis",
    chapter_count: 0,
    prev_module_slug: "fy2026-27",
    prev_module_label: "FY2026/27",
    next_module_slug: null,
    next_module_label: null,
  },
];

describe("YearTabs", () => {
  it("renders all years", () => {
    render(<YearTabs years={mockYears} selectedLabel={null} onSelect={() => {}} />);
    expect(screen.getByText("FY2025/26")).toBeInTheDocument();
    expect(screen.getByText("FY2026/27")).toBeInTheDocument();
    expect(screen.getByText("FY2027/28")).toBeInTheDocument();
  });

  it("highlights the selected year", () => {
    render(<YearTabs years={mockYears} selectedLabel="FY2026/27" onSelect={() => {}} />);
    const selected = screen.getByText("FY2026/27").closest("button");
    expect(selected?.className).toContain("bg-primary");
  });

  it("shows chapter count badge for years with chapters", () => {
    render(<YearTabs years={mockYears} selectedLabel={null} onSelect={() => {}} />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("hides chapter count badge when count is 0", () => {
    render(<YearTabs years={mockYears} selectedLabel={null} onSelect={() => {}} />);
    const fy2027 = screen.getByText("FY2027/28").closest("button");
    const badge = fy2027?.querySelector("span:last-child");
    expect(badge?.textContent).not.toBe("0");
  });

  it("shows ping dot for current year", () => {
    render(<YearTabs years={mockYears} selectedLabel={null} onSelect={() => {}} />);
    const container = screen.getByText("FY2026/27").parentElement;
    expect(container?.innerHTML).toContain("animate-ping");
  });

  it("calls onSelect when year tab is clicked", () => {
    const onSelect = vi.fn();
    render(<YearTabs years={mockYears} selectedLabel={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("FY2025/26"));
    expect(onSelect).toHaveBeenCalledWith("FY2025/26");
  });

  it("returns null when years array is empty", () => {
    const { container } = render(<YearTabs years={[]} selectedLabel={null} onSelect={() => {}} />);
    expect(container.innerHTML).toBe("");
  });
});

describe("YearTabs edge cases", () => {
  it("handles all years with zero chapters", () => {
    const zeroYears = mockYears.map((y) => ({ ...y, chapter_count: 0 }));
    render(<YearTabs years={zeroYears} selectedLabel={null} onSelect={() => {}} />);
    expect(screen.getByText("FY2025/26")).toBeInTheDocument();
    expect(screen.getByText("FY2026/27")).toBeInTheDocument();
    expect(screen.queryByText("3")).not.toBeInTheDocument();
    expect(screen.queryByText("5")).not.toBeInTheDocument();
  });

  it("handles single year", () => {
    const singleYear = [mockYears[0]];
    render(<YearTabs years={singleYear} selectedLabel={null} onSelect={() => {}} />);
    expect(screen.getByText("FY2025/26")).toBeInTheDocument();
  });

  it("handles null selectedLabel without crashing", () => {
    render(<YearTabs years={mockYears} selectedLabel={null} onSelect={() => {}} />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });
});
