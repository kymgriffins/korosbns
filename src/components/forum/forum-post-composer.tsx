"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";

export function ForumPostComposer({
  onSubmit,
  placeholder = "Share your thoughts...",
}: {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-end gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[44px] max-h-32 text-xs resize-none flex-1"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <Button
        onClick={handleSubmit}
        disabled={!content.trim() || submitting}
        size="icon"
        className="size-11 shrink-0 rounded-xl"
      >
        <Send className="size-4" />
      </Button>
    </div>
  );
}
