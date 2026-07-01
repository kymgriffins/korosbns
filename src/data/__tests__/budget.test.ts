import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchBudgetAllocations,
  fetchBudgetKpis,
  fetchBudgetHighlights,
} from "@/lib/budget-api";

vi.mock("@/lib/budget-api", () => ({
  fetchBudgetAllocations: vi.fn(),
  fetchBudgetKpis: vi.fn(),
  fetchBudgetHighlights: vi.fn(),
}));

// Mock other imports needed by budget.ts to avoid resolution issues
vi.mock("@/lib/learn-hub", () => ({
  learnHubApi: {
    budgetNewsYears: vi.fn(),
    budgetNewsModules: vi.fn(),
    budgetNewsModule: vi.fn(),
  },
}));

vi.mock("@/lib/admin-api", () => ({
  adminBudgetApi: { list: vi.fn(), upload: vi.fn(), delete: vi.fn() },
}));

import { budgetData } from "@/data/budget";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("budgetData allocations", () => {
  it("fetch() calls fetchBudgetAllocations and returns data", async () => {
    const mockData = [{ id: "1", entity_name: "Health" }];
    (fetchBudgetAllocations as any).mockResolvedValue(mockData);
    const result = await budgetData.allocations.fetch({ fiscal_year: "fy2026" });
    expect(fetchBudgetAllocations).toHaveBeenCalledWith({ fiscal_year: "fy2026" });
    expect(result).toEqual(mockData);
  });

  it("fetch() falls back to [] on API error", async () => {
    (fetchBudgetAllocations as any).mockRejectedValue(new Error("fail"));
    const result = await budgetData.allocations.fetch();
    expect(result).toEqual([]);
  });
});

describe("budgetData kpis", () => {
  it("fetch() calls fetchBudgetKpis and returns data", async () => {
    const mockData = [{ id: "1", label: "GDP Growth" }];
    (fetchBudgetKpis as any).mockResolvedValue(mockData);
    const result = await budgetData.kpis.fetch({ fiscal_year: "fy2026" });
    expect(fetchBudgetKpis).toHaveBeenCalledWith({ fiscal_year: "fy2026" });
    expect(result).toEqual(mockData);
  });

  it("fetch() falls back to [] on API error", async () => {
    (fetchBudgetKpis as any).mockRejectedValue(new Error("fail"));
    const result = await budgetData.kpis.fetch();
    expect(result).toEqual([]);
  });
});

describe("budgetData highlights", () => {
  it("fetch() calls fetchBudgetHighlights and returns data", async () => {
    const mockData = [{ id: "1", title: "Key Highlight" }];
    (fetchBudgetHighlights as any).mockResolvedValue(mockData);
    const result = await budgetData.highlights.fetch();
    expect(fetchBudgetHighlights).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(mockData);
  });

  it("fetch() falls back to [] on API error", async () => {
    (fetchBudgetHighlights as any).mockRejectedValue(new Error("fail"));
    const result = await budgetData.highlights.fetch();
    expect(result).toEqual([]);
  });
});
