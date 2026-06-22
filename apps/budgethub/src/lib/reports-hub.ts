"use client";

import {
  fetchBudgetFiscalYears,
  fetchBudgetAllocations,
  fetchBudgetKpis,
  fetchBudgetEntities,
  fetchBudgetHighlights,
  type BudgetFiscalYear,
  type BudgetAllocation,
  type BudgetKpiRaw,
  type BudgetEntity,
  type BudgetHighlightRaw,
} from "@/lib/budget-api";
import {
  schemaFetchFiscalYears,
  schemaFetchAllocations,
  schemaFetchKpis,
  schemaFetchEntities,
  schemaFetchHighlights,
} from "@/lib/mock-from-schema";

const USE_MOCK = true;

export interface ReportPageData {
  fiscalYears: BudgetFiscalYear[];
  allocations: BudgetAllocation[];
  kpis: BudgetKpiRaw[];
  entities: BudgetEntity[];
  highlights: BudgetHighlightRaw[];
  selectedYear: string;
}

export async function fetchReportData(_slug: string, year?: string): Promise<ReportPageData> {
  const fyFn = USE_MOCK ? schemaFetchFiscalYears : fetchBudgetFiscalYears;
  const entFn = USE_MOCK ? schemaFetchEntities : fetchBudgetEntities;
  const allocFn = USE_MOCK ? schemaFetchAllocations : fetchBudgetAllocations;
  const kpiFn = USE_MOCK ? schemaFetchKpis : fetchBudgetKpis;
  const hlFn = USE_MOCK ? schemaFetchHighlights : fetchBudgetHighlights;

  const [yearsRes, entitiesRes] = await Promise.all([fyFn(), entFn()]);

  const fiscalYears = yearsRes;
  const entities = entitiesRes;
  const targetYear = year || yearsRes.find((y) => y.is_current)?.id || yearsRes[0]?.id || "";
  let allocations: BudgetAllocation[] = [];
  let kpis: BudgetKpiRaw[] = [];
  let highlights: BudgetHighlightRaw[] = [];

  if (targetYear) {
    const [allocRes, kpiRes, hlRes] = await Promise.all([
      allocFn({ fiscal_year: targetYear }),
      kpiFn({ fiscal_year: targetYear }),
      hlFn({ fiscal_year: targetYear }),
    ]);
    allocations = allocRes;
    kpis = kpiRes;
    highlights = hlRes;
  }

  return { fiscalYears, entities, allocations, kpis, highlights, selectedYear: targetYear };
}
