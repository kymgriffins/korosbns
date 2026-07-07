"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

type ReflectionCardProps = {
  prompt: string;
  className?: string;
};

const CONFIDENCE = ["😀", "😐", "😕"] as const;

export function ReflectionCard({ prompt, className }: ReflectionCardProps) {
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const isConfidence = prompt.includes("😀");

  return (
    <section className={cn("rounded-2xl border border-border/60 bg-card p-5 shadow-sm", className)}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">Reflection</p>
      <h3 className="mb-4 text-lg font-semibold">{prompt}</h3>

      {isConfidence ? (
        <div className="flex gap-3">
          {CONFIDENCE.map((emoji, index) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setConfidence(index)}
              className={cn(
                "flex size-14 items-center justify-center rounded-2xl border text-2xl transition-all",
                confidence === index
                  ? "scale-105 border-primary bg-primary/10 shadow-sm"
                  : "border-border/60 hover:bg-muted/40",
              )}
              aria-label={`Confidence level ${index + 1}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : (
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write one sentence..."
          className="min-h-24 resize-none"
        />
      )}

      <Button className="mt-4" variant="secondary" size="sm">
        Save reflection
      </Button>
    </section>
  );
}
