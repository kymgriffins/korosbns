import { adminInvoicesApi } from "@/lib/admin-api";
import type { AdminInvoice, AdminInvoiceSummary, AdminInvoiceWrite } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminInvoice, AdminInvoiceSummary };

let _invoices: AdminInvoice[] = [];

export const adminInvoicesData = {
  get: () => _invoices,
  set: (items: AdminInvoice[]) => { _invoices = items; },
  fetch: (params?: { status?: string }) =>
    withFallback(
      "admin-invoices",
      () => adminInvoicesApi.list(params).then((r) => {
        const results = r.results ?? [];
        _invoices = results;
        return { results, summary: r.summary ?? { total_count: 0, draft_count: 0, sent_count: 0, paid_count: 0, cancelled_count: 0, total_revenue: "0" } };
      }),
      () => ({ results: _invoices, summary: { total_count: _invoices.length, draft_count: 0, sent_count: 0, paid_count: 0, cancelled_count: 0, total_revenue: "0" } as AdminInvoiceSummary }),
    ),
  fetchById: (id: string) =>
    withFallback(
      "admin-invoices",
      () => adminInvoicesApi.get(id),
      () => _invoices.find((i) => i.id === id) ?? null,
    ),
  create: (data: AdminInvoiceWrite) =>
    withFallback(
      "admin-invoices",
      () => adminInvoicesApi.create(data).then((r) => {
        _invoices.unshift(r);
        return r;
      }),
      () => {
        const inv: AdminInvoice = {
          id: `new-${Date.now()}`,
          invoice_number: data.invoice_number,
          client_name: data.client_name,
          client_email: data.client_email ?? "",
          client_address: "",
          items: (data.items ?? []).map((i) => ({ description: i.description, quantity: i.quantity, unit_price: i.unit_price })),
          subtotal: "0",
          tax_rate: String(data.tax_rate ?? 0),
          tax_amount: "0",
          total: "0",
          currency: "KES",
          status: (data.status as AdminInvoice["status"]) ?? "DRAFT",
          issue_date: data.issue_date,
          due_date: data.due_date,
          notes: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        _invoices.unshift(inv);
        return inv;
      },
    ),
  update: (id: string, data: Partial<AdminInvoiceWrite> & { status?: AdminInvoice["status"] }) =>
    withFallback(
      "admin-invoices",
      () => adminInvoicesApi.update(id, data),
      () => {
        const idx = _invoices.findIndex((i) => i.id === id);
        if (idx !== -1) _invoices[idx] = { ..._invoices[idx], ...data } as AdminInvoice;
        return _invoices[idx] ?? null;
      },
    ),
  delete: (id: string) =>
    withFallback(
      "admin-invoices",
      () => adminInvoicesApi.delete(id).then(() => {
        _invoices = _invoices.filter((i) => i.id !== id);
      }),
      () => { _invoices = _invoices.filter((i) => i.id !== id); },
    ),
};
