"use client";

import type { BudgetSchema } from "@/lib/budget-schema";
import { fetchAllYearsData, FISCAL_YEARS, type FiscalYearMeta } from "@/lib/reports-api";

export type { FiscalYearMeta };

export async function fetchReportData(): Promise<{
  allYears: Record<string, BudgetSchema>;
  fiscalYears: FiscalYearMeta[];
  selectedYear: string;
}> {
  const allYears = await fetchAllYearsData();
  const currentYear = FISCAL_YEARS.find((y) => y.is_current)?.id ?? FISCAL_YEARS[0]?.id ?? "fy2026";
  return { allYears, fiscalYears: FISCAL_YEARS, selectedYear: currentYear };
}
