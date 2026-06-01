"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/utils";
import type { ForumPost } from "@/types/learn";

export function ForumPostItem({
  post,
  onUpvote,
}: {
  post: ForumPost;
  onUpvote?: () => void;
}) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
            {post.author_initials}
          </div>
          <div>
            <p className="text-xs font-bold">{post.author_name}</p>
            <p className="text-[9px] text-muted-foreground font-semibold">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        {onUpvote && (
          <button
            onClick={onUpvote}
            className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/5"
          >
            <ThumbsUp className="size-3.5" />
            <span>{post.upvotes}</span>
          </button>
        )}
      </div>
      <p className="text-xs text-foreground/85 leading-relaxed whitespace-pre-wrap">{post.content}</p>
    </div>
  );
}
