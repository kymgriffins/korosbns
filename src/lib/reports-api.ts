import type { BudgetSchema } from "@/lib/budget-schema";

export interface FiscalYearMeta {
  id: string;
  label: string;
  is_current: boolean;
}

export const FISCAL_YEARS: FiscalYearMeta[] = [
  { id: "fy2024", label: "FY 2024/25", is_current: false },
  { id: "fy2025", label: "FY 2025/26", is_current: false },
  { id: "fy2026", label: "FY 2026/27", is_current: true },
  { id: "fy2027", label: "FY 2027/28", is_current: false },
];

export async function fetchAllYearsData(): Promise<Record<string, BudgetSchema>> {
  return {};
}
