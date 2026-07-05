"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  Loader2,
  MessageSquarePlus,
  RefreshCw,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForumThreads } from "@/hooks/use-forum";
import { ForumThreadCard } from "@/components/forum/forum-thread-card";
import { ForumThreadDetail } from "@/components/forum/forum-thread-detail";
import { CreateThreadDialog } from "@/components/forum/create-thread-dialog";
import { useAuth } from "@/contexts/auth-context";
import { Routes } from "@/constants/routes";
import { StudioPage } from "../components/studio-page";
import { StudioPageHeader } from "../components/studio-page-header";
import { ForumWave } from "../illustrations/forum-wave";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export function LearnForumView() {
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
      <StudioPage width="default">
        <ForumThreadDetail
          threadId={selectedThreadId}
          onBack={() => setSelectedThreadId(null)}
        />
      </StudioPage>
    );
  }

  return (
    <StudioPage width="default">
      <StudioPageHeader
        eyebrow="Community"
        title="Forum"
        description="Ask questions, share insights, and learn about Kenya's budget together."
        illustration={<ForumWave className="h-24 w-32 opacity-90" />}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={refreshing}
              onClick={async () => {
                setRefreshing(true);
                try {
                  await queryClient.invalidateQueries({ queryKey: ["forum", "threads"] });
                } finally {
                  setRefreshing(false);
                }
              }}
            >
              <RefreshCw className={cnRefresh(refreshing)} />
              Refresh
            </Button>
            {isLoggedIn ? (
              <CreateThreadDialog />
            ) : (
              <Button size="sm" className="rounded-full" asChild>
                <Link href={Routes.Login}>
                  <MessageSquarePlus className="mr-1.5 size-4" />
                  Sign in to post
                </Link>
              </Button>
            )}
          </>
        }
      />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations…"
          className="h-11 rounded-2xl border-border/50 bg-card/80 pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <Empty className="rounded-2xl border border-destructive/20 bg-destructive/5">
          <EmptyHeader>
            <EmptyTitle>Could not load conversations</EmptyTitle>
            <EmptyDescription>
              {error instanceof Error ? error.message : "Please try again later."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : filtered.length === 0 ? (
        <Empty className="rounded-2xl border border-dashed">
          <EmptyHeader>
            <EmptyTitle>{search ? "No matches" : "No conversations yet"}</EmptyTitle>
            <EmptyDescription>
              {search
                ? "Try a different keyword."
                : "Be the first to start a civic budget discussion."}
            </EmptyDescription>
          </EmptyHeader>
          {!search && isLoggedIn ? <CreateThreadDialog /> : null}
        </Empty>
      ) : (
        <ul className="space-y-2 pb-4">
          {filtered.map((thread) => (
            <li key={thread.id}>
              <ForumThreadCard
                thread={thread}
                selected={false}
                onSelect={() => setSelectedThreadId(thread.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </StudioPage>
  );
}

function cnRefresh(spinning: boolean) {
  return `mr-1.5 size-4 ${spinning ? "animate-spin" : ""}`;
}
