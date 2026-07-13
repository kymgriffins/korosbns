"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  adminNotificationsApi,
  normalizeListResponse,
  type NotificationQueueItem,
  type TriggerRule,
} from "@/lib/admin-api";

type Tab = "queue" | "history" | "rules";

export default function NotificationsPage() {
  const [tab, setTab] = useState<Tab>("queue");
  const [queue, setQueue] = useState<NotificationQueueItem[]>([]);
  const [history, setHistory] = useState<NotificationQueueItem[]>([]);
  const [rules, setRules] = useState<TriggerRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (tab === "queue") {
        const res = await adminNotificationsApi.queue({
          status: statusFilter === "all" ? undefined : statusFilter,
        });
        const { results } = normalizeListResponse(res);
        setQueue(results);
      } else if (tab === "history") {
        const res = await adminNotificationsApi.history({
          status: statusFilter === "all" ? undefined : statusFilter,
        });
        const { results } = normalizeListResponse(res);
        setHistory(results);
      } else {
        const res = await adminNotificationsApi.triggerRules();
        const { results } = normalizeListResponse(res);
        setRules(results);
      }
    } catch (err) {
      setQueue([]);
      setHistory([]);
      setRules([]);
      setError(err instanceof Error ? err.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [tab, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await adminNotificationsApi.toggleRule(id, enabled);
      toast.success(enabled ? "Rule enabled" : "Rule disabled");
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to toggle rule");
    }
  };

  const queueColumns: Column<NotificationQueueItem>[] = [
    { key: "trigger_type", header: "Trigger", cell: (r) => <span className="font-medium">{r.trigger_type}</span> },
    { key: "target_user_email", header: "User", cell: (r) => <span>{r.target_user_email || "-"}</span> },
    { key: "status_display", header: "Status", cell: (r) => <span>{r.status_display || r.status}</span> },
    {
      key: "attempts",
      header: "Attempts",
      cell: (r) => <span className="tabular-nums">{r.attempts}</span>,
    },
    {
      key: "skip_reason",
      header: "Skip reason",
      cell: (r) => <span className="line-clamp-1 max-w-xs">{r.skip_reason || "-"}</span>,
    },
    {
      key: "scheduled_at",
      header: "Scheduled",
      cell: (r) => <span>{r.scheduled_at ? new Date(r.scheduled_at).toLocaleString() : "-"}</span>,
    },
  ];

  const ruleColumns: Column<TriggerRule>[] = [
    { key: "event_type", header: "Event", cell: (r) => <span className="font-medium">{r.event_type}</span> },
    {
      key: "conditions",
      header: "Conditions",
      cell: (r) => (
        <span className="line-clamp-2 max-w-md font-mono text-xs text-muted-foreground">
          {JSON.stringify(r.conditions)}
        </span>
      ),
    },
    {
      key: "enabled",
      header: "Enabled",
      cell: (r) => (
        <Switch checked={r.enabled} onCheckedChange={(v) => handleToggle(r.id, v)} aria-label="Toggle rule" />
      ),
    },
    {
      key: "updated_at",
      header: "Updated",
      cell: (r) => <span>{new Date(r.updated_at).toLocaleDateString()}</span>,
    },
  ];

  const tabs: { id: Tab; label: string }[] = [
    { id: "queue", label: "Queue" },
    { id: "history", label: "History" },
    { id: "rules", label: "Trigger Rules" },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Dispatch queue, delivery history, and automated trigger rules.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {tab === "queue" ? "Dispatch Queue" : tab === "history" ? "Notification History" : "Trigger Rules"}
            </CardTitle>
            {tab !== "rules" && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="DISPATCHED">Dispatched</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="SKIPPED">Skipped</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {tab === "rules" ? (
            <DataTable
              columns={ruleColumns}
              data={rules}
              loading={loading}
              error={error}
              emptyMessage="No trigger rules configured."
            />
          ) : (
            <DataTable
              columns={queueColumns}
              data={tab === "queue" ? queue : history}
              loading={loading}
              error={error}
              emptyMessage={tab === "queue" ? "Notification queue is empty." : "No notification history."}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
