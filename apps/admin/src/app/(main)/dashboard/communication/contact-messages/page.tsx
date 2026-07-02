"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Reply, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminContactMessagesApi, type ContactMessage } from "@/lib/admin-api";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminContactMessagesApi.list({
        page,
        status: statusFilter || undefined,
        q: searchQuery || undefined,
      });
      setMessages(res.results);
      setTotal(res.count);
    } catch (err) {
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
    try {
      await adminContactMessagesApi.delete(id);
      toast.success("Message deleted");
      fetchMessages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!replyId) return;
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      await adminContactMessagesApi.reply(replyId, form.get("reply_body") as string);
      toast.success("Reply sent");
      setReplyOpen(false);
      setReplyId(null);
      fetchMessages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSaving(false);
    }
  };

  const openReply = (id: string) => {
    setReplyId(id);
    setReplyOpen(true);
  };

  const columns: Column<ContactMessage>[] = [
    { key: "name", header: "Name", cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "email", header: "Email", cell: (r) => <span>{r.email}</span> },
    {
      key: "message",
      header: "Message",
      cell: (r) => <span className="line-clamp-2 max-w-xs text-muted-foreground">{r.message}</span>,
    },
    { key: "status_display", header: "Status", cell: (r) => <span>{r.status_display}</span> },
    { key: "source", header: "Source", cell: (r) => <span>{r.source}</span> },
    {
      key: "created_at",
      header: "Date",
      cell: (r) => <span>{new Date(r.created_at).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <div className="flex gap-1">
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
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Contact Messages</h1>
        <p className="text-sm text-muted-foreground">
          Manage contact form submissions from citizens.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg">Messages</CardTitle>
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
                <SelectTrigger className="w-32"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
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
            totalPages={Math.ceil(total / 25)}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <Dialog open={replyOpen} onOpenChange={(o) => { setReplyOpen(o); if (!o) setReplyId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reply to Message</DialogTitle></DialogHeader>
          <form onSubmit={handleReply} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reply_body">Your Reply</Label>
              <Textarea id="reply_body" name="reply_body" rows={6} required />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => { setReplyOpen(false); setReplyId(null); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>{saving ? "Sending..." : "Send Reply"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
