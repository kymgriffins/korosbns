"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MessageSquarePlus, MessagesSquare } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useForumThreads } from "@/hooks/use-forum";
import { ForumThreadCard } from "@/components/forum/forum-thread-card";
import { ForumThreadDetail } from "@/components/forum/forum-thread-detail";
import { CreateThreadDialog } from "@/components/forum/create-thread-dialog";
import { useAuth } from "@/contexts/auth-context";
import { Routes } from "@/constants/routes";
import { LearnPageShell } from "@/components/learn/learn-page-shell";
import {
  LearnEmptyState,
  LearnLoadingState,
  LearnPageBody,
  LearnRefreshButton,
  LearnSearchField,
} from "@/components/learn/learn-ui-primitives";

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
    <LearnPageShell
      navId="forum"
      actions={
        <>
          <LearnRefreshButton
            label="Sync"
            refreshing={refreshing}
            onClick={async () => {
              setRefreshing(true);
              try {
                await queryClient.invalidateQueries({ queryKey: ["forum", "threads"] });
              } finally {
                setRefreshing(false);
              }
            }}
          />
          {isLoggedIn ? (
            <CreateThreadDialog />
          ) : (
            <Link
              href={Routes.Login}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageSquarePlus className="size-4" />
              Sign in to post
            </Link>
          )}
        </>
      }
    >
      <LearnPageBody narrow>
        <LearnSearchField
          value={search}
          onChange={setSearch}
          placeholder="Search conversations…"
          className="mb-4"
        />

        {isLoading ? (
          <LearnLoadingState label="Loading conversations…" />
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
            <p className="text-sm font-semibold text-destructive">Could not load conversations</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {error instanceof Error ? error.message : "Please try again later."}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <LearnEmptyState
            icon={MessagesSquare}
            title={search ? "No matches" : "No conversations yet"}
            description={
              search
                ? "Try a different keyword."
                : "Be the first to start a civic budget discussion."
            }
            action={!search && isLoggedIn ? <CreateThreadDialog /> : undefined}
          />
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
      </LearnPageBody>
    </LearnPageShell>
  );
}
