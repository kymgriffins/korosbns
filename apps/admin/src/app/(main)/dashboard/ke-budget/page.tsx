"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminKeBudgetApi,
  normalizeListResponse,
  type AdminBudgetAllocation,
  type AdminBudgetEntity,
  type AdminBudgetFiscalYear,
} from "@/lib/admin-api";

type Mode = "create" | "edit";

const emptyFy = () => ({
  fiscal_year: "",
  label: "",
  starts_at: "",
  ends_at: "",
  is_current: false,
});

export default function AdminKeBudgetPage() {
  const [years, setYears] = useState<AdminBudgetFiscalYear[]>([]);
  const [entities, setEntities] = useState<AdminBudgetEntity[]>([]);
  const [selected, setSelected] = useState<AdminBudgetFiscalYear | null>(null);
  const [allocDraft, setAllocDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyFy);

  const fetchYears = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [fyRes, entRes] = await Promise.all([
        adminKeBudgetApi.listFiscalYears(),
        adminKeBudgetApi.listEntities({ type: "sector" }),
      ]);
      setYears(normalizeListResponse(fyRes).results);
      setEntities(normalizeListResponse(entRes).results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load budget data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setForm(emptyFy());
    setDialogOpen(true);
  };

  const openEdit = (fy: AdminBudgetFiscalYear) => {
    setMode("edit");
    setEditId(fy.id);
    setForm({
      fiscal_year: String(fy.fiscal_year),
      label: fy.label || "",
      starts_at: fy.starts_at || "",
      ends_at: fy.ends_at || "",
      is_current: fy.is_current,
    });
    setDialogOpen(true);
  };

  const selectYear = async (fy: AdminBudgetFiscalYear) => {
    try {
      const detail = await adminKeBudgetApi.getFiscalYear(fy.id);
      setSelected(detail);
      const draft: Record<string, string> = {};
      for (const a of detail.allocations || []) {
        draft[`${a.entity_id}:${a.allocation_type}`] = a.amount;
      }
      for (const e of entities) {
        const key = `${e.id}:approved`;
        if (!(key in draft)) draft[key] = "0";
      }
      setAllocDraft(draft);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load fiscal year");
    }
  };

  const handleSubmit = async () => {
    const yearNum = Number(form.fiscal_year);
    if (!yearNum) {
      toast.error("Fiscal year is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        fiscal_year: yearNum,
        label: form.label.trim(),
        starts_at: form.starts_at || null,
        ends_at: form.ends_at || null,
        is_current: form.is_current,
      };
      if (mode === "create") {
        const created = await adminKeBudgetApi.createFiscalYear(payload);
        toast.success("Fiscal year created");
        setDialogOpen(false);
        await fetchYears();
        await selectYear(created);
      } else if (editId) {
        await adminKeBudgetApi.updateFiscalYear(editId, payload);
        toast.success("Fiscal year updated");
        setDialogOpen(false);
        fetchYears();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (fy: AdminBudgetFiscalYear) => {
    if (!confirm(`Delete ${fy.label || fy.fiscal_year}?`)) return;
    try {
      await adminKeBudgetApi.deleteFiscalYear(fy.id);
      toast.success("Deleted");
      if (selected?.id === fy.id) setSelected(null);
      fetchYears();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const saveAllocations = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const allocations = Object.entries(allocDraft).map(([key, amount]) => {
        const [entity_id, allocation_type] = key.split(":");
        return { entity_id, allocation_type, amount };
      });
      const updated = await adminKeBudgetApi.saveAllocations(selected.id, { allocations });
      setSelected(updated);
      toast.success("Allocations saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<AdminBudgetFiscalYear>[] = [
    {
      key: "label",
      header: "Fiscal year",
      cell: (fy) => (
        <button type="button" className="text-left font-medium underline-offset-2 hover:underline" onClick={() => selectYear(fy)}>
          {fy.label || `FY${fy.fiscal_year}`}
        </button>
      ),
    },
    {
      key: "is_current",
      header: "Current",
      cell: (fy) => (fy.is_current ? <Badge>Current</Badge> : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "actions",
      header: "",
      cell: (fy) => (
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" onClick={() => openEdit(fy)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleDelete(fy)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const allocationRows: AdminBudgetAllocation[] = entities.map((e) => {
    const existing = selected?.allocations?.find(
      (a) => a.entity_id === e.id && a.allocation_type === "approved",
    );
    return {
      id: existing?.id || e.id,
      entity_id: e.id,
      entity_name: e.name,
      entity_code: e.code,
      allocation_type: "approved",
      amount: allocDraft[`${e.id}:approved`] ?? existing?.amount ?? "0",
      notes: existing?.notes || "",
    };
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">KE Budget</h1>
        <p className="text-sm text-muted-foreground">
          Manage fiscal years and sector allocations (legacy HTML parity). Bulk staging remains on v2.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fiscal years</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={years}
            loading={loading}
            onCreate={openCreate}
            createLabel="New fiscal year"
          />
        </CardContent>
      </Card>

      {selected ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">
              Allocations — {selected.label || selected.fiscal_year}
            </CardTitle>
            <Button onClick={saveAllocations} disabled={saving}>
              {saving ? "Saving…" : "Save allocations"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {allocationRows.map((row) => (
              <div key={row.entity_id} className="grid grid-cols-[1fr_160px] items-center gap-3">
                <div>
                  <div className="text-sm font-medium">{row.entity_name}</div>
                  <div className="text-xs text-muted-foreground">{row.entity_code}</div>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  value={allocDraft[`${row.entity_id}:approved`] ?? "0"}
                  onChange={(e) =>
                    setAllocDraft((d) => ({
                      ...d,
                      [`${row.entity_id}:approved`]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
            {!entities.length ? (
              <p className="text-sm text-muted-foreground">No active sector entities found.</p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create fiscal year" : "Edit fiscal year"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label>Fiscal year (e.g. 2026)</Label>
            <Input
              type="number"
              value={form.fiscal_year}
              onChange={(e) => setForm((f) => ({ ...f, fiscal_year: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Label</Label>
            <Input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="FY26/27"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Starts</Label>
              <Input
                type="date"
                value={form.starts_at}
                onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Ends</Label>
              <Input
                type="date"
                value={form.ends_at}
                onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_current}
              onChange={(e) => setForm((f) => ({ ...f, is_current: e.target.checked }))}
            />
            Mark as current
          </label>
        </div>
      </FormDialog>
    </div>
  );
}
