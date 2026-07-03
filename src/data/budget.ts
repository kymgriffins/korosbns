import type { BudgetReportProfile, BudgetKpi, BudgetComparisonRow, BudgetCallout } from "@/types/budget-report";
import type { BudgetSchema } from "@/lib/budget-schema";
import { withFallback } from "@/data/adapter";
import { learnHubApi } from "@/lib/learn-hub";
import { adminBudgetApi } from "@/lib/admin-api";
import type { AdminBudgetRecord } from "@/lib/admin-api";
import type { CivicModule } from "@/types/learn";
import type { BudgetNewsYear } from "@/lib/learn-hub";
import type { ApiListResponse } from "@/types/api";
import {
  fetchAllYearsData,
  VISIBLE_FISCAL_YEARS,
  type FiscalYearMeta,
} from "@/lib/reports-api";
import {
  fetchBudgetAllocations,
  fetchBudgetKpis,
  fetchBudgetHighlights,
} from "@/lib/budget-api";

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
  fetchYears: () =>
    withFallback(
      "budget",
      () => learnHubApi.budgetNewsYears(),
      () => ({ results: [] as BudgetNewsYear[] }) as ApiListResponse<BudgetNewsYear>,
    ),
  fetchModules: (params?: { fiscal_year_label?: string | null }) =>
    withFallback(
      "budget",
      () => learnHubApi.budgetNewsModules(params),
      () => ({ results: [] as CivicModule[] }) as ApiListResponse<CivicModule>,
    ),
  fetchModule: (slug: string) =>
    withFallback(
      "budget",
      () => learnHubApi.budgetNewsModule(slug),
      () => null as unknown as CivicModule,
    ),
  fetchReportData: () =>
    withFallback(
      "budget",
      async () => {
        const allYears = await fetchAllYearsData();
        const currentYear = VISIBLE_FISCAL_YEARS.find((y) => y.is_current)?.id ?? VISIBLE_FISCAL_YEARS[0]?.id ?? "fy2026";
        return { allYears, fiscalYears: VISIBLE_FISCAL_YEARS, selectedYear: currentYear };
      },
      () => ({ allYears: {} as Record<string, BudgetSchema>, fiscalYears: [] as FiscalYearMeta[], selectedYear: "" }),
    ),
  records: {
    fetch: () =>
      withFallback(
        "budget",
        () => adminBudgetApi.list(),
        () => ({ count: 0, results: [] as AdminBudgetRecord[] }),
      ),
    upload: (file: File) =>
      withFallback(
        "budget",
        () => adminBudgetApi.upload(file),
        () => null as unknown as AdminBudgetRecord,
      ),
    delete: (id: string) =>
      withFallback(
        "budget",
        () => adminBudgetApi.delete(id).then(() => true),
        () => true,
      ),
  },
  allocations: {
    fetch: (params?: { fiscal_year?: string; entity?: string; allocation_type?: string }) =>
      withFallback(
        "budget",
        () => fetchBudgetAllocations(params),
        () => [],
      ),
  },
  kpis: {
    fetch: (params?: { fiscal_year?: string; entity?: string }) =>
      withFallback(
        "budget",
        () => fetchBudgetKpis(params),
        () => [],
      ),
  },
  highlights: {
    fetch: (params?: { fiscal_year?: string; entity?: string }) =>
      withFallback(
        "budget",
        () => fetchBudgetHighlights(params),
        () => [],
      ),
  },
};
