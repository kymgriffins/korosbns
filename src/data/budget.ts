import type { BudgetReport, BudgetKpi, BudgetChart, BudgetComparisonRow, BudgetCallout } from "@/types/budget-report";
import { withFallback } from "@/data/adapter";

export type { BudgetReport, BudgetKpi, BudgetChart, BudgetComparisonRow, BudgetCallout };

const DEFAULT_REPORTS: BudgetReport[] = [];

let _reports: BudgetReport[] = [...DEFAULT_REPORTS];

export const budgetData = {
  reports: {
    get: () => _reports,
    set: (items: BudgetReport[]) => { _reports = items; },
  },
  fetchReport: (slug: string) =>
    withFallback(
      "budget",
      () => Promise.reject(new Error("Budget API not implemented")),
      () => _reports.find((r) => r.slug === slug) ?? null,
    ),
};
