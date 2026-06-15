import { apiFetch } from "@/lib/api-client";
import type {
  BudgetChartPoint,
  BudgetKpi,
  BudgetCallout,
} from "@/types/budget-report";

export type BudgetFiscalYear = {
  id: string;
  fiscal_year: number;
  label: string;
  starts_at: string | null;
  ends_at: string | null;
  is_current: boolean;
};

export type BudgetEntity = {
  id: string;
  type: string;
  code: string;
  name: string;
  parent: string | null;
  gfs_code: string;
  is_active: boolean;
  sort_order: number;
};

export type BudgetAllocation = {
  id: string;
  fiscal_year: string;
  fiscal_year_label: string;
  entity: string;
  entity_name: string;
  entity_type: string;
  allocation_type: "approved" | "proposed" | "actual" | "supplementary";
  amount: string;
  amount_previous: string | null;
  notes: string;
};

export type BudgetKpiRaw = {
  id: string;
  fiscal_year: string;
  entity: string | null;
  entity_name: string;
  key: string;
  label: string;
  value: string;
  previous_value: string;
  trend: string;
  suffix: string;
  description: string;
  sort_order: number;
};

export type BudgetHighlightRaw = {
  id: string;
  fiscal_year: string;
  entity: string | null;
  entity_name: string;
  type: "info" | "warning" | "success" | "trend";
  title: string;
  text: string;
  sort_order: number;
};

export async function fetchBudgetFiscalYears(): Promise<BudgetFiscalYear[]> {
  return apiFetch<BudgetFiscalYear[]>("/budget/fiscal-years/");
}

export async function fetchBudgetEntities(params?: {
  type?: string;
}): Promise<BudgetEntity[]> {
  const qs = params?.type ? `?type=${params.type}` : "";
  return apiFetch<BudgetEntity[]>(`/budget/entities/${qs}`);
}

export async function fetchBudgetAllocations(params?: {
  fiscal_year?: string;
  entity?: string;
  allocation_type?: string;
}): Promise<BudgetAllocation[]> {
  const q = new URLSearchParams();
  if (params?.fiscal_year) q.set("fiscal_year", params.fiscal_year);
  if (params?.entity) q.set("entity", params.entity);
  if (params?.allocation_type) q.set("allocation_type", params.allocation_type);
  const qs = q.toString();
  return apiFetch<BudgetAllocation[]>(`/budget/allocations/${qs ? `?${qs}` : ""}`);
}

export async function fetchBudgetKpis(params?: {
  fiscal_year?: string;
  entity?: string;
}): Promise<BudgetKpiRaw[]> {
  const q = new URLSearchParams();
  if (params?.fiscal_year) q.set("fiscal_year", params.fiscal_year);
  if (params?.entity) q.set("entity", params.entity);
  const qs = q.toString();
  return apiFetch<BudgetKpiRaw[]>(`/budget/kpis/${qs ? `?${qs}` : ""}`);
}

export async function fetchBudgetHighlights(params?: {
  fiscal_year?: string;
  entity?: string;
}): Promise<BudgetHighlightRaw[]> {
  const q = new URLSearchParams();
  if (params?.fiscal_year) q.set("fiscal_year", params.fiscal_year);
  if (params?.entity) q.set("entity", params.entity);
  const qs = q.toString();
  return apiFetch<BudgetHighlightRaw[]>(`/budget/highlights/${qs ? `?${qs}` : ""}`);
}

export function allocationsToChartPoints(
  allocations: BudgetAllocation[],
  allocationType: string,
): BudgetChartPoint[] {
  const names: Record<string, number> = {};
  for (const a of allocations) {
    if (a.allocation_type === allocationType) {
      const name = a.entity_name;
      names[name] = (names[name] || 0) + Number(a.amount);
    }
  }
  const scale = Math.max(...Object.values(names), 1);
  return Object.entries(names).map(([name, value]) => ({
    name,
    value: Math.round(value / 1e8) / 10,
    fill: undefined,
  }));
}

export function kpiRawToKpi(raw: BudgetKpiRaw): BudgetKpi {
  return {
    key: raw.key,
    label: raw.label,
    value: Number(raw.value.replace(/[^0-9.]/g, "")),
    suffix: raw.suffix || undefined,
    trend: (raw.trend as "up" | "down" | "flat") || undefined,
    previous: raw.previous_value ? Number(raw.previous_value.replace(/[^0-9.]/g, "")) : undefined,
    description: raw.description || undefined,
  };
}

export function allocationToComparisonRows(
  allocations: BudgetAllocation[],
): Array<{ label: string; fy2025: string; fy2026: string; change: string }> {
  const approved = allocations.filter((a) => a.allocation_type === "approved");
  const proposed = allocations.filter((a) => a.allocation_type === "proposed");
  const rows: Array<{ label: string; fy2025: string; fy2026: string; change: string }> = [];

  for (const a of approved) {
    const prop = proposed.find((p) => p.entity === a.entity);
    const prev = a.amount_previous ? Number(a.amount_previous) : 0;
    const curr = Number(a.amount);
    const diff = curr - prev;
    const pct = prev > 0 ? ((diff / prev) * 100).toFixed(1) : "-";
    rows.push({
      label: a.entity_name,
      fy2025: `KES ${(prev / 1e9).toFixed(1)}B`,
      fy2026: `KES ${(curr / 1e9).toFixed(1)}B`,
      change: `${diff >= 0 ? "+" : ""}KES ${(diff / 1e9).toFixed(1)}B (${pct}%)`,
    });
  }
  return rows;
}

export function highlightRawToCallout(raw: BudgetHighlightRaw): BudgetCallout {
  return {
    type: raw.type,
    title: raw.title,
    text: raw.text,
  };
}
