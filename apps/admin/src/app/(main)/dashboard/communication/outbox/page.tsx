"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminOutboxApi, type NewsletterOutboxEmail } from "@/lib/admin-api";

export default function OutboxPage() {
  const [emails, setEmails] = useState<NewsletterOutboxEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminOutboxApi.list({ page, status: statusFilter || undefined });
      setEmails(res.results);
      setTotal(res.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load outbox");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);

  const handleDispatch = async () => {
    try {
      const res = await adminOutboxApi.dispatch();
      toast.success(`Dispatched: ${res.sent} sent, ${res.failed} failed`);
      fetchEmails();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to dispatch");
    }
  };

  const handleRetry = async (id: string) => {
    try {
      await adminOutboxApi.retry(id);
      toast.success("Retry initiated");
      fetchEmails();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to retry");
    }
  };

  const columns: Column<NewsletterOutboxEmail>[] = [
    { key: "email_type_display", header: "Type", cell: (r) => <span>{r.email_type_display}</span> },
    { key: "subscriber_email", header: "Subscriber", cell: (r) => <span>{r.subscriber_email}</span> },
    { key: "subject", header: "Subject", cell: (r) => <span>{r.subject}</span> },
    { key: "status_display", header: "Status", cell: (r) => <span>{r.status_display}</span> },
    {
      key: "attempts",
      header: "Attempts",
      cell: (r) => <span className="tabular-nums">{r.attempts}</span>,
    },
    {
      key: "error_message",
      header: "Error",
      cell: (r) => <span>{r.error_message || "-"}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <div className="flex gap-1">
          {r.status === "failed" && (
            <Button variant="ghost" size="icon-sm" onClick={() => handleRetry(r.id)} title="Retry">
              <RefreshCw className="size-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Outbox</h1>
          <p className="text-sm text-muted-foreground">
            Subscription emails — welcome messages and admin alerts.
          </p>
        </div>
        <Button size="sm" onClick={handleDispatch}>
          <Send /> Dispatch Pending
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Subscription Emails</CardTitle>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={emails}
            loading={loading}
            error={error}
            emptyMessage="No outbound emails."
            page={page}
            totalPages={Math.ceil(total / 25)}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
