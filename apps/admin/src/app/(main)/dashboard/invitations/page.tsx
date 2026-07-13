"use client";

import { useCallback, useEffect, useState } from "react";
import { Ban } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminInvitationsApi,
  INVITE_ROLE_OPTIONS,
  type AdminInvitation,
} from "@/lib/admin-api";

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "pending") return "default";
  if (status === "accepted") return "secondary";
  if (status === "revoked" || status === "expired" || status === "declined") return "outline";
  return "secondary";
}

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ email: "", role_slug: "editor", message: "" });

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminInvitationsApi.list({ page });
      setInvitations(res.results);
      setTotalPages(Math.max(1, Math.ceil((res.count ?? res.results.length) / 20)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invitations");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const openCreate = () => {
    setForm({ email: "", role_slug: "editor", message: "" });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }
    setSaving(true);
    try {
      await adminInvitationsApi.create({
        email: form.email.trim(),
        role_slug: form.role_slug,
        message: form.message.trim() || undefined,
      });
      toast.success("Invitation sent");
      setDialogOpen(false);
      fetchInvitations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this pending invitation?")) return;
    try {
      await adminInvitationsApi.revoke(id);
      toast.success("Invitation revoked");
      fetchInvitations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Revoke failed");
    }
  };

  const columns: Column<AdminInvitation>[] = [
    {
      key: "email",
      header: "Email",
      cell: (inv) => <span className="font-medium">{inv.email}</span>,
    },
    {
      key: "role_name",
      header: "Role",
      cell: (inv) => (
        <Badge variant="secondary" className="text-[10px]">
          {inv.role_name || "—"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (inv) => (
        <Badge variant={statusVariant(inv.status)} className="text-[10px] capitalize">
          {inv.status}
        </Badge>
      ),
    },
    {
      key: "invited_by_name",
      header: "Invited by",
      cell: (inv) => (
        <span className="text-sm text-muted-foreground">{inv.invited_by_name || "—"}</span>
      ),
    },
    {
      key: "expires_at",
      header: "Expires",
      cell: (inv) => (
        <span className="text-sm text-muted-foreground">
          {inv.expires_at ? new Date(inv.expires_at).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Sent",
      cell: (inv) => (
        <span className="text-sm text-muted-foreground">
          {new Date(inv.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      cell: (inv) =>
        inv.status === "pending" ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleRevoke(inv.id)}
            className="text-destructive hover:text-destructive"
            title="Revoke"
          >
            <Ban className="size-3.5" />
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Invitations</h1>
        <p className="text-sm text-muted-foreground">
          Invite organization members and revoke pending invites
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={invitations}
            loading={loading}
            error={error}
            emptyMessage="No invitations yet."
            onCreate={openCreate}
            createLabel="Send Invite"
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Invite Member"
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel="Send Invite"
      >
        <div className="space-y-2">
          <Label htmlFor="invite-email">Email</Label>
          <Input
            id="invite-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="colleague@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select
            value={form.role_slug}
            onValueChange={(v) => setForm({ ...form, role_slug: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INVITE_ROLE_OPTIONS.map((r) => (
                <SelectItem key={r.slug} value={r.slug}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="invite-message">Message (optional)</Label>
          <Textarea
            id="invite-message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Optional note included in the invite email"
            rows={3}
          />
        </div>
      </FormDialog>
    </div>
  );
}
