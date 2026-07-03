import type { BudgetSchema } from "@/lib/budget-schema";
import { fetchAllYearsData, VISIBLE_FISCAL_YEARS, type FiscalYearMeta } from "@/lib/reports-api";

export type { FiscalYearMeta };

export async function fetchReportData(): Promise<{
  allYears: Record<string, BudgetSchema>;
  fiscalYears: FiscalYearMeta[];
  selectedYear: string;
}> {
  const allYears = await fetchAllYearsData();
  const fiscalYears = VISIBLE_FISCAL_YEARS;
  const currentYear =
    fiscalYears.find((y) => y.is_current)?.id ?? fiscalYears[0]?.id ?? "fy2026";
  return { allYears, fiscalYears, selectedYear: currentYear };
}
