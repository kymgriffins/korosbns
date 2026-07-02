"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adminCampaignsApi, type NewsletterCampaign } from "@/lib/admin-api";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminCampaignsApi.list({ page, status: statusFilter || undefined });
      setCampaigns(res.results);
      setTotal(res.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      await adminCampaignsApi.create({
        subject: form.get("subject") as string,
        body_plain: form.get("body_plain") as string,
        audience_type: form.get("audience_type") as string,
      });
      toast.success("Campaign created");
      setCreateOpen(false);
      fetchCampaigns();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create campaign");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminCampaignsApi.delete(id);
      toast.success("Campaign deleted");
      fetchCampaigns();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete campaign");
    }
  };

  const handleSend = async (id: string) => {
    try {
      await adminCampaignsApi.send(id);
      toast.success("Campaign sent");
      fetchCampaigns();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send campaign");
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
      key: "sent_at",
      header: "Sent",
      cell: (r) => (r.sent_at ? new Date(r.sent_at).toLocaleDateString() : "-"),
    },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <div className="flex gap-1">
          {r.status === "draft" && (
            <Button variant="ghost" size="icon-sm" onClick={() => handleSend(r.id)} title="Send now">
              <Send className="size-3.5" />
            </Button>
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
            Create, schedule, and send newsletter campaigns.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus /> New Campaign</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Campaign</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="body_plain">Body</Label>
                <Textarea id="body_plain" name="body_plain" rows={6} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="audience_type">Audience</Label>
                <Select name="audience_type" defaultValue="all_active">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_active">All Active Subscribers</SelectItem>
                    <SelectItem value="by_source">By Source</SelectItem>
                    <SelectItem value="selected">Selected Subscribers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Campaigns</CardTitle>
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
            totalPages={Math.ceil(total / 25)}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
