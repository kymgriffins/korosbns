"use client";

import { useState, useEffect, useMemo } from "react";
import {
  fetchBudgetAllocations,
  fetchBudgetKpis,
  fetchBudgetHighlights,
  allocationsToChartPoints,
  kpiRawToKpi,
  allocationToComparisonRows,
  highlightRawToCallout,
  type BudgetAllocation,
  type BudgetKpiRaw,
  type BudgetHighlightRaw,
} from "@/lib/budget-api";
import type { BudgetReportProfile } from "@/types/budget-report";

interface UseBudgetDataResult {
  budgetAllocations: BudgetAllocation[] | null;
  budgetKpis: BudgetKpiRaw[] | null;
  budgetHighlights: BudgetHighlightRaw[] | null;
  budgetLoading: boolean;
  budgetReportProfile: BudgetReportProfile | null;
}

export function useBudgetData(fiscalYearId?: string | null, fiscalYearLabel?: string | null): UseBudgetDataResult {
  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[] | null>(null);
  const [budgetKpis, setBudgetKpis] = useState<BudgetKpiRaw[] | null>(null);
  const [budgetHighlights, setBudgetHighlights] = useState<BudgetHighlightRaw[] | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(false);

  useEffect(() => {
    if (!fiscalYearId) return;
    let cancelled = false;
    setBudgetLoading(true);
    async function loadBudget() {
      try {
        const [allocations, kpis, highlights] = await Promise.all([
          fetchBudgetAllocations({ fiscal_year: fiscalYearId! }),
          fetchBudgetKpis({ fiscal_year: fiscalYearId! }),
          fetchBudgetHighlights({ fiscal_year: fiscalYearId! }),
        ]);
        if (cancelled) return;
        setBudgetAllocations(allocations);
        setBudgetKpis(kpis);
        setBudgetHighlights(highlights);
      } catch {
        // silently fail — fall back to JSON metadata
      } finally {
        if (!cancelled) setBudgetLoading(false);
      }
    }
    loadBudget();
    return () => { cancelled = true; };
  }, [fiscalYearId]);

  const budgetReportProfile = useMemo<BudgetReportProfile | null>(() => {
    if (!budgetAllocations) return null;
    const approved = budgetAllocations.filter((a) => a.allocation_type === "approved");
    const proposed = budgetAllocations.filter((a) => a.allocation_type === "proposed");
    const sectorChart = allocationsToChartPoints(approved, "approved");
    const comparisonRows = allocationToComparisonRows(budgetAllocations);
    const kpis = budgetKpis?.map(kpiRawToKpi);
    const highlights = budgetHighlights?.map(highlightRawToCallout);
    return {
      fiscal_year: fiscalYearLabel || String(fiscalYearId),
      kpis,
      sector_chart: sectorChart,
      comparison_rows: comparisonRows,
      highlights,
    };
  }, [budgetAllocations, budgetKpis, budgetHighlights, fiscalYearLabel, fiscalYearId]);

  return { budgetAllocations, budgetKpis, budgetHighlights, budgetLoading, budgetReportProfile };
}
