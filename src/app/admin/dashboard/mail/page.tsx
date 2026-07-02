"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Inbox, Send, Users, MailWarning, RefreshCw, Loader2, CheckCircle, XCircle, Clock, ExternalLink, Reply, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { communicationData } from "@/data/communication";
import type { ContactMessage, EmailHook, NewsletterSubscriber } from "@/types/communication";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  READ: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  REPLIED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

const HOOK_STATUS_ICONS: Record<string, { icon: typeof CheckCircle; color: string }> = {
  sent: { icon: CheckCircle, color: "text-emerald-600" },
  pending: { icon: Clock, color: "text-amber-600" },
  claimed: { icon: ExternalLink, color: "text-blue-600" },
  failed: { icon: XCircle, color: "text-red-600" },
};

export default function MailPage() {
  const [tab, setTab] = useState("inbox");
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [hooks, setHooks] = useState<EmailHook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [replyDialog, setReplyDialog] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, s, h] = await Promise.all([
        communicationData.contacts.fetch(),
        communicationData.subscribers.fetch(),
        communicationData.emailHooks.fetch(),
      ]);
      setContacts(Array.isArray(c) ? c : []);
      setSubscribers(s.results ?? []);
      setHooks(Array.isArray(h) ? h : []);
    } catch {
      toast.error("Failed to load communication data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filteredContacts = contacts.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.message.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredSubscribers = subscribers.filter((s) =>
    !search || s.email.toLowerCase().includes(search.toLowerCase()) || (s.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  async function handleReply() {
    if (!replyDialog || !replyText.trim()) return;
    setSending(true);
    try {
      await communicationData.contacts.reply(replyDialog.id, replyText);
      setContacts((prev) =>
        prev.map((c) => (c.id === replyDialog.id ? { ...c, status: "REPLIED" as const, reply: replyText, replied_at: new Date().toISOString() } : c)),
      );
      toast.success("Reply sent");
      setReplyDialog(null);
      setReplyText("");
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this contact message?")) return;
    try {
      await communicationData.contacts.delete(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Communications</h1>
          <p className="text-sm text-muted-foreground">Manage contact messages, subscribers, and email delivery</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={fetchAll} disabled={loading}>
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
          Refresh
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="inbox" className="gap-1.5">
            <Inbox className="size-3.5" />
            Inbox
            {contacts.filter((c) => c.status === "NEW").length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">{contacts.filter((c) => c.status === "NEW").length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="subscribers" className="gap-1.5">
            <Users className="size-3.5" />
            Subscribers
            {subscribers.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">{subscribers.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="hooks" className="gap-1.5">
            <MailWarning className="size-3.5" />
            Email Hooks
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 flex-1">
          <TabsContent value="inbox" className="mt-0 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 text-sm"
                />
              </div>
              <Badge variant="outline" className="h-7 text-xs">{filteredContacts.length} messages</Badge>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 size-4 animate-spin" /> Loading...
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-sm text-muted-foreground">
                  <Inbox className="size-8 opacity-40" />
                  <p>No messages yet</p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <Card key={contact.id} className={`border-border/60 shadow-xs ${contact.status === "NEW" ? "border-l-2 border-l-blue-500" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">{contact.name}</span>
                            <span className="text-xs text-muted-foreground">&lt;{contact.email}&gt;</span>
                            <Badge variant="secondary" className={`text-[10px] h-5 ${STATUS_COLORS[contact.status] ?? ""}`}>
                              {contact.status}
                            </Badge>
                            {contact.source && (
                              <Badge variant="outline" className="text-[10px] h-5">{contact.source}</Badge>
                            )}
                          </div>
                          <p className="mt-1.5 text-sm text-foreground/90 leading-relaxed">{contact.message}</p>
                          {contact.reply && (
                            <div className="mt-2 rounded-md bg-muted/50 p-3 text-sm border-l-2 border-emerald-500">
                              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Your reply:</p>
                              <p className="text-muted-foreground">{contact.reply}</p>
                            </div>
                          )}
                          <p className="mt-1.5 text-[11px] text-muted-foreground">
                            {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {contact.status !== "REPLIED" && (
                            <Button variant="ghost" size="icon" className="size-7" onClick={() => { setReplyDialog(contact); setReplyText(""); }}>
                              <Reply className="size-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => handleDelete(contact.id)}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="subscribers" className="mt-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search subscribers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 text-sm"
                />
              </div>
              <Badge variant="outline" className="h-7 text-xs">{filteredSubscribers.length} subscribers</Badge>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" /> Loading...
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-sm text-muted-foreground">
                <Users className="size-8 opacity-40" />
                <p>No subscribers yet</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Email</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Name</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Source</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 text-sm">{sub.email}</td>
                        <td className="px-4 py-2.5 text-sm text-muted-foreground hidden sm:table-cell">{sub.name || "-"}</td>
                        <td className="px-4 py-2.5 text-sm text-muted-foreground hidden md:table-cell">
                          <Badge variant="outline" className="text-[10px]">{sub.source || "direct"}</Badge>
                        </td>
                        <td className="px-4 py-2.5">
                          {sub.unsubscribed_at ? (
                            <Badge variant="secondary" className="text-[10px] bg-red-500/10 text-red-600">Unsubscribed</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600">Active</Badge>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground hidden lg:table-cell">
                          {formatDistanceToNow(new Date(sub.created_at), { addSuffix: true })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hooks" className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" /> Loading...
              </div>
            ) : hooks.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-sm text-muted-foreground">
                <MailWarning className="size-8 opacity-40" />
                <p>No email hooks yet</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Recipient</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Subject</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Source</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hooks.map((hook) => {
                      const info = HOOK_STATUS_ICONS[hook.status] ?? { icon: Clock, color: "text-muted-foreground" };
                      const Icon = info.icon;
                      return (
                        <tr key={hook.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2.5 text-sm">{hook.recipient}</td>
                          <td className="px-4 py-2.5 text-sm text-muted-foreground hidden sm:table-cell truncate max-w-[200px]">{hook.subject}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${info.color}`}>
                              <Icon className="size-3" />
                              {hook.status}
                            </span>
                            {hook.error_message && (
                              <p className="text-[10px] text-red-500 mt-0.5">{hook.error_message}</p>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground hidden md:table-cell">{hook.source || "-"}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground hidden lg:table-cell">
                            {formatDistanceToNow(new Date(hook.created_at), { addSuffix: true })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      <Dialog open={!!replyDialog} onOpenChange={(open) => !open && setReplyDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to {replyDialog?.name}</DialogTitle>
            <DialogDescription>{replyDialog?.email}</DialogDescription>
          </DialogHeader>
          {replyDialog && (
            <div className="space-y-4">
              <div className="rounded-md bg-muted/50 p-3 text-sm border-l-2 border-muted-foreground/30">
                <p className="text-xs font-medium text-muted-foreground mb-1">Original message:</p>
                <p>{replyDialog.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reply">Your reply</Label>
                <Textarea
                  id="reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={5}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setReplyDialog(null)}>Cancel</Button>
            <Button size="sm" onClick={handleReply} disabled={sending || !replyText.trim()}>
              {sending ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : <Send className="mr-1.5 size-3.5" />}
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
