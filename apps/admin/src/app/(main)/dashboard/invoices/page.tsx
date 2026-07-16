"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { FileText, Plus, Save, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminInvoicesApi, type AdminInvoice } from "@/lib/admin-api";

import { type InvoiceFormValues, defaultInvoiceValues } from "./_components/data";
import { InvoiceForm } from "./_components/invoice-form";
import { InvoicePreview } from "./_components/invoice-preview";
import { PrintInvoice } from "./_components/print-invoice";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const form = useForm<InvoiceFormValues>({ defaultValues: defaultInvoiceValues });
  const invoiceWatch = useWatch({ control: form.control }) as InvoiceFormValues;

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminInvoicesApi.list();
      setInvoices(res.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const mapFormToApi = useCallback((data: InvoiceFormValues) => ({
    invoice_number: data.referenceNumber,
    client_name: data.to.name,
    client_email: data.to.email,
    client_address: data.to.addressLines.join("\n"),
    items: data.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    })),
    tax_rate: 0,
    currency: "KES",
    status: "DRAFT" as const,
    issue_date: data.issuedDate,
    due_date: data.paymentDueDate,
    notes: "",
  }), []);

  const handleSave = async () => {
    const values = form.getValues();
    if (!values.referenceNumber.trim() || !values.to.name.trim()) {
      toast.error("Reference number and client name are required");
      return;
    }
    if (!values.items.length || !values.items[0].description) {
      toast.error("At least one line item is required");
      return;
    }
    setSaving(true);
    try {
      await adminInvoicesApi.create(mapFormToApi(values));
      toast.success("Invoice saved as draft");
      fetchInvoices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    const values = form.getValues();
    if (!values.referenceNumber.trim() || !values.to.name.trim()) {
      toast.error("Reference number and client name are required");
      return;
    }
    if (!values.items.length || !values.items[0].description) {
      toast.error("At least one line item is required");
      return;
    }
    setSaving(true);
    try {
      await adminInvoicesApi.create({ ...mapFormToApi(values), status: "SENT" });
      toast.success("Invoice sent");
      fetchInvoices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSaving(false);
    }
  };

  const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    DRAFT: "outline",
    SENT: "secondary",
    PAID: "default",
    CANCELLED: "destructive",
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
      header: "Amount",
      cell: (i) => (
        <span className="tabular-nums font-medium">
          {i.total} {i.currency}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (i) => (
        <Badge variant={statusColor[i.status] ?? "outline"}>{i.status}</Badge>
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
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">Create, track, and manage invoices.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={handleSave} disabled={saving}>
            <Save data-icon="inline-start" />
            Save Draft
          </Button>
          <Button type="button" onClick={handleSend} disabled={saving}>
            <Send data-icon="inline-start" />
            Send Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">
            <Plus data-icon="inline-start" />
            New Invoice
          </TabsTrigger>
          <TabsTrigger value="list">
            <FileText data-icon="inline-start" />
            All Invoices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-4">
          <FormProvider {...form}>
            <div className="grid gap-5 xl:grid-cols-2">
              <InvoiceForm />
              <InvoicePreview invoice={invoiceWatch} />
            </div>
          </FormProvider>
          <PrintInvoice invoice={invoiceWatch} />
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={invoices}
                loading={loading}
                error={error}
                onRefresh={fetchInvoices}
                emptyMessage="No invoices yet."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
