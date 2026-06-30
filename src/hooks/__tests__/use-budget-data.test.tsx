import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

vi.mock("@/data/budget", () => ({
  budgetData: {
    allocations: { fetch: vi.fn() },
    kpis: { fetch: vi.fn() },
    highlights: { fetch: vi.fn() },
  },
}));

import { budgetData } from "@/data/budget";
import { useBudgetData } from "@/hooks/use-budget-data";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useBudgetData", () => {
  it("calls allocations, kpis, and highlights fetch with fiscalYearId", async () => {
    const mockAllocations = [{ id: "1", entity: "ent-1", entity_name: "Entity 1", amount: "1000", amount_previous: null, fiscal_year: "fy2026", fiscal_year_label: "FY 2025/26", entity_type: "ministry", notes: "" } as any];
    const mockKpis = [{ id: "kpi-1", key: "test", label: "Test", value: "50", previous_value: "40", trend: "up", suffix: "%", description: "Test KPI", sort_order: 1, fiscal_year: "fy2026", entity: null, entity_name: "" } as any];
    const mockHighlights = [{ id: "hl-1", type: "success" as const, title: "Highlight", text: "Good", sort_order: 1, fiscal_year: "fy2026", entity: null, entity_name: "" } as any];

    vi.mocked(budgetData.allocations.fetch).mockResolvedValue(mockAllocations);
    vi.mocked(budgetData.kpis.fetch).mockResolvedValue(mockKpis);
    vi.mocked(budgetData.highlights.fetch).mockResolvedValue(mockHighlights);

    const { result } = renderHook(() => useBudgetData("fy2026"));

    await waitFor(() => expect(result.current.budgetLoading).toBe(false));

    expect(budgetData.allocations.fetch).toHaveBeenCalledWith({ fiscal_year: "fy2026" });
    expect(budgetData.kpis.fetch).toHaveBeenCalledWith({ fiscal_year: "fy2026" });
    expect(budgetData.highlights.fetch).toHaveBeenCalledWith({ fiscal_year: "fy2026" });
    expect(result.current.budgetAllocations).toEqual(mockAllocations);
    expect(result.current.budgetKpis).toEqual(mockKpis);
    expect(result.current.budgetHighlights).toEqual(mockHighlights);
  });

  it("computes budgetReportProfile from allocations", async () => {
    const mockAllocations = [
      { id: "1", allocation_type: "approved", entity: "ent-1", entity_name: "Entity 1", amount: "1000000000", amount_previous: "800000000", fiscal_year: "fy2026", fiscal_year_label: "FY 2025/26", entity_type: "ministry", notes: "" },
      { id: "2", allocation_type: "proposed", entity: "ent-2", entity_name: "Entity 2", amount: "2000000000", amount_previous: null, fiscal_year: "fy2026", fiscal_year_label: "FY 2025/26", entity_type: "ministry", notes: "" },
    ] as any;

    vi.mocked(budgetData.allocations.fetch).mockResolvedValue(mockAllocations);
    vi.mocked(budgetData.kpis.fetch).mockResolvedValue([]);
    vi.mocked(budgetData.highlights.fetch).mockResolvedValue([]);

    const { result } = renderHook(() => useBudgetData("fy2026", "FY 2025/26"));

    await waitFor(() => expect(result.current.budgetLoading).toBe(false));

    expect(result.current.budgetReportProfile).not.toBeNull();
    expect(result.current.budgetReportProfile!.fiscal_year).toBe("FY 2025/26");
    expect(result.current.budgetReportProfile!.sector_chart).toHaveLength(1);
    expect(result.current.budgetReportProfile!.comparison_rows).toHaveLength(1);
    expect(result.current.budgetReportProfile!.kpis).toEqual([]);
    expect(result.current.budgetReportProfile!.highlights).toEqual([]);
  });

  it("returns null for budgetReportProfile when allocations is null", async () => {
    vi.mocked(budgetData.allocations.fetch).mockResolvedValue(null as any);
    vi.mocked(budgetData.kpis.fetch).mockResolvedValue([]);
    vi.mocked(budgetData.highlights.fetch).mockResolvedValue([]);

    const { result } = renderHook(() => useBudgetData("fy2026"));

    await waitFor(() => expect(result.current.budgetLoading).toBe(false));

    expect(result.current.budgetReportProfile).toBeNull();
  });

  it("does not fetch when fiscalYearId is null", () => {
    const { result } = renderHook(() => useBudgetData(null));

    expect(budgetData.allocations.fetch).not.toHaveBeenCalled();
    expect(result.current.budgetLoading).toBe(false);
  });
});
