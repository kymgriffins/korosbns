"use client";

import Link from "next/link";
import { cn } from "@/utils";
import type { ForumPost } from "@/types/learn";

function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (sameDay) {
    return date.toLocaleTimeString("en-KE", { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-KE", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function ForumPostItem({
  post,
  isOwn = false,
}: {
  post: ForumPost;
  isOwn?: boolean;
}) {
  return (
    <div className={cn("flex gap-2", isOwn ? "flex-row-reverse" : "flex-row")}>
      {post.author_avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.author_avatar}
          alt=""
          className="size-8 shrink-0 rounded-full object-cover ring-1 ring-border"
        />
      ) : (
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-black",
            isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
          aria-hidden
        >
          {post.author_initials ?? "?"}
        </div>
      )}
      <div className={cn("flex max-w-[85%] flex-col gap-1", isOwn ? "items-end" : "items-start")}>
        <div className={cn("flex items-center gap-2 text-[10px] font-semibold text-muted-foreground", isOwn && "flex-row-reverse")}>
          {post.author_id ? (
            <Link href={`/learn/users/${post.author_id}`} className="text-primary hover:underline">
              {post.author_name ?? "Anonymous"}
            </Link>
          ) : (
            <span>{post.author_name ?? "Anonymous"}</span>
          )}
          <span className="size-0.5 rounded-full bg-muted-foreground/40" />
          <time dateTime={post.created_at}>{formatMessageTime(post.created_at)}</time>
        </div>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-xs",
            isOwn
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md border border-border/60 bg-card text-foreground/90",
          )}
        >
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>
    </div>
  );
}
