/**
 * Compact FY catalogue for Budget Data World (/reports).
 * Statuses mirror audit/CHECKLIST-BUDGET-YEARS.md (2026-07-21) — honest labels only.
 */

import type { YearVerificationStatus } from "@/lib/budget-sources";

export type BudgetYearEntry = {
  /** FY label as used in seeds, e.g. "2026/27" */
  id: string;
  /** Start calendar year of the FY (July) */
  startYear: number;
  era: string;
  status: YearVerificationStatus;
  /** Decade landmark shown in the selector when scrolling eras */
  decadeAnchor?: boolean;
};

function fy(startYear: number): string {
  const end = (startYear + 1) % 100;
  return `${startYear}/${String(end).padStart(2, "0")}`;
}

function eraFor(startYear: number): string {
  if (startYear <= 1969) return "Independence";
  if (startYear <= 1979) return "Growth";
  if (startYear <= 1989) return "Challenges";
  if (startYear <= 1999) return "SAP / reform";
  if (startYear <= 2009) return "Pre-devolution";
  if (startYear === 2010) return "Constitution / devolution";
  if (startYear <= 2012) return "Devolution ramp";
  if (startYear <= 2017) return "Counties";
  if (startYear <= 2019) return "Big 4 / MTP";
  if (startYear === 2020) return "COVID shock";
  if (startYear === 2021) return "Recovery";
  if (startYear === 2022) return "Transition";
  return "BETA";
}

function statusFor(startYear: number): YearVerificationStatus {
  if (startYear >= 2025) return "IN_APP";
  if (startYear >= 1990) return "SOURCE_LISTED";
  return "GAP";
}

/** Full independence → current FY list with honest verification status. */
export const BUDGET_YEARS: BudgetYearEntry[] = Array.from({ length: 2026 - 1963 + 1 }, (_, i) => {
  const startYear = 1963 + i;
  return {
    id: fy(startYear),
    startYear,
    era: eraFor(startYear),
    status: statusFor(startYear),
    decadeAnchor: startYear === 1963 || startYear % 10 === 0,
  };
});

export const IN_APP_YEARS = BUDGET_YEARS.filter((y) => y.status === "IN_APP");

export const DEFAULT_BUDGET_YEAR_ID = "2026/27";

export function getBudgetYear(id: string): BudgetYearEntry | undefined {
  return BUDGET_YEARS.find((y) => y.id === id);
}

export function statusLabel(status: YearVerificationStatus): string {
  switch (status) {
    case "IN_APP":
      return "IN_APP";
    case "TESTED_TRUE":
      return "TESTED_TRUE";
    case "PARTIAL":
      return "PARTIAL";
    case "SOURCE_LISTED":
      return "SOURCE_LISTED";
    case "GAP":
    default:
      return "GAP";
  }
}

/** Honest verification chip copy — never claim TESTED_TRUE until Content Lab runner passes. */
export function verificationBadgeText(status: YearVerificationStatus): string {
  switch (status) {
    case "TESTED_TRUE":
      return "TESTED_TRUE — Content Lab suite passed";
    case "IN_APP":
      return "IN_APP — promote to TESTED_TRUE after Content Lab suite";
    case "PARTIAL":
      return "PARTIAL — limited metrics with provenance only";
    case "SOURCE_LISTED":
      return "SOURCE_LISTED — official docs known; not extracted yet";
    case "GAP":
    default:
      return "GAP — not in our database yet";
  }
}
