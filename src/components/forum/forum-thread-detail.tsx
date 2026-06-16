"use client";

import { ArrowLeft, Loader2, Users } from "lucide-react";
import { useForumThread, useCreateForumPost } from "@/hooks/use-forum";
import { ForumPostItem } from "./forum-post-item";
import { ForumPostComposer } from "./forum-post-composer";
import { Button } from "@/ui/button";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Routes } from "@/constants/routes";

export function ForumThreadDetail({
  threadId,
  onBack,
}: {
  threadId: string;
  onBack: () => void;
}) {
  const { data, isLoading, isError, error } = useForumThread(threadId);
  const createPost = useCreateForumPost();
  const { isLoggedIn, user } = useAuth();

  const thread = data;
  const displayName = user?.display_name || user?.break_name || "";

  const handlePost = async (content: string) => {
    if (!threadId) return;
    await createPost.mutateAsync({ threadId, content });
  };

  return (
    <div className="flex h-[calc(100dvh-140px)] flex-col md:h-[calc(100dvh-180px)]">
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
        <Button variant="ghost" size="icon-sm" onClick={onBack} className="rounded-xl" aria-label="Back to threads">
          <ArrowLeft className="size-4" />
        </Button>
        {thread && (
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-bold">{thread.title}</h2>
            <p className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
              <Users className="size-3" />
              {thread.author_name} started this · {thread.posts.length} message{thread.posts.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xs text-destructive font-semibold">
            {error instanceof Error ? error.message : "Could not load thread."}
          </p>
        </div>
      ) : thread ? (
        <div className="flex-1 space-y-4 overflow-y-auto pb-4 [scrollbar-width:thin]">
          {thread.posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <p className="text-sm font-semibold text-muted-foreground">No replies yet</p>
              <p className="text-xs text-muted-foreground">Start the conversation with a thoughtful question or insight.</p>
            </div>
          ) : (
            thread.posts.map((post) => (
              <ForumPostItem
                key={post.id}
                post={post}
                isOwn={Boolean(displayName && post.author_name === displayName)}
              />
            ))
          )}
        </div>
      ) : (
        <p className="py-8 text-center text-xs text-muted-foreground">Thread not found.</p>
      )}

      <div className="border-t border-border pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {isLoggedIn ? (
          <ForumPostComposer onSubmit={handlePost} placeholder="Reply to this thread…" />
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-3 text-center">
            <p className="text-xs font-semibold text-muted-foreground">
              <Link href={Routes.Login} className="font-bold text-primary hover:underline">
                Sign in
              </Link>{" "}
              to join the conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
