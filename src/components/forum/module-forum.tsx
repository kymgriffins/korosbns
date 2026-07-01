"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForumThreads } from "@/hooks/use-forum";
import { ForumThreadCard } from "./forum-thread-card";
import { ForumThreadDetail } from "./forum-thread-detail";
import { CreateThreadDialog } from "./create-thread-dialog";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Routes } from "@/constants/routes";

export function ModuleForum({ moduleId }: { moduleId: string }) {
  const { isLoggedIn } = useAuth();
  const { data, isLoading, isError, error } = useForumThreads({ moduleId });
  const [search, setSearch] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const threads = data?.results ?? [];

  const filtered = useMemo(() => {
    if (!search.trim()) return threads;
    const q = search.toLowerCase();
    return threads.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.author_name.toLowerCase().includes(q)
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions..."
            className="pl-8 text-xs h-9 rounded-xl"
          />
        </div>
        {isLoggedIn ? (
          <CreateThreadDialog civicModuleId={moduleId} />
        ) : (
          <Link
            href={Routes.Login}
            className="inline-flex items-center gap-1 rounded-xl text-xs font-bold h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
          >
            <MessageSquare className="size-3.5" />
            Sign In
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-8 text-center">
          <p className="text-xs font-bold text-destructive">Could not load discussions</p>
          <p className="text-[10px] text-muted-foreground mt-1 max-w-sm">
            {error instanceof Error ? error.message : "An unexpected error occurred."}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-1.5 text-center">
          <MessageSquare className="size-8 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground font-semibold">
            {search ? "No discussions match your search." : "No discussions yet."}
          </p>
          {!search && isLoggedIn && (
            <p className="text-[10px] text-muted-foreground">Start a discussion about this module!</p>
          )}
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
    </div>
  );
}
