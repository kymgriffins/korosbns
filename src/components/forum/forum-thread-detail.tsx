"use client";

import { ArrowLeft, MessageSquare, Loader2 } from "lucide-react";
import { useForumThread, useCreateForumPost } from "@/hooks/use-forum";
import { ForumPostItem } from "./forum-post-item";
import { ForumPostComposer } from "./forum-post-composer";
import { Button } from "@/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function ForumThreadDetail({
  threadId,
  onBack,
}: {
  threadId: string;
  onBack: () => void;
}) {
  const { data, isLoading } = useForumThread(threadId);
  const createPost = useCreateForumPost();
  const { isLoggedIn } = useAuth();

  const thread = data;

  const handlePost = async (content: string) => {
    if (!threadId) return;
    await createPost.mutateAsync({ threadId, content });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
        <Button variant="ghost" size="icon-sm" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="size-4" />
        </Button>
        {thread && (
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold truncate">{thread.title}</h2>
            <p className="text-[10px] text-muted-foreground font-semibold">
              {thread.author_name} &middot; {thread.posts.length} post{thread.posts.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : thread ? (
        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {thread.posts.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No posts yet. Be the first to reply!
            </p>
          ) : (
            thread.posts.map((post) => (
              <ForumPostItem key={post.id} post={post} />
            ))
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-8">Thread not found.</p>
      )}

      {isLoggedIn ? (
        <div className="pt-3 border-t border-border">
          <ForumPostComposer onSubmit={handlePost} placeholder="Write a reply..." />
        </div>
      ) : (
        <p className="pt-3 text-[10px] text-muted-foreground text-center font-semibold border-t border-border">
          Sign in to join the discussion.
        </p>
      )}
    </div>
  );
}
