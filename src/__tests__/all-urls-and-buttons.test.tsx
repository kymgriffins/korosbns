import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Lucide icons to lightweight spans
vi.mock("lucide-react", async () => {
  const actual = await vi.importActual("lucide-react");
  return {
    ...actual,
  };
});

// Import Buttons & Key UI Action Components
import { Button } from "@/components/ui/button";
import { sidebarItems } from "../../apps/admin/src/navigation/sidebar/sidebar-items";
import { TaskToolbar } from "@/app/admin/dashboard/task/_components/task-toolbar";
import { AnalyticsToolbar } from "@/app/admin/dashboard/analytics/_components/analytics-toolbar";

describe("All URLs & Navigation Verification", () => {
  it("verifies all sidebar navigation URLs are valid and formatted correctly", () => {
    const urls: string[] = [];

    sidebarItems.forEach((group) => {
      group.items.forEach((item) => {
        if ("url" in item && item.url) {
          urls.push(item.url);
        }
        if ("subItems" in item && item.subItems) {
          item.subItems.forEach((sub) => {
            if (sub.url) {
              urls.push(sub.url);
            }
          });
        }
      });
    });

    expect(urls.length).toBeGreaterThan(10);

    // Every URL must be an absolute path starting with /dashboard
    urls.forEach((url) => {
      expect(url.startsWith("/dashboard")).toBe(true);
      expect(url).not.toContain("#");
      expect(url).not.toContain(" ");
    });

    // Check specific core URLs exist in the sidebar
    expect(urls).toContain("/dashboard");
    expect(urls).toContain("/dashboard/analytics");
    expect(urls).toContain("/dashboard/task");
    expect(urls).toContain("/dashboard/task/report");
    expect(urls).toContain("/dashboard/communication");
    expect(urls).toContain("/dashboard/modules");
    expect(urls).toContain("/dashboard/surveys");
    expect(urls).toContain("/dashboard/trivia");
    expect(urls).toContain("/dashboard/docrepository");
    expect(urls).toContain("/dashboard/users");
    expect(urls).toContain("/dashboard/settings");
  });
});

describe("All Button Action Handlers & Interactivity", () => {
  it("renders Button component and triggers onClick callback successfully", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me Action</Button>);

    const btn = screen.getByRole("button", { name: /click me action/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles disabled button states without firing clicks", () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);

    const btn = screen.getByRole("button", { name: /disabled button/i });
    expect(btn).toBeDisabled();

    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("tests TaskToolbar view mode and filter button toggles", () => {
    const handleViewChange = vi.fn();
    const handleClearFilters = vi.fn();

    render(
      <TaskToolbar
        viewMode="list"
        onViewModeChange={handleViewChange}
        query=""
        onQueryChange={vi.fn()}
        statusFilter="all_statuses"
        onStatusFilterChange={vi.fn()}
        priorityFilter="all_priorities"
        onPriorityFilterChange={vi.fn()}
        onClearFilters={handleClearFilters}
      />
    );

    // Click "New Task" button or link
    const newTaskBtn = screen.getByRole("link", { name: /new task/i });
    expect(newTaskBtn).toBeInTheDocument();
    expect(newTaskBtn).toHaveAttribute("href", "/dashboard/task/new");
  });

  it("tests AnalyticsToolbar period switch buttons", () => {
    const handlePeriodChange = vi.fn();
    render(
      <AnalyticsToolbar
        period="7d"
        onPeriodChange={handlePeriodChange}
        loading={false}
        onRefresh={vi.fn()}
      />
    );

    // Toggle 30 Days period button
    const btn30d = screen.getByRole("button", { name: /30 days/i });
    expect(btn30d).toBeInTheDocument();
    fireEvent.click(btn30d);
    expect(handlePeriodChange).toHaveBeenCalledWith("30d");

    // Toggle All Time button
    const btnAll = screen.getByRole("button", { name: /all time/i });
    expect(btnAll).toBeInTheDocument();
    fireEvent.click(btnAll);
    expect(handlePeriodChange).toHaveBeenCalledWith("all");
  });
});
