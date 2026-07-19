"use client";

import type { BudgetSchema } from "@/lib/budget-schema";
import {
  fetchAllYearsData,
  getReportProvenance,
  type FiscalYearMeta,
  type ReportProvenance,
} from "@/lib/reports-api";

export type { FiscalYearMeta, ReportProvenance };

function yearsFromPayload(allYears: Record<string, BudgetSchema>): FiscalYearMeta[] {
  return Object.keys(allYears).map((id, index) => ({
    id,
    label: allYears[id]?.metadata?.fiscal_year
      ? `FY ${allYears[id].metadata.fiscal_year}`
      : id,
    is_current: index === 0,
  }));
}

export async function fetchReportData(): Promise<{
  allYears: Record<string, BudgetSchema>;
  fiscalYears: FiscalYearMeta[];
  selectedYear: string;
  provenance: ReportProvenance;
}> {
  const allYears = await fetchAllYearsData();
  const fiscalYears = yearsFromPayload(allYears);
  const selectedYear = fiscalYears.find((y) => y.is_current)?.id ?? fiscalYears[0]?.id ?? "";
  const current = selectedYear ? allYears[selectedYear] : undefined;
  return {
    allYears,
    fiscalYears,
    selectedYear,
    provenance: getReportProvenance(current),
  };
}
