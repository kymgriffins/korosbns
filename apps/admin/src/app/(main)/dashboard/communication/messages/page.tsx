"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarClock,
  Check,
  Eye,
  Forward,
  Inbox,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Reply,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormDialog } from "@/components/admin/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  adminCampaignsApi,
  adminContactMessagesApi,
  adminInboxApi,
  adminOutboxApi,
  type ContactMessage,
  type NewsletterCampaign,
  type NewsletterInboxMessage,
  type NewsletterOutboxEmail,
} from "@/lib/admin-api";

type MessagesTab = "inbox" | "outbox" | "contacts" | "campaigns";

const PAGE_SIZE = 50;

export default function MessagesPage() {
  const [tab, setTab] = useState<MessagesTab>("inbox");

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Consolidated inbox, outbox, contact messages, and campaigns.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {([
          { id: "inbox" as const, label: "Inbox", icon: Inbox },
          { id: "outbox" as const, label: "Outbox", icon: Forward },
          { id: "contacts" as const, label: "Contact Messages", icon: Phone },
          { id: "campaigns" as const, label: "Campaigns", icon: Send },
        ] satisfies { id: MessagesTab; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(
          (t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ),
        )}
      </div>

      {tab === "inbox" && <InboxSection />}
      {tab === "outbox" && <OutboxSection />}
      {tab === "contacts" && <ContactMessagesSection />}
      {tab === "campaigns" && <CampaignsSection />}
    </div>
  );
}

/* ── Inbox ───────────────────────────────────────────────── */

function InboxSection() {
  const [messages, setMessages] = useState<NewsletterInboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<NewsletterInboxMessage | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminInboxApi.list({
        page,
        message_type: typeFilter === "all" ? undefined : typeFilter,
        is_read: readFilter === "all" ? undefined : readFilter === "read",
      });
      setMessages(res.results ?? []);
      setTotal(res.count ?? 0);
    } catch (err) {
      setMessages([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : "Failed to load inbox");
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, readFilter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleMarkRead = async (id: string) => {
    try {
      await adminInboxApi.markRead(id);
      toast.success("Marked as read");
      fetchMessages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark as read");
    }
  };

  const openDetail = async (id: string) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetail(null);
    try {
      const msg = await adminInboxApi.get(id);
      setDetail(msg);
      if (!msg.is_read) {
        try { await adminInboxApi.markRead(id); fetchMessages(); } catch { /* noop */ }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load message");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const columns: Column<NewsletterInboxMessage>[] = [
    {
      key: "is_read",
      header: "",
      cell: (r) => (
        <span className={`inline-block size-2 rounded-full ${r.is_read ? "bg-transparent" : "bg-blue-500"}`} />
      ),
    },
    { key: "message_type_display", header: "Type", cell: (r) => <span>{r.message_type_display}</span> },
    { key: "from_email", header: "From", cell: (r) => <span>{r.from_email || "-"}</span> },
    { key: "subject", header: "Subject", cell: (r) => <span className="font-medium">{r.subject}</span> },
    {
      key: "received_at",
      header: "Received",
      cell: (r) => <span>{new Date(r.received_at).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openDetail(r.id)} title="View">
            <Eye className="size-3.5" />
          </Button>
          {!r.is_read && (
            <Button variant="ghost" size="icon-sm" onClick={() => handleMarkRead(r.id)} title="Mark read">
              <Check className="size-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg">Inbox</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="new_subscriber">New Subscriber</SelectItem>
                  <SelectItem value="inbound_reply">Inbound Reply</SelectItem>
                  <SelectItem value="bounce">Bounce</SelectItem>
                  <SelectItem value="staff_note">Staff Note</SelectItem>
                </SelectContent>
              </Select>
              <Select value={readFilter} onValueChange={(v) => { setReadFilter(v); setPage(1); }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Read status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={messages}
            loading={loading}
            error={error}
            emptyMessage="No inbox messages."
            page={page}
            totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{detail?.subject || "Message"}</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : detail ? (
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-muted-foreground">
                {detail.message_type_display}
                {detail.from_email ? ` · ${detail.from_email}` : ""}
                {" · "}
                {new Date(detail.received_at).toLocaleString()}
              </p>
              {detail.related_subscriber_email && (
                <p className="text-muted-foreground">Subscriber: {detail.related_subscriber_email}</p>
              )}
              <p className="whitespace-pre-wrap">{detail.body_plain || "(No body)"}</p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Outbox ───────────────────────────────────────────────── */

function OutboxSection() {
  const [emails, setEmails] = useState<NewsletterOutboxEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dispatching, setDispatching] = useState(false);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminOutboxApi.list({ page, status: statusFilter === "all" ? undefined : statusFilter });
      setEmails(res.results ?? []);
      setTotal(res.count ?? 0);
    } catch (err) {
      setEmails([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : "Failed to load outbox");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);

  const handleDispatch = async () => {
    setDispatching(true);
    try {
      const res = await adminOutboxApi.dispatch();
      toast.success(`Dispatched: ${res.sent} sent, ${res.failed} failed (${res.processed} processed)`);
      fetchEmails();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to dispatch");
    } finally {
      setDispatching(false);
    }
  };

  const handleRetry = async (id: string) => {
    try {
      await adminOutboxApi.retry(id);
      toast.success("Retry initiated");
      fetchEmails();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to retry");
    }
  };

  const columns: Column<NewsletterOutboxEmail>[] = [
    { key: "email_type_display", header: "Type", cell: (r) => <span>{r.email_type_display}</span> },
    { key: "subscriber_email", header: "Subscriber", cell: (r) => <span>{r.subscriber_email || r.recipient}</span> },
    { key: "subject", header: "Subject", cell: (r) => <span>{r.subject}</span> },
    { key: "status_display", header: "Status", cell: (r) => <span>{r.status_display}</span> },
    { key: "attempts", header: "Attempts", cell: (r) => <span className="tabular-nums">{r.attempts}</span> },
    { key: "error_message", header: "Error", cell: (r) => <span className="line-clamp-2 max-w-xs">{r.error_message || "-"}</span> },
    {
      key: "actions",
      header: "",
      cell: (r) =>
        r.status === "failed" ? (
          <Button variant="ghost" size="icon-sm" onClick={() => handleRetry(r.id)} title="Retry">
            <RefreshCw className="size-3.5" />
          </Button>
        ) : null,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Outbox</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleDispatch} disabled={dispatching}>
              <Send /> {dispatching ? "Dispatching..." : "Dispatch Pending"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={emails}
          loading={loading}
          error={error}
          emptyMessage="No outbound emails."
          page={page}
          totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  );
}

/* ── Contact Messages + Conversation Thread ─────────────── */

type ReplyEntry = { body: string; sent_at: string };

function ContactMessagesSection() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyMsg, setReplyMsg] = useState<ContactMessage | null>(null);
  const [conversation, setConversation] = useState<ReplyEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<ContactMessage | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminContactMessagesApi.list({
        page,
        status: statusFilter === "all" ? undefined : statusFilter,
        q: searchQuery || undefined,
      });
      setMessages(res.results ?? []);
      setTotal(res.count ?? 0);
    } catch (err) {
      setMessages([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchQuery]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleMarkRead = async (id: string) => {
    try {
      await adminContactMessagesApi.markRead(id);
      toast.success("Marked as read");
      fetchMessages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark as read");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact message?")) return;
    try {
      await adminContactMessagesApi.delete(id);
      toast.success("Message deleted");
      fetchMessages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const openDetail = async (id: string) => {
    try {
      const msg = await adminContactMessagesApi.get(id);
      setDetail(msg);
      setDetailOpen(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load message");
    }
  };

  const openReply = async (id: string) => {
    try {
      const msg = await adminContactMessagesApi.get(id);
      setReplyMsg(msg);
      setConversation([]);
      setReplyOpen(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load message");
    }
  };

  const handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!replyMsg) return;
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      const body = form.get("reply_body") as string;
      await adminContactMessagesApi.reply(replyMsg.id, body);
      setConversation((prev) => [...prev, { body, sent_at: new Date().toISOString() }]);
      toast.success("Reply sent");
      e.currentTarget.reset();
      fetchMessages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<ContactMessage>[] = [
    { key: "name", header: "Name", cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "email", header: "Email", cell: (r) => <span>{r.email}</span> },
    { key: "message", header: "Message", cell: (r) => <span className="line-clamp-2 max-w-xs text-muted-foreground">{r.message}</span> },
    { key: "status_display", header: "Status", cell: (r) => <span>{r.status_display}</span> },
    { key: "source", header: "Source", cell: (r) => <span>{r.source}</span> },
    { key: "created_at", header: "Date", cell: (r) => <span>{new Date(r.created_at).toLocaleDateString()}</span> },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openDetail(r.id)} title="View">
            <Eye className="size-3.5" />
          </Button>
          {r.status === "NEW" && (
            <Button variant="ghost" size="icon-sm" onClick={() => handleMarkRead(r.id)} title="Mark read">
              <Check className="size-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={() => openReply(r.id)} title="Reply">
            <Reply className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(r.id)} title="Delete">
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg">Contact Messages</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  className="w-56 pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="READ">Read</SelectItem>
                  <SelectItem value="REPLIED">Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={messages}
            loading={loading}
            error={error}
            emptyMessage="No contact messages."
            page={page}
            totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      {/* Conversation Thread Reply Dialog */}
      <Dialog
        open={replyOpen}
        onOpenChange={(o) => {
          setReplyOpen(o);
          if (!o) { setReplyMsg(null); setConversation([]); }
        }}
      >
        <DialogContent className="max-w-xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Reply to {replyMsg?.name || "Message"}
            </DialogTitle>
          </DialogHeader>
          {replyMsg && (
            <div className="flex flex-col gap-4 overflow-y-auto">
              {/* Original message */}
              <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium">{replyMsg.name} &lt;{replyMsg.email}&gt;</span>
                  <span>{new Date(replyMsg.created_at).toLocaleString()}</span>
                </div>
                <p className="whitespace-pre-wrap">{replyMsg.message}</p>
              </div>

              {/* Previous replies in thread */}
              {conversation.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground">Replies in this session:</p>
                  {conversation.map((rep, i) => (
                    <div key={i} className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium text-primary">Your reply</span>
                        <span>{new Date(rep.sent_at).toLocaleString()}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{rep.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              <form onSubmit={handleReply} className="flex flex-col gap-3 border-t pt-3">
                <Label htmlFor="reply_body">Your Reply</Label>
                <Textarea id="reply_body" name="reply_body" rows={5} required placeholder="Type your reply..." />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => { setReplyOpen(false); setReplyMsg(null); setConversation([]); }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Sending..." : "Send Reply"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{detail?.name || "Message"}</DialogTitle>
          </DialogHeader>
          {detail ? (
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-muted-foreground">
                {detail.email} · {detail.status_display} · {detail.source}
              </p>
              <p className="whitespace-pre-wrap">{detail.message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(detail.created_at).toLocaleString()}
              </p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Campaigns ──────────────────────────────────────────── */

type Mode = "create" | "edit";

function CampaignsSection() {
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
    subject: string; body_plain?: string; audience_count: number; sample_emails: string[];
  } | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminCampaignsApi.list({ page, status: statusFilter === "all" ? undefined : statusFilter });
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

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const resetForm = () => setForm({ subject: "", body_plain: "", audience_type: "all_active" });

  const openCreate = () => { setMode("create"); setEditId(null); resetForm(); setDialogOpen(true); };

  const openEdit = (c: NewsletterCampaign) => {
    setMode("edit"); setEditId(c.id);
    setForm({ subject: c.subject, body_plain: c.body_plain || "", audience_type: c.audience_type || "all_active" });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.subject.trim()) { toast.error("Subject is required"); return; }
    setSaving(true);
    try {
      if (mode === "create") { await adminCampaignsApi.create(form); toast.success("Campaign created"); }
      else if (editId) { await adminCampaignsApi.update(editId, form); toast.success("Campaign updated"); }
      setDialogOpen(false); fetchCampaigns();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    try { await adminCampaignsApi.delete(id); toast.success("Campaign deleted"); fetchCampaigns(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Failed to delete campaign"); }
  };

  const handleSend = async (id: string) => {
    if (!confirm("Send this campaign to its audience now?")) return;
    try { await adminCampaignsApi.send(id); toast.success("Campaign send started"); fetchCampaigns(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Failed to send campaign"); }
  };

  const openSchedule = (id: string) => { setScheduleId(id); setScheduledAt(""); setScheduleOpen(true); };

  const handleSchedule = async () => {
    if (!scheduleId || !scheduledAt) { toast.error("Pick a date and time"); return; }
    setScheduling(true);
    try {
      await adminCampaignsApi.schedule(scheduleId, new Date(scheduledAt).toISOString());
      toast.success("Campaign scheduled"); setScheduleOpen(false); fetchCampaigns();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to schedule");
    } finally { setScheduling(false); }
  };

  const handlePreview = async (id: string) => {
    setPreviewOpen(true); setPreviewLoading(true); setPreview(null);
    try {
      const res = await adminCampaignsApi.preview(id);
      setPreview({ subject: res.subject, body_plain: res.body_plain, audience_count: res.audience_count, sample_emails: res.sample_emails ?? [] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load preview");
      setPreviewOpen(false);
    } finally { setPreviewLoading(false); }
  };

  const columns: Column<NewsletterCampaign>[] = [
    { key: "subject", header: "Subject", cell: (r) => <span className="font-medium">{r.subject}</span> },
    { key: "status_display", header: "Status", cell: (r) => <span>{r.status_display}</span> },
    { key: "audience_type_display", header: "Audience", cell: (r) => <span>{r.audience_type_display}</span> },
    { key: "recipient_count", header: "Recipients", cell: (r) => <span className="tabular-nums">{r.recipient_count}</span> },
    { key: "scheduled_at", header: "Scheduled", cell: (r) => (r.scheduled_at ? new Date(r.scheduled_at).toLocaleString() : "-") },
    { key: "sent_at", header: "Sent", cell: (r) => (r.sent_at ? new Date(r.sent_at).toLocaleDateString() : "-") },
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
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Campaigns</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
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
            emptyMessage="No campaigns found."
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
          <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Body</Label>
          <Textarea value={form.body_plain} onChange={(e) => setForm({ ...form, body_plain: e.target.value })} rows={6} required />
        </div>
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

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule Campaign</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Send at</Label>
              <Input id="scheduled_at" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setScheduleOpen(false)}>Cancel</Button>
              <Button type="button" disabled={scheduling} onClick={handleSchedule}>
                {scheduling ? "Scheduling..." : "Schedule"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Campaign Preview</DialogTitle></DialogHeader>
          {previewLoading ? (
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          ) : preview ? (
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="font-medium">{preview.subject}</p>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{preview.body_plain || "(No plain-text body)"}</p>
              </div>
              <p>Audience: <span className="tabular-nums font-medium">{preview.audience_count}</span></p>
              {preview.sample_emails.length > 0 ? (
                <div>
                  <p className="mb-1 text-muted-foreground">Sample recipients</p>
                  <ul className="max-h-40 overflow-auto rounded border p-2 text-xs">
                    {preview.sample_emails.map((email) => <li key={email}>{email}</li>)}
                  </ul>
                </div>
              ) : <p className="text-muted-foreground">No sample recipients returned.</p>}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
