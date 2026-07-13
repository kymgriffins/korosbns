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
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Community
          </p>
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Forums
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discuss budgets, ask questions, and share what you learn.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              setRefreshing(true);
              try {
                await queryClient.invalidateQueries({
                  queryKey: ["forum", "threads"],
                });
              } finally {
                setRefreshing(false);
              }
            }}
            disabled={refreshing}
            className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            title="Refresh threads"
          >
            <RefreshCw
              className={`size-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          {isLoggedIn ? (
            <CreateThreadDialog />
          ) : (
            <Link
              href={Routes.Login}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageSquarePlus className="size-4" />
              Sign in to post
            </Link>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations…"
          className="h-11 rounded-xl pl-10 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
          <p className="text-sm font-bold text-destructive">
            Could not load conversations
          </p>
          <p className="max-w-md text-xs text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred. Please try again later."}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/15 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <MessagesSquare className="size-7 text-primary/70" />
          </div>
          <div>
            <p className="font-heading text-base font-bold text-foreground">
              {search
                ? "No conversations match your search"
                : "No conversations yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Try a different keyword or browse all threads."
                : "Be the first to start a civic budget discussion."}
            </p>
          </div>
          {!search && isLoggedIn && <CreateThreadDialog />}
        </div>
      ) : (
        <div className="space-y-2 pb-2">
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
    </div>
  );
}
