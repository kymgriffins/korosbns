"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { LmsVideoPart } from "@/data/lms/types";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";

type VideoExperienceProps = {
  parts: LmsVideoPart[];
  onPartEnd?: (partId: string) => void;
};

export function VideoExperience({ parts, onPartEnd }: VideoExperienceProps) {
  const [activePartId, setActivePartId] = useState(parts[0]?.id ?? "");
  const activePart = parts.find((p) => p.id === activePartId) ?? parts[0];

  if (!activePart) return null;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-black shadow-sm">
        <video
          key={activePart.id}
          className="aspect-video w-full"
          controls
          playsInline
          src={activePart.videoUrl}
          onEnded={() => onPartEnd?.(activePart.id)}
        />
      </div>

      <div className="space-y-2">
        {parts.map((part, index) => {
          const active = part.id === activePart.id;
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => setActivePartId(part.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200",
                active
                  ? "border-primary/40 bg-primary/5 shadow-sm"
                  : "border-border/60 hover:-translate-y-0.5 hover:shadow-sm",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {active ? <Play className="size-3.5 fill-current" /> : index + 1}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium">{part.title}</span>
                <span className="text-xs text-muted-foreground">{part.durationMinutes} mins</span>
              </span>
            </button>
          );
        })}
      </div>

      <details className="rounded-xl border border-border/60 bg-card p-4">
        <summary className="cursor-pointer text-sm font-medium">Transcript</summary>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{activePart.transcript}</p>
      </details>
    </div>
  );
}
