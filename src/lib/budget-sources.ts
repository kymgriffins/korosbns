/**
 * Official Kenya budget sources loop — Level-1 preferred.
 * Data: audit/data/budget-sources.json
 * Policy: bnske DATA_PROVENANCE_RULE.md
 */

import budgetSourcesFile from "../../audit/data/budget-sources.json";

export type BudgetSourceLevel = 1 | 2;

export type BudgetSource = {
  id: string;
  name: string;
  url: string;
  type: string;
  level: BudgetSourceLevel;
  org: string;
  verified_link: boolean;
  lastChecked: string;
  notes?: string;
};

export type YearVerificationStatus =
  | "GAP"
  | "SOURCE_LISTED"
  | "PARTIAL"
  | "IN_APP"
  | "TESTED_TRUE";

/** Critical metrics required before TESTED_TRUE (modern FY). */
export const BUDGET_YEAR_CRITICAL_KEYS = [
  "fy",
  "total_expenditure",
  "total_revenue",
  "deficit",
  "recurrent",
  "development",
  "top_sectors",
  "provenance.sources",
] as const;

type BudgetSourcesFile = {
  version: number;
  updated: string;
  sources: BudgetSource[];
};

const FILE = budgetSourcesFile as BudgetSourcesFile;

/** All sources from audit/data/budget-sources.json. */
export function getBudgetSources(): BudgetSource[] {
  return FILE.sources ?? [];
}

export function getBudgetSourcesUpdated(): string {
  return FILE.updated ?? "";
}

export function forEachBudgetSource(
  sources: BudgetSource[],
  fn: (source: BudgetSource) => void,
): void {
  for (const source of sources) {
    fn(source);
  }
}

export function level1SourcesOnly(sources: BudgetSource[]): BudgetSource[] {
  return sources.filter((s) => s.level === 1);
}
