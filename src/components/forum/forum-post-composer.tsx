"use client";

import { useState } from "react";
import { Loader2, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ForumPostComposer({
  onSubmit,
  placeholder = "Write a message…",
}: {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-2xl border border-border/70 bg-card p-2 shadow-xs">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={1}
        className="min-h-[44px] max-h-32 flex-1 resize-none border-0 bg-transparent px-2 py-2.5 text-sm shadow-none focus-visible:ring-0"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void handleSubmit();
          }
        }}
      />
      <Button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={!content.trim() || submitting}
        size="icon"
        className="size-11 shrink-0 rounded-xl"
        aria-label="Send message"
      >
        {submitting ? <Loader2 className="size-4 animate-spin" /> : <SendHorizonal className="size-4" />}
      </Button>
    </div>
  );
}
