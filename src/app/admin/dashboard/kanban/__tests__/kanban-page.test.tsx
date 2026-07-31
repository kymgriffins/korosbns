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

import KanbanPage from "../page";

describe("KanbanPage", () => {
  it("renders without crashing when tasks load", async () => {
    mockListAll.mockResolvedValue([]);
    const { container } = render(<KanbanPage />);
    expect(container).toBeTruthy();
  });

  it("shows loading skeleton initially", async () => {
    mockListAll.mockReturnValue(new Promise(() => {}));
    render(<KanbanPage />);
    const skeletons = document.querySelectorAll('[class*="animate"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(1);
  });
});
