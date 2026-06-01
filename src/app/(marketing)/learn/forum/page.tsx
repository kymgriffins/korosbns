"use client";

import { useState, useMemo } from "react";
import { Search, MessageSquare, Loader2 } from "lucide-react";
import { Input } from "@/ui/input";
import { useForumThreads } from "@/hooks/use-forum";
import { ForumThreadCard } from "@/components/forum/forum-thread-card";
import { ForumThreadDetail } from "@/components/forum/forum-thread-detail";
import { CreateThreadDialog } from "@/components/forum/create-thread-dialog";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Routes } from "@/constants/routes";

function ForumPageContent() {
  const { isLoggedIn } = useAuth();
  const { data, isLoading } = useForumThreads({});
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
      <div className="h-full flex flex-col p-4 md:p-6">
        <ForumThreadDetail
          threadId={selectedThreadId}
          onBack={() => setSelectedThreadId(null)}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-black uppercase tracking-tight">Community Forum</h1>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Discuss budget topics with fellow citizens
          </p>
        </div>
        {isLoggedIn ? (
          <CreateThreadDialog />
        ) : (
          <Link
            href={Routes.Login}
            className="inline-flex items-center gap-1.5 rounded-xl text-xs font-bold h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="size-4" />
            Sign In to Post
          </Link>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search threads..."
          className="pl-9 text-sm h-10 rounded-xl"
        />
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
          <MessageSquare className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground font-semibold">
            {search ? "No threads match your search." : "No threads yet."}
          </p>
          {!search && isLoggedIn && (
            <p className="text-xs text-muted-foreground">Start a discussion!</p>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pb-4">
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

export default function LearnForumPage() {
  return <ForumPageContent />;
}
