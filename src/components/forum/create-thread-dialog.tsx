"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { MessageSquarePlus, Loader2 } from "lucide-react";
import { useCreateForumThread, useCreateForumPost } from "@/hooks/use-forum";
import { toast } from "sonner";

export function CreateThreadDialog({
  civicModuleId,
  onCreated,
}: {
  civicModuleId?: string;
  onCreated?: (threadId: string) => void;
} = {}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const createThread = useCreateForumThread();
  const createPost = useCreateForumPost();

  const handleSubmit = async () => {
    if (!title.trim()) return;
    try {
      const thread = await createThread.mutateAsync({
        title: title.trim(),
        ...(civicModuleId ? { civic_module: civicModuleId } : {}),
      });
      if (message.trim()) {
        await createPost.mutateAsync({ threadId: thread.id, content: message.trim() });
      }
      toast.success("Conversation started");
      setTitle("");
      setMessage("");
      setOpen(false);
      onCreated?.(thread.id);
    } catch {
      toast.error("Failed to start conversation.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 gap-1.5 rounded-xl px-4 text-xs font-bold">
          <MessageSquarePlus className="size-4" />
          New topic
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start a conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">Topic</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to discuss?"
              className="text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">Opening message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share context or ask your question…"
              className="min-h-[96px] resize-none text-sm"
            />
          </div>
          <Button
            onClick={() => void handleSubmit()}
            disabled={!title.trim() || createThread.isPending || createPost.isPending}
            className="w-full rounded-xl font-bold"
          >
            {createThread.isPending || createPost.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Post to forum"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
