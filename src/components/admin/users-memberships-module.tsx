"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Membership = {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: string;
  status: string;
};

type Props = {
  canManageUsers: boolean;
  canManageMemberships: boolean;
};

export function UsersMembershipsModule({ canManageUsers, canManageMemberships }: Props) {
  const [items, setItems] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!canManageUsers) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/workflows/memberships", { cache: "no-store" });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.message ?? payload?.error ?? "Failed to load memberships");
      setItems(payload?.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load memberships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [canManageUsers]);

  const updateMembership = async (memberId: string, patch: Partial<Membership>) => {
    setError("");
    try {
      const res = await fetch(`/api/admin/workflows/memberships/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.message ?? payload?.error ?? "Update failed");
      setItems((prev) => prev.map((row) => (row.id === memberId ? { ...row, ...payload } : row)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  if (!canManageUsers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users & Memberships</CardTitle>
          <CardDescription>Your role cannot manage users.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users & Memberships</CardTitle>
        <CardDescription>Manage organization member role and access status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{items.length} members</p>
          <Button variant="outline" onClick={() => void load()} disabled={loading}>
            Refresh
          </Button>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {items.map((row) => (
          <div key={row.id} className="grid grid-cols-1 gap-2 rounded border p-3 md:grid-cols-4">
            <div>
              <p className="font-medium">{row.name || row.email}</p>
              <p className="text-xs text-muted-foreground">{row.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <Select
                value={row.role}
                disabled={!canManageMemberships}
                onValueChange={(value) => void updateMembership(row.id, { role: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">owner</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                  <SelectItem value="editor">editor</SelectItem>
                  <SelectItem value="viewer">viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Select
                value={row.status}
                disabled={!canManageMemberships}
                onValueChange={(value) => void updateMembership(row.id, { status: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">active</SelectItem>
                  <SelectItem value="pending">pending</SelectItem>
                  <SelectItem value="revoked">revoked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end justify-end text-xs text-muted-foreground">
              {canManageMemberships ? "Editable" : "Read-only"}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
