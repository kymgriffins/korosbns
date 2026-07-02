"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormDialog } from "@/components/admin/form-dialog";
import { adminCampaignsApi, type NewsletterCampaign } from "@/lib/admin-api";

type Mode = "create" | "edit";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ subject: "", body_plain: "", audience_type: "all_active" });

  const fetchCampaigns = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await adminCampaignsApi.list({ page, status: statusFilter || undefined });
      setCampaigns(res.results);
      setTotal(res.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const resetForm = () => setForm({ subject: "", body_plain: "", audience_type: "all_active" });

  const openCreate = () => { setMode("create"); setEditId(null); resetForm(); setDialogOpen(true); };

  const openEdit = (c: NewsletterCampaign) => {
    setMode("edit"); setEditId(c.id);
    setForm({ subject: c.subject, body_plain: c.body_plain || "", audience_type: c.audience_type || "all_active" });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.subject) { toast.error("Subject is required"); return; }
    setSaving(true);
    try {
      if (mode === "create") { await adminCampaignsApi.create(form); toast.success("Campaign created"); }
      else if (editId) { await adminCampaignsApi.update(editId, form); toast.success("Campaign updated"); }
      setDialogOpen(false); fetchCampaigns();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Operation failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    try { await adminCampaignsApi.delete(id); toast.success("Campaign deleted"); fetchCampaigns(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Failed to delete campaign"); }
  };

  const handleSend = async (id: string) => {
    try { await adminCampaignsApi.send(id); toast.success("Campaign sent"); fetchCampaigns(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Failed to send campaign"); }
  };

  const columns: Column<NewsletterCampaign>[] = [
    { key: "subject", header: "Subject", cell: (r) => <span className="font-medium">{r.subject}</span> },
    { key: "status_display", header: "Status", cell: (r) => <span>{r.status_display}</span> },
    { key: "audience_type_display", header: "Audience", cell: (r) => <span>{r.audience_type_display}</span> },
    { key: "recipient_count", header: "Recipients", cell: (r) => <span className="tabular-nums">{r.recipient_count}</span> },
    { key: "sent_at", header: "Sent", cell: (r) => (r.sent_at ? new Date(r.sent_at).toLocaleDateString() : "-") },
    {
      key: "actions", header: "", cell: (r) => (
        <div className="flex gap-1">
          {(r.status === "draft" || r.status === "cancelled") && (
            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(r)} title="Edit"><Pencil className="size-3.5" /></Button>
          )}
          {r.status === "draft" && (
            <Button variant="ghost" size="icon-sm" onClick={() => handleSend(r.id)} title="Send now"><Send className="size-3.5" /></Button>
          )}
          {(r.status === "draft" || r.status === "cancelled") && (
            <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(r.id)} title="Delete"><Trash2 className="size-3.5" /></Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Create, edit, schedule, and send newsletter campaigns.</p>
        </div>
      </div>
      <Card><CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">All Campaigns</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sending">Sending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={openCreate}><Plus /> New Campaign</Button>
          </div>
        </div>
      </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={campaigns} loading={loading} error={error}
            emptyMessage="No campaigns found. Create one to get started."
            page={page} totalPages={Math.ceil(total / 25)} onPageChange={setPage} />
        </CardContent>
      </Card>
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create Campaign" : "Edit Campaign"}
        onSubmit={handleSubmit} loading={saving}>
        <div className="space-y-2"><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></div>
        <div className="space-y-2"><Label>Body</Label><Textarea value={form.body_plain} onChange={(e) => setForm({ ...form, body_plain: e.target.value })} rows={6} required /></div>
        <div className="space-y-2">
          <Label>Audience</Label>
          <Select value={form.audience_type} onValueChange={(v) => setForm({ ...form, audience_type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all_active">All Active Subscribers</SelectItem>
              <SelectItem value="by_source">By Source</SelectItem>
              <SelectItem value="selected">Selected Subscribers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormDialog>
    </div>
  );
}
