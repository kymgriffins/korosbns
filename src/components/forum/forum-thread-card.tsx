"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { cn } from "@/utils";
import type { ForumThread } from "@/types/learn";

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-KE", { month: "short", day: "numeric" });
}

export function ForumThreadCard({
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
        "flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all",
        selected
          ? "border-primary/30 bg-primary/5 shadow-xs"
          : "border-border/70 bg-card hover:border-primary/20 hover:bg-muted/30",
      )}
    >
      {thread.author_avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thread.author_avatar}
          alt=""
          className="size-11 shrink-0 rounded-full object-cover ring-2 ring-border"
        />
      ) : (
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-black",
            selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
          )}
          aria-hidden
        >
          {thread.author_initials || (thread.author_name?.slice(0, 2).toUpperCase() ?? "?")}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-bold leading-snug text-foreground">{thread.title}</h3>
          <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">
            {formatRelativeTime(thread.created_at)}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
          {thread.author_id ? (
            <Link
              href={`/learn/users/${thread.author_id}`}
              onClick={(e) => e.stopPropagation()}
              className="truncate text-primary hover:underline"
            >
              {thread.author_name}
            </Link>
          ) : (
            <span className="truncate">{thread.author_name}</span>
          )}
          <span className="size-0.5 rounded-full bg-muted-foreground/40" />
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-3" />
            {thread.posts_count}
          </span>
        </div>
      </div>
    </button>
  );
}
