"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuditItem = {
  id: string;
  action: string;
  user_email?: string | null;
  target_model?: string | null;
  target_id?: string | null;
  created_at: string;
};

type Props = {
  orgId?: string;
};

export function AuditLogModule({ orgId }: Props) {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!orgId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/audit?orgId=${encodeURIComponent(orgId)}`, { cache: "no-store" });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.message ?? payload?.error ?? "Failed to load audit logs");
      setItems(Array.isArray(payload?.results) ? payload.results : payload?.results?.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [orgId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
        <CardDescription>Immutable record of admin actions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => void load()} disabled={loading || !orgId}>Refresh</Button>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {!orgId ? <p className="text-sm text-muted-foreground">No active organization context.</p> : null}
        {items.map((row) => (
          <div key={row.id} className="rounded border p-3 text-sm">
            <p className="font-medium">{row.action}</p>
            <p className="text-muted-foreground">{row.user_email || "system"} · {row.target_model || "n/a"} · {row.target_id || "n/a"}</p>
            <p className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString()}</p>
          </div>
        ))}
        {!items.length && orgId && !loading ? <p className="text-sm text-muted-foreground">No audit events found.</p> : null}
      </CardContent>
    </Card>
  );
}
