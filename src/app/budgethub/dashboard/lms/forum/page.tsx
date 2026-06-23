"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, Loader2, MessageSquare, Plus, Search, Send, User, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/contexts/auth-context";
import type { ForumThread, ForumThreadDetail, ForumPost } from "@/types/learn";
import type { ApiListResponse } from "@/types/api";
import { cn } from "@/lib/utils";

function ThreadCard({ thread, selected, onSelect }: { thread: ForumThread; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className={cn("w-full text-left rounded-lg border p-3 transition-colors hover:bg-muted/50", selected && "border-primary/40 bg-primary/5")}>
      <div className="flex items-center gap-2">
        <Avatar className="size-6"><AvatarFallback className="text-[9px] font-bold bg-muted-foreground/10">{thread.author_initials || thread.author_name?.charAt(0) || "?"}</AvatarFallback></Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{thread.title}</p>
          <p className="flex items-center gap-1 text-[10px] text-muted-foreground">{thread.author_name} · {thread.posts_count} post{thread.posts_count !== 1 ? "s" : ""} · {format(new Date(thread.created_at), "MMM d")}</p>
        </div>
      </div>
    </button>
  );
}

function ThreadDetailView({ threadId, onBack }: { threadId: string; onBack: () => void }) {
  const { isLoggedIn, user } = useAuth();
  const [thread, setThread] = useState<ForumThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchThread = useCallback(async () => {
    setLoading(true);
    try { const res = await apiFetch<ForumThreadDetail>(`/engagement/forum-threads/${threadId}/`); setThread(res); } catch {} finally { setLoading(false); }
  }, [threadId]);

  useEffect(() => { fetchThread(); }, [fetchThread]);

  const handleReply = useCallback(async () => {
    if (!replyText.trim() || posting) return;
    setPosting(true);
    try {
      await apiFetch<ForumPost>(`/engagement/forum-threads/${threadId}/posts/`, {
        method: "POST",
        auth: true,
        body: JSON.stringify({ content: replyText.trim() }),
      });
      setReplyText("");
      await fetchThread();
    } catch {} finally { setPosting(false); }
  }, [replyText, posting, threadId, fetchThread]);

  const displayName = user?.display_name || user?.break_name || "";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="size-4" /></Button>
        {thread && <div className="min-w-0 flex-1"><h2 className="truncate text-lg font-bold">{thread.title}</h2><p className="text-xs text-muted-foreground">{thread.author_name} · {thread.posts?.length ?? 0} message{(thread.posts?.length ?? 0) !== 1 ? "s" : ""}</p></div>}
      </div>
      <Separator />
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : thread ? (
        <div className="space-y-4 flex-1 overflow-y-auto max-h-[55vh]">
          {thread.posts?.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No replies yet. Start the conversation!</p>
          ) : (
            thread.posts?.map((post) => {
              const isOwn = Boolean(displayName && post.author_name === displayName);
              return (
                <div key={post.id} className={cn("flex gap-3", isOwn && "flex-row-reverse")}>
                  <Avatar className="size-8 shrink-0 mt-0.5"><AvatarFallback className="text-[10px] font-bold bg-muted-foreground/10">{post.author_initials || post.author_name?.charAt(0) || "?"}</AvatarFallback></Avatar>
                  <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm", isOwn ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <p className="text-[10px] font-semibold opacity-70 mb-1">{post.author_name}</p>
                    <p className="leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    <p className="text-[10px] opacity-50 mt-1">{format(new Date(post.created_at), "MMM d, h:mm a")}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : <p className="py-12 text-center text-sm text-muted-foreground">Thread not found.</p>}
      <Separator />
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <Input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." className="flex-1 text-sm" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(); } }} />
          <Button size="sm" onClick={handleReply} disabled={!replyText.trim() || posting}>{posting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}</Button>
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-3">Sign in to join the conversation.</p>
      )}
    </div>
  );
}

export default function ForumPage() {
  const { isLoggedIn } = useAuth();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    try { const res = await apiFetch<ApiListResponse<ForumThread>>("/engagement/forum-threads/"); setThreads(res.results ?? []); } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchThreads(); }, [fetchThreads]);

  const filtered = useMemo(() => {
    if (!search.trim()) return threads;
    const q = search.toLowerCase();
    return threads.filter((t) => t.title.toLowerCase().includes(q) || t.author_name.toLowerCase().includes(q));
  }, [threads, search]);

  const handleCreate = useCallback(async () => {
    if (!newTitle.trim() || creating) return;
    setCreating(true);
    try {
      await apiFetch<ForumThread>("/engagement/forum-threads/", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      setNewTitle(""); setNewMessage(""); setShowCreate(false);
      await fetchThreads();
    } catch {} finally { setCreating(false); }
  }, [newTitle, newMessage, creating, fetchThreads]);

  if (selectedThreadId) {
    return (
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        <ThreadDetailView threadId={selectedThreadId} onBack={() => setSelectedThreadId(null)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Forum</h1>
          <p className="text-sm text-muted-foreground">Discuss and share knowledge with other learners</p>
        </div>
        {isLoggedIn && (
          <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="gap-1.5 shrink-0">
            <Plus className="size-4" /> New Discussion
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search discussions..." className="pl-9 pr-8" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>}
      </div>

      {showCreate && (
        <Card>
          <CardContent className="space-y-3 p-4">
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Discussion title..." className="text-sm" />
            <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Optional opening message..." rows={3}
              className="w-full rounded-lg border bg-background p-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring resize-none" />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setShowCreate(false); setNewTitle(""); setNewMessage(""); }}>Cancel</Button>
              <Button size="sm" onClick={handleCreate} disabled={!newTitle.trim() || creating}>
                {creating ? <Loader2 className="size-4 animate-spin" /> : <MessageSquare className="size-4" />}
                Create
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <MessageSquare className="size-12 text-muted-foreground/30" />
          <p className="text-lg font-medium">{search ? "No results" : "No discussions yet"}</p>
          <p className="text-sm text-muted-foreground">{search ? "Try a different search term." : "Be the first to start a discussion!"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} selected={selectedThreadId === thread.id} onSelect={() => setSelectedThreadId(thread.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
