"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquarePlus, MessagesSquare, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForumThreads } from "@/hooks/use-forum";
import { ForumThreadCard } from "@/components/forum/forum-thread-card";
import { ForumThreadDetail } from "@/components/forum/forum-thread-detail";
import { CreateThreadDialog } from "@/components/forum/create-thread-dialog";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Routes } from "@/constants/routes";
import { LearnStage, LearnStageHeader } from "@/components/learn/learn-stage";

export function ForumView() {
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useForumThreads({});
  const [search, setSearch] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const threads = data?.results ?? [];

  const filtered = useMemo(() => {
    if (!search.trim()) return threads;
    const q = search.toLowerCase();
    return threads.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.author_name.toLowerCase().includes(q),
    );
  }, [threads, search]);

  if (selectedThreadId) {
    return (
      <ForumThreadDetail
        threadId={selectedThreadId}
        onBack={() => setSelectedThreadId(null)}
      />
    );
  }

  return (
    <LearnStage>
      <LearnStageHeader
        eyebrow="Town hall"
        title="Ask about the budget"
        subtitle="Civic learning discussions — ask questions, share insights, learn together."
        action={
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={async () => { setRefreshing(true); try { await queryClient.invalidateQueries({ queryKey: ["forum", "threads"] }); } finally { setRefreshing(false); } }}
              disabled={refreshing}
              className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              title="Refresh threads"
            >
              <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            {isLoggedIn ? (
              <CreateThreadDialog />
            ) : (
              <Link
                href={Routes.Login}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <MessageSquarePlus className="size-4" />
                Sign in to join the discussion
              </Link>
            )}
          </div>
        }
      />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations…"
          className="h-10 rounded-xl pl-9 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
          <p className="text-sm font-bold text-destructive">Could not load conversations</p>
          <p className="text-xs text-muted-foreground max-w-md">
            {error instanceof Error ? error.message : "An unexpected error occurred. Please try again later."}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/15 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
            <MessagesSquare className="size-7 text-primary/70" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {search ? "No questions match your search" : "No questions filed yet on this chapter"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search
                ? "Try a different keyword or browse all threads."
                : "Be the first to file a question about the budget process."}
            </p>
          </div>
          {!search && isLoggedIn && <CreateThreadDialog />}
        </div>
      ) : (
        <div className="space-y-2 pb-4">
          {filtered.map((thread) => (
            <ForumThreadCard
              key={thread.id}
              thread={thread}
              selected={selectedThreadId === thread.id}
              onSelect={() => setSelectedThreadId(thread.id)}
            />
          ))}
        </div>
      )}
    </LearnStage>
  );
}
