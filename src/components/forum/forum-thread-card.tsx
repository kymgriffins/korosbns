"use client";

import { MessageSquare, ChevronRight } from "lucide-react";
import { cn } from "@/utils";
import type { ForumThread } from "@/types/learn";

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
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all",
        selected
          ? "bg-primary/5 border-primary/30 shadow-xs"
          : "bg-card border-border hover:border-primary/20 hover:bg-muted/30"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold leading-snug truncate">{thread.title}</h3>
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground font-semibold">
            <span>{thread.author_name}</span>
            <span className="size-0.5 rounded-full bg-muted-foreground/40" />
            <span>{new Date(thread.created_at).toLocaleDateString()}</span>
            {thread.civic_module && (
              <>
                <span className="size-0.5 rounded-full bg-muted-foreground/40" />
                <span className="truncate">{thread.civic_module}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-bold">
            <MessageSquare className="size-3.5" />
            <span>{thread.posts_count}</span>
          </div>
          <ChevronRight className={cn("size-4 text-muted-foreground transition-transform", selected && "rotate-90")} />
        </div>
      </div>
    </button>
  );
}
