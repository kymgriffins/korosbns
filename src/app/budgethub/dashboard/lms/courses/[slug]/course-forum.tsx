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

function ThreadCard({
  thread,
  selected,
  onSelect,
}: {
  thread: ForumThread;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-lg border p-3 transition-colors hover:bg-muted/50",
        selected && "border-primary/40 bg-primary/5"
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarFallback className="text-[9px] font-bold bg-muted-foreground/10">
            {thread.author_initials || thread.author_name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{thread.title}</p>
          <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
            {thread.author_name} · {thread.posts_count} post{thread.posts_count !== 1 ? "s" : ""}
            {" · "}{format(new Date(thread.created_at), "MMM d")}
          </p>
        </div>
      </div>
    </button>
  );
}

function ThreadDetailView({
  threadId,
  onBack,
}: {
  threadId: string;
  onBack: () => void;
}) {
  const { isLoggedIn, user } = useAuth();
  const [thread, setThread] = useState<ForumThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchThread = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<ForumThreadDetail>(`/engagement/forum-threads/${threadId}/`);
      setThread(res);
    } catch {} finally { setLoading(false); }
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
        <Button variant="ghost" size="icon-xs" onClick={onBack}><ArrowLeft className="size-4" /></Button>
        {thread && (
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-bold">{thread.title}</h2>
            <p className="text-[10px] text-muted-foreground">{thread.author_name} · {thread.posts?.length ?? 0} message{(thread.posts?.length ?? 0) !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>

      <Separator />

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
      ) : thread ? (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {thread.posts?.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No replies yet. Start the conversation!</p>
          ) : (
            thread.posts?.map((post) => {
              const isOwn = Boolean(displayName && post.author_name === displayName);
              return (
                <div key={post.id} className={cn("flex gap-2", isOwn && "flex-row-reverse")}>
                  <Avatar className="size-7 shrink-0 mt-0.5">
                    <AvatarFallback className="text-[9px] font-bold bg-muted-foreground/10">
                      {post.author_initials || post.author_name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn("max-w-[85%] rounded-xl px-3 py-2 text-sm", isOwn ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <p className="text-[10px] font-semibold opacity-70 mb-0.5">{post.author_name}</p>
                    <p className="leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    <p className="text-[9px] opacity-50 mt-1">{format(new Date(post.created_at), "MMM d, h:mm a")}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">Thread not found.</p>
      )}

      <Separator />
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <Input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 text-sm"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
          />
          <Button size="sm" onClick={handleReply} disabled={!replyText.trim() || posting} className="shrink-0">
            {posting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </div>
      ) : (
        <p className="text-center text-xs text-muted-foreground py-2">Sign in to join the conversation.</p>
      )}
    </div>
  );
}

export function CourseForum({ moduleId }: { moduleId: string }) {
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
    try {
      const res = await apiFetch<ApiListResponse<ForumThread>>(`/engagement/forum-threads/?module_id=${moduleId}`);
      setThreads(res.results ?? []);
    } catch {} finally { setLoading(false); }
  }, [moduleId]);

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
        body: JSON.stringify({ title: newTitle.trim(), civic_module: moduleId }),
      });
      setNewTitle("");
      setNewMessage("");
      setShowCreate(false);
      await fetchThreads();
    } catch {} finally { setCreating(false); }
  }, [newTitle, newMessage, creating, moduleId, fetchThreads]);

  if (selectedThreadId) {
    return <ThreadDetailView threadId={selectedThreadId} onBack={() => setSelectedThreadId(null)} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions..."
            className="pl-8 text-xs h-9"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="size-3" />
            </button>
          )}
        </div>
        {isLoggedIn && (
          <Button size="sm" variant="outline" onClick={() => setShowCreate(!showCreate)} className="shrink-0 gap-1">
            <Plus className="size-3.5" /> New
          </Button>
        )}
      </div>

      {showCreate && (
        <Card>
          <CardContent className="space-y-3 p-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Discussion title..."
              className="text-sm"
            />
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Optional opening message..."
              rows={3}
              className="w-full rounded-lg border bg-background p-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
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
        <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <MessageSquare className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground font-semibold">
            {search ? "No discussions match your search." : "No discussions yet."}
          </p>
          {!search && isLoggedIn && <p className="text-xs text-muted-foreground">Start a discussion about this course!</p>}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              selected={selectedThreadId === thread.id}
              onSelect={() => setSelectedThreadId(thread.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
