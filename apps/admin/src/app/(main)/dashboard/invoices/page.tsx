"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminInvoicesApi,
  type AdminInvoice,
  type AdminInvoiceSummary,
} from "@/lib/admin-api";

type Mode = "create" | "edit";

const emptyForm = () => {
  const today = new Date().toISOString().slice(0, 10);
  return {
    invoice_number: "",
    client_name: "",
    client_email: "",
    client_address: "",
    item_description: "",
    item_quantity: "1",
    item_unit_price: "0",
    tax_rate: "0",
    currency: "KES",
    status: "DRAFT" as AdminInvoice["status"],
    issue_date: today,
    due_date: today,
    notes: "",
  };
};

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [summary, setSummary] = useState<AdminInvoiceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminInvoicesApi.list(
        statusFilter === "all" ? undefined : { status: statusFilter },
      );
      setInvoices(res.results ?? []);
      setSummary(res.summary ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (inv: AdminInvoice) => {
    const first = inv.items?.[0];
    setMode("edit");
    setEditId(inv.id);
    setForm({
      invoice_number: inv.invoice_number,
      client_name: inv.client_name,
      client_email: inv.client_email || "",
      client_address: inv.client_address || "",
      item_description: first?.description || "",
      item_quantity: String(first?.quantity ?? 1),
      item_unit_price: String(first?.unit_price ?? 0),
      tax_rate: String(inv.tax_rate ?? 0),
      currency: inv.currency || "KES",
      status: inv.status,
      issue_date: inv.issue_date,
      due_date: inv.due_date,
      notes: inv.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.invoice_number.trim() || !form.client_name.trim()) {
      toast.error("Invoice number and client name are required");
      return;
    }
    if (!form.item_description.trim()) {
      toast.error("At least one line item description is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        invoice_number: form.invoice_number.trim(),
        client_name: form.client_name.trim(),
        client_email: form.client_email.trim(),
        client_address: form.client_address.trim(),
        items: [
          {
            description: form.item_description.trim(),
            quantity: form.item_quantity,
            unit_price: form.item_unit_price,
          },
        ],
        tax_rate: form.tax_rate,
        currency: form.currency,
        status: form.status,
        issue_date: form.issue_date,
        due_date: form.due_date,
        notes: form.notes.trim(),
      };
      if (mode === "create") {
        await adminInvoicesApi.create(payload);
        toast.success("Invoice created");
      } else if (editId) {
        await adminInvoicesApi.update(editId, payload);
        toast.success("Invoice updated");
      }
      setDialogOpen(false);
      fetchInvoices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (inv: AdminInvoice, status: AdminInvoice["status"]) => {
    try {
      await adminInvoicesApi.update(inv.id, { status });
      toast.success(`Marked ${status}`);
      fetchInvoices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Status update failed");
    }
  };

  const handleDelete = async (inv: AdminInvoice) => {
    if (!confirm(`Delete invoice ${inv.invoice_number}?`)) return;
    try {
      await adminInvoicesApi.delete(inv.id);
      toast.success("Invoice deleted");
      fetchInvoices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const columns: Column<AdminInvoice>[] = [
    {
      key: "number",
      header: "Invoice",
      cell: (i) => (
        <div>
          <p className="font-medium">{i.invoice_number}</p>
          <p className="text-xs text-muted-foreground">{i.client_name}</p>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      cell: (i) => (
        <span className="tabular-nums">
          {i.total} {i.currency}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (i) => (
        <Select
          value={i.status}
          onValueChange={(v) => handleStatus(i, v as AdminInvoice["status"])}
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "dates",
      header: "Dates",
      cell: (i) => (
        <span className="text-xs text-muted-foreground">
          {i.issue_date} → {i.due_date}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      cell: (i) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(i)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            onClick={() => handleDelete(i)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
        <p className="text-sm text-muted-foreground">
          Create and track invoices (org-agnostic table, matching Django admin).
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total", value: summary?.total_count ?? "—" },
          { label: "Draft", value: summary?.draft_count ?? "—" },
          { label: "Paid", value: summary?.paid_count ?? "—" },
          { label: "Revenue", value: summary?.total_revenue ?? "—" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {loading ? "…" : kpi.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>All invoices</CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={invoices}
            loading={loading}
            error={error}
            emptyMessage="No invoices yet."
            onCreate={openCreate}
            createLabel="New invoice"
            onRefresh={fetchInvoices}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create invoice" : "Edit invoice"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Invoice number</Label>
            <Input
              value={form.invoice_number}
              onChange={(e) => setForm({ ...form, invoice_number: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v as AdminInvoice["status"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Client name</Label>
          <Input
            value={form.client_name}
            onChange={(e) => setForm({ ...form, client_name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Client email</Label>
            <Input
              type="email"
              value={form.client_email}
              onChange={(e) => setForm({ ...form, client_email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Client address</Label>
          <Textarea
            rows={2}
            value={form.client_address}
            onChange={(e) => setForm({ ...form, client_address: e.target.value })}
          />
        </div>
        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-sm font-medium">Line item</p>
          <Input
            placeholder="Description"
            value={form.item_description}
            onChange={(e) => setForm({ ...form, item_description: e.target.value })}
          />
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Qty"
              value={form.item_quantity}
              onChange={(e) => setForm({ ...form, item_quantity: e.target.value })}
            />
            <Input
              type="number"
              min={0}
              placeholder="Unit price"
              value={form.item_unit_price}
              onChange={(e) => setForm({ ...form, item_unit_price: e.target.value })}
            />
            <Input
              type="number"
              min={0}
              placeholder="Tax %"
              value={form.tax_rate}
              onChange={(e) => setForm({ ...form, tax_rate: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Issue date</Label>
            <Input
              type="date"
              value={form.issue_date}
              onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Due date</Label>
            <Input
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </FormDialog>
    </div>
  );
}
