"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarClock, Eye, Pencil, Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormDialog } from "@/components/admin/form-dialog";
import { adminCampaignsApi, type NewsletterCampaign } from "@/lib/admin-api";

type Mode = "create" | "edit";

const PAGE_SIZE = 50;

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ subject: "", body_plain: "", audience_type: "all_active" });
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [preview, setPreview] = useState<{
    subject: string;
    body_plain?: string;
    audience_count: number;
    sample_emails: string[];
  } | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminCampaignsApi.list({
        page,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setCampaigns(res.results ?? []);
      setTotal(res.count ?? 0);
    } catch (err) {
      setCampaigns([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const resetForm = () => setForm({ subject: "", body_plain: "", audience_type: "all_active" });

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (c: NewsletterCampaign) => {
    setMode("edit");
    setEditId(c.id);
    setForm({
      subject: c.subject,
      body_plain: c.body_plain || "",
      audience_type: c.audience_type || "all_active",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        await adminCampaignsApi.create(form);
        toast.success("Campaign created");
      } else if (editId) {
        await adminCampaignsApi.update(editId, form);
        toast.success("Campaign updated");
      }
      setDialogOpen(false);
      fetchCampaigns();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    try {
      await adminCampaignsApi.delete(id);
      toast.success("Campaign deleted");
      fetchCampaigns();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete campaign");
    }
  };

  const handleSend = async (id: string) => {
    if (!confirm("Send this campaign to its audience now?")) return;
    try {
      await adminCampaignsApi.send(id);
      toast.success("Campaign send started");
      fetchCampaigns();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send campaign");
    }
  };

  const openSchedule = (id: string) => {
    setScheduleId(id);
    setScheduledAt("");
    setScheduleOpen(true);
  };

  const handleSchedule = async () => {
    if (!scheduleId || !scheduledAt) {
      toast.error("Pick a date and time");
      return;
    }
    setScheduling(true);
    try {
      await adminCampaignsApi.schedule(scheduleId, new Date(scheduledAt).toISOString());
      toast.success("Campaign scheduled");
      setScheduleOpen(false);
      fetchCampaigns();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to schedule");
    } finally {
      setScheduling(false);
    }
  };

  const handlePreview = async (id: string) => {
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreview(null);
    try {
      const res = await adminCampaignsApi.preview(id);
      setPreview({
        subject: res.subject,
        body_plain: res.body_plain,
        audience_count: res.audience_count,
        sample_emails: res.sample_emails ?? [],
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load preview");
      setPreviewOpen(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  const columns: Column<NewsletterCampaign>[] = [
    { key: "subject", header: "Subject", cell: (r) => <span className="font-medium">{r.subject}</span> },
    { key: "status_display", header: "Status", cell: (r) => <span>{r.status_display}</span> },
    { key: "audience_type_display", header: "Audience", cell: (r) => <span>{r.audience_type_display}</span> },
    {
      key: "recipient_count",
      header: "Recipients",
      cell: (r) => <span className="tabular-nums">{r.recipient_count}</span>,
    },
    {
      key: "scheduled_at",
      header: "Scheduled",
      cell: (r) => (r.scheduled_at ? new Date(r.scheduled_at).toLocaleString() : "-"),
    },
    {
      key: "sent_at",
      header: "Sent",
      cell: (r) => (r.sent_at ? new Date(r.sent_at).toLocaleDateString() : "-"),
    },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => handlePreview(r.id)} title="Preview">
            <Eye className="size-3.5" />
          </Button>
          {(r.status === "draft" || r.status === "cancelled") && (
            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(r)} title="Edit">
              <Pencil className="size-3.5" />
            </Button>
          )}
          {r.status === "draft" && (
            <>
              <Button variant="ghost" size="icon-sm" onClick={() => openSchedule(r.id)} title="Schedule">
                <CalendarClock className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => handleSend(r.id)} title="Send now">
                <Send className="size-3.5" />
              </Button>
            </>
          )}
          {(r.status === "draft" || r.status === "cancelled") && (
            <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(r.id)} title="Delete">
              <Trash2 className="size-3.5" />
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
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, schedule, preview, and send newsletter campaigns.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Campaigns</CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="sending">Sending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={openCreate}>
                <Plus /> New Campaign
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={campaigns}
            loading={loading}
            error={error}
            emptyMessage="No campaigns found. Create one to get started."
            page={page}
            totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create Campaign" : "Edit Campaign"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="space-y-2">
          <Label>Subject</Label>
          <Input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Body</Label>
          <Textarea
            value={form.body_plain}
            onChange={(e) => setForm({ ...form, body_plain: e.target.value })}
            rows={6}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Audience</Label>
          <Select
            value={form.audience_type}
            onValueChange={(v) => setForm({ ...form, audience_type: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_active">All Active Subscribers</SelectItem>
              <SelectItem value="by_source">By Source</SelectItem>
              <SelectItem value="selected">Selected Subscribers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormDialog>

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Campaign</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Send at</Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setScheduleOpen(false)}>
                Cancel
              </Button>
              <Button type="button" disabled={scheduling} onClick={handleSchedule}>
                {scheduling ? "Scheduling..." : "Schedule"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Campaign Preview</DialogTitle>
          </DialogHeader>
          {previewLoading ? (
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          ) : preview ? (
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="font-medium">{preview.subject}</p>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                  {preview.body_plain || "(No plain-text body)"}
                </p>
              </div>
              <p>
                Audience: <span className="tabular-nums font-medium">{preview.audience_count}</span>
              </p>
              {preview.sample_emails.length > 0 ? (
                <div>
                  <p className="mb-1 text-muted-foreground">Sample recipients</p>
                  <ul className="max-h-40 overflow-auto rounded border p-2 text-xs">
                    {preview.sample_emails.map((email) => (
                      <li key={email}>{email}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-muted-foreground">No sample recipients returned.</p>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
