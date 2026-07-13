"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminInboxApi, type NewsletterInboxMessage } from "@/lib/admin-api";

const PAGE_SIZE = 50;

export default function InboxPage() {
  const [messages, setMessages] = useState<NewsletterInboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [noteOpen, setNoteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

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
        try {
          await adminInboxApi.markRead(id);
          fetchMessages();
        } catch {
          /* list refresh optional */
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load message");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      await adminInboxApi.createNote({
        subject: form.get("subject") as string,
        body_plain: form.get("body_plain") as string,
      });
      toast.success("Note created");
      setNoteOpen(false);
      fetchMessages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create note");
    } finally {
      setSaving(false);
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
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
          <p className="text-sm text-muted-foreground">
            Newsletter inbox — subscriber replies, bounces, and staff notes.
          </p>
        </div>
        <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus /> Add Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Staff Note</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateNote} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="body_plain">Note</Label>
                <Textarea id="body_plain" name="body_plain" rows={6} required />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setNoteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Note"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg">Messages</CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={typeFilter}
                onValueChange={(v) => {
                  setTypeFilter(v);
                  setPage(1);
                }}
              >
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
              <Select
                value={readFilter}
                onValueChange={(v) => {
                  setReadFilter(v);
                  setPage(1);
                }}
              >
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
    </div>
  );
}
