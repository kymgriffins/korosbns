"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, ExternalLink } from "lucide-react";
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

export default function InboxPage() {
  const [messages, setMessages] = useState<NewsletterInboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminInboxApi.list({ page, message_type: typeFilter || undefined });
      setMessages(res.results);
      setTotal(res.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inbox");
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter]);

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
            <Button size="sm"><ExternalLink /> Add Note</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Staff Note</DialogTitle></DialogHeader>
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
                <Button variant="outline" type="button" onClick={() => setNoteOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Note"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Messages</CardTitle>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                <SelectItem value="new_subscriber">New Subscriber</SelectItem>
                <SelectItem value="inbound_reply">Inbound Reply</SelectItem>
                <SelectItem value="bounce">Bounce</SelectItem>
                <SelectItem value="staff_note">Staff Note</SelectItem>
              </SelectContent>
            </Select>
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
            totalPages={Math.ceil(total / 25)}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
