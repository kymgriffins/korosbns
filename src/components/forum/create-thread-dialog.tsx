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

import { Plus, Loader2 } from "lucide-react";
import { useCreateForumThread } from "@/hooks/use-forum";
import { toast } from "sonner";

export function CreateThreadDialog({
  civicModuleId,
}: {
  civicModuleId?: string;
} = {}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const createThread = useCreateForumThread();

  const handleSubmit = async () => {
    if (!title.trim()) return;
    try {
      await createThread.mutateAsync({
        title: title.trim(),
        ...(civicModuleId ? { civic_module: civicModuleId } : {}),
      });
      toast.success("Thread created!");
      setTitle("");
      setOpen(false);
    } catch {
      toast.error("Failed to create thread.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl text-xs font-bold h-9 px-4 gap-1.5">
          <Plus className="size-4" />
          New Thread
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Thread</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="text-sm"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || createThread.isPending}
            className="w-full rounded-xl font-bold"
          >
            {createThread.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Create Thread"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
