"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, MessageSquare, MessageSquarePlus, Search } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { useForumThreads } from "@/hooks/use-forum";
import { ForumThreadCard } from "@/components/forum/forum-thread-card";
import { ForumThreadDetail } from "@/components/forum/forum-thread-detail";
import { CreateThreadDialog } from "@/components/forum/create-thread-dialog";
import { BudgetHubPage } from "@/components/budget-hub/layout/budget-hub-page";
import { usePageView } from "@/hooks/use-page-view";

export function BudgetHubForumPage() {
  usePageView();
  const { isLoggedIn } = useAuth();
  const { data, isLoading, isError, error } = useForumThreads({});
  const [query, setQuery] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const threads = data?.results ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(q) ||
        thread.author_name.toLowerCase().includes(q),
    );
  }, [query, threads]);

  if (selectedThreadId) {
    return (
      <div className="budget-hub">
        <BudgetHubPage className="py-4 sm:py-6">
          <ForumThreadDetail
            threadId={selectedThreadId}
            onBack={() => setSelectedThreadId(null)}
          />
        </BudgetHubPage>
      </div>
    );
  }

  return (
    <div className="budget-hub pb-24 md:pb-10">
      <BudgetHubPage className="space-y-5 py-6 md:py-10">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-[var(--bh-border)] bg-[var(--bh-surface)] p-5 sm:p-6"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--bh-accent-warm)]">
            Community
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Budget Hub Forum</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Ask questions, share observations, and discuss Kenya&apos;s budget with fellow learners.
          </p>
          <div className="mt-4 flex items-center gap-2">
            {isLoggedIn ? (
              <CreateThreadDialog />
            ) : (
              <Link
                href={Routes.Login}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
              >
                <MessageSquarePlus className="size-4" />
                Sign in to post
              </Link>
            )}
          </div>
        </motion.section>

        <section className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search threads..."
              className="h-11 rounded-full border-[var(--bh-border)] bg-[var(--bh-surface)] pl-10"
            />
          </div>

          {isLoading ? (
            <div className="flex min-h-[22vh] items-center justify-center rounded-xl border border-[var(--bh-border)] bg-[var(--bh-surface)]">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-semibold text-destructive">Could not load forum threads</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {error instanceof Error ? error.message : "Unexpected forum error."}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--bh-border)] p-6 text-center">
              <MessageSquare className="mx-auto size-7 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">
                {query ? "No threads match your search." : "No forum threads yet."}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {query
                  ? "Try another keyword."
                  : "Start the first conversation in Budget Hub."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
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
        </section>
      </BudgetHubPage>
    </div>
  );
}
