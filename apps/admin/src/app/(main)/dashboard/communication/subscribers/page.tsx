"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminSubscribersApi, type NewsletterSubscriber } from "@/lib/admin-api";

const PAGE_SIZE = 20;

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeFilter, setActiveFilter] = useState("active");

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminSubscribersApi.list({
        page,
        active_only: activeFilter !== "all",
      });
      setSubscribers(res.results ?? []);
      setTotal(res.count ?? 0);
    } catch (err) {
      setSubscribers([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }, [page, activeFilter]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const columns: Column<NewsletterSubscriber>[] = [
    { key: "email", header: "Email", cell: (r) => <span className="font-medium">{r.email}</span> },
    { key: "name", header: "Name", cell: (r) => <span>{r.name || "-"}</span> },
    { key: "source", header: "Source", cell: (r) => <span>{r.source || "-"}</span> },
    {
      key: "consent_at",
      header: "Consented",
      cell: (r) => <span>{r.consent_at ? new Date(r.consent_at).toLocaleDateString() : "-"}</span>,
    },
    {
      key: "unsubscribed_at",
      header: "Status",
      cell: (r) => (
        <span>{r.unsubscribed_at ? `Unsubscribed ${new Date(r.unsubscribed_at).toLocaleDateString()}` : "Active"}</span>
      ),
    },
    {
      key: "created_at",
      header: "Joined",
      cell: (r) => <span>{new Date(r.created_at).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Subscribers</h1>
        <p className="text-sm text-muted-foreground">Newsletter subscribers for your organization.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {loading ? "…" : `${total.toLocaleString()} subscriber${total === 1 ? "" : "s"}`}
            </CardTitle>
            <Select
              value={activeFilter}
              onValueChange={(v) => {
                setActiveFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active only</SelectItem>
                <SelectItem value="all">Include unsubscribed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={subscribers}
            loading={loading}
            error={error}
            emptyMessage="No subscribers found."
            page={page}
            totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
