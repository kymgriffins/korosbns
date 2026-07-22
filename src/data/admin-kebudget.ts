import { adminKeBudgetApi } from "@/lib/admin-api";
import type { AdminBudgetFiscalYear, AdminBudgetEntity } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminBudgetFiscalYear, AdminBudgetEntity };

let _fiscalYears: AdminBudgetFiscalYear[] = [];
let _entities: AdminBudgetEntity[] = [];

export const adminKeBudgetData = {
  fiscalYears: {
    get: () => _fiscalYears,
    set: (items: AdminBudgetFiscalYear[]) => { _fiscalYears = items; },
    fetch: () =>
      withFallback(
        "admin-kebudget",
        () => adminKeBudgetApi.listFiscalYears().then((r) => {
          const results = r.results ?? [];
          _fiscalYears = results;
          return results;
        }),
        () => _fiscalYears,
      ),
    fetchById: (id: string) =>
      withFallback(
        "admin-kebudget",
        () => adminKeBudgetApi.getFiscalYear(id),
        () => _fiscalYears.find((fy) => fy.id === id) ?? null,
      ),
    create: (data: { fiscal_year: number; label?: string; starts_at?: string; ends_at?: string; is_current?: boolean }) =>
      withFallback(
        "admin-kebudget",
        () => adminKeBudgetApi.createFiscalYear(data),
        () => {
          const fy: AdminBudgetFiscalYear = {
            id: `new-${Date.now()}`,
            fiscal_year: data.fiscal_year,
            label: data.label ?? `FY ${data.fiscal_year}`,
            starts_at: data.starts_at ?? null,
            ends_at: data.ends_at ?? null,
            is_current: data.is_current ?? false,
          };
          _fiscalYears.unshift(fy);
          return fy;
        },
      ),
    update: (id: string, data: { label?: string; starts_at?: string; ends_at?: string; is_current?: boolean }) =>
      withFallback(
        "admin-kebudget",
        () => adminKeBudgetApi.updateFiscalYear(id, data),
        () => {
          const idx = _fiscalYears.findIndex((fy) => fy.id === id);
          if (idx !== -1) _fiscalYears[idx] = { ..._fiscalYears[idx], ...data };
          return _fiscalYears[idx] ?? null;
        },
      ),
    delete: (id: string) =>
      withFallback(
        "admin-kebudget",
        () => adminKeBudgetApi.deleteFiscalYear(id).then(() => {
          _fiscalYears = _fiscalYears.filter((fy) => fy.id !== id);
        }),
        () => { _fiscalYears = _fiscalYears.filter((fy) => fy.id !== id); },
      ),
    saveAllocations: (fyId: string, data: { allocations: Array<{ entity_id: string; amount: string | number; allocation_type?: string; notes?: string }>; delete_ids?: string[] }) =>
      withFallback(
        "admin-kebudget",
        () => adminKeBudgetApi.saveAllocations(fyId, data),
        () => null,
      ),
  },
  entities: {
    get: () => _entities,
    set: (items: AdminBudgetEntity[]) => { _entities = items; },
    fetch: (params?: { type?: string }) =>
      withFallback(
        "admin-kebudget",
        () => adminKeBudgetApi.listEntities(params).then((r) => {
          const results = r.results ?? [];
          _entities = results;
          return results;
        }),
        () => _entities,
      ),
  },
};
