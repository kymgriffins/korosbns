"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminEmailHooksApi, type EmailHook } from "@/lib/admin-api";

export default function EmailHooksPage() {
  const [hooks, setHooks] = useState<EmailHook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});

  const fetchHooks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminEmailHooksApi.list({
        status: statusFilter === "all" ? undefined : statusFilter,
        q: searchQuery || undefined,
      });
      setHooks(res.results ?? []);
      setCounts(res.counts ?? {});
    } catch (err) {
      setHooks([]);
      setCounts({});
      setError(err instanceof Error ? err.message : "Failed to load email hooks");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchHooks();
  }, [fetchHooks]);

  const handleResend = async (id: string) => {
    try {
      await adminEmailHooksApi.resend(id);
      toast.success("Resend initiated");
      fetchHooks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend");
    }
  };

  const columns: Column<EmailHook>[] = [
    { key: "recipient", header: "Recipient", cell: (r) => <span>{r.recipient}</span> },
    { key: "subject", header: "Subject", cell: (r) => <span>{r.subject}</span> },
    { key: "source", header: "Source", cell: (r) => <span>{r.source}</span> },
    { key: "status_display", header: "Status", cell: (r) => <span>{r.status_display}</span> },
    {
      key: "error_message",
      header: "Error",
      cell: (r) => <span className="line-clamp-2 max-w-xs">{r.error_message || "-"}</span>,
    },
    {
      key: "sent_at",
      header: "Sent",
      cell: (r) => <span>{r.sent_at ? new Date(r.sent_at).toLocaleDateString() : "-"}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (r) =>
        r.status === "failed" || r.status === "pending" ? (
          <Button variant="ghost" size="icon-sm" onClick={() => handleResend(r.id)} title="Resend">
            <RefreshCw className="size-3.5" />
          </Button>
        ) : null,
    },
  ];

  const countEntries = Object.entries(counts).filter(([key]) => key !== "total");

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Email Hooks</h1>
        <p className="text-sm text-muted-foreground">Delivery audit log for all emails sent by the system.</p>
      </div>

      {!loading && !error && countEntries.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {countEntries.map(([key, val]) => (
            <Card key={key} className="min-w-[100px] flex-1">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold tabular-nums">{val}</div>
                <div className="text-xs capitalize text-muted-foreground">{key}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg">Delivery Log</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search hooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={hooks}
            loading={loading}
            error={error}
            emptyMessage="No email hooks found."
          />
        </CardContent>
      </Card>
    </div>
  );
}
