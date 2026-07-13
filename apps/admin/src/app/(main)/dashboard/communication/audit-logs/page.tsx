"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Input } from "@/components/ui/input";
import { adminAuditLogsApi, normalizeListResponse, type AuditLogEntry } from "@/lib/admin-api";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminAuditLogsApi.list({ q: debouncedQ || undefined });
      const { results } = normalizeListResponse(res);
      setLogs(results);
    } catch (err) {
      setLogs([]);
      setError(err instanceof Error ? err.message : "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [debouncedQ]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const columns: Column<AuditLogEntry>[] = [
    {
      key: "created_at",
      header: "When",
      cell: (r) => <span>{new Date(r.created_at).toLocaleString()}</span>,
    },
    { key: "actor_email", header: "Actor", cell: (r) => <span>{r.actor_email || "-"}</span> },
    { key: "action", header: "Action", cell: (r) => <span className="font-medium">{r.action}</span> },
    { key: "target_model", header: "Target", cell: (r) => <span>{r.target_model || "-"}</span> },
    {
      key: "target_id",
      header: "Target ID",
      cell: (r) => <span className="font-mono text-xs">{r.target_id || "-"}</span>,
    },
    {
      key: "ip_address",
      header: "IP",
      cell: (r) => <span className="text-muted-foreground">{r.ip_address || "-"}</span>,
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          Recent admin actions (up to 100). Search by action, target model, or actor email.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg">Entries</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={logs}
            loading={loading}
            error={error}
            emptyMessage="No audit log entries found."
          />
        </CardContent>
      </Card>
    </div>
  );
}
