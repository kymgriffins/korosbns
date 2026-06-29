import type { BudgetReportProfile, BudgetKpi, BudgetComparisonRow, BudgetCallout } from "@/types/budget-report";
import { withFallback } from "@/data/adapter";

export type { BudgetReportProfile, BudgetKpi, BudgetComparisonRow, BudgetCallout };

const DEFAULT_REPORTS: BudgetReportProfile[] = [];

let _reports: BudgetReportProfile[] = [...DEFAULT_REPORTS];

export const budgetData = {
  reports: {
    get: () => _reports,
    set: (items: BudgetReportProfile[]) => { _reports = items; },
  },
  fetchReport: (slug: string) =>
    withFallback(
      "budget",
      () => Promise.reject(new Error("Budget API not implemented")),
      () => null as unknown as BudgetReportProfile,
    ),
};
