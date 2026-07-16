import React from "react";
import { render } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

const mockListAll = vi.hoisted(() => vi.fn());

vi.mock("@/lib/task-api", () => ({
  taskApi: {
    listAll: mockListAll,
    update: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock("@/hooks/use-page-view", () => ({
  usePageView: () => {},
}));

vi.mock("@/lib/route-base", () => ({
  useRouteBase: () => "",
  getFullUrl: (_base: string, path: string) => path,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/task",
}));

vi.mock("@/app/admin/dashboard/kanban/_components/kanban", () => ({
  Kanban: function MockKanban() {
    return React.createElement("div", { "data-testid": "kanban" }, "Kanban");
  },
}));

describe("KanbanPage", () => {
  it("renders without crashing when tasks load", async () => {
    mockListAll.mockResolvedValue([]);
    const Page = (await import("../page")).default;
    const { container } = render(React.createElement(Page));
    expect(container).toBeTruthy();
  });

  it("shows loading skeleton initially", async () => {
    mockListAll.mockReturnValue(new Promise(() => {}));
    const Page = (await import("../page")).default;
    render(React.createElement(Page));
    const skeletons = document.querySelectorAll('[class*="animate"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(1);
  });
});
