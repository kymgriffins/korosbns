"use client";

import { Lock } from "lucide-react";
import { Badge } from "@/ui/badge";
import { cn } from "@/utils";
import { cva } from "class-variance-authority";

export type StageCardData = {
  id: number;
  title: string;
  badge: string;
  badgeName?: string;
  documentName: string;
  status: string;
};

const cardVariants = cva(
  "relative w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      state: {
        completed: "bg-primary/5 shadow-xs hover:bg-primary/8 cursor-pointer",
        active:    "bg-card shadow-xs hover:bg-accent/30 cursor-pointer",
        locked:    "bg-muted/15 opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: { state: "active" },
  },
);

const avatarVariants = cva(
  "size-9 rounded-full flex items-center justify-center font-semibold text-xs shrink-0",
  {
    variants: {
      state: {
        completed: "bg-primary text-primary-foreground",
        active:    "bg-muted/50 text-foreground",
        locked:    "bg-muted/30 text-muted-foreground",
      },
    },
    defaultVariants: { state: "active" },
  },
);

const STATUS_BADGE_VARIANT: Record<string, "secondary" | "outline" | "default"> = {
  "Comment Open": "default",
};

export function StageCard({
  stage,
  isCompleted,
  isActive,
  isLocked = false,
  onSelect,
}: {
  stage: StageCardData;
  isCompleted: boolean;
  isActive: boolean;
  isLocked?: boolean;
  onSelect: () => void;
}) {
  const state = isCompleted ? "completed" : isLocked ? "locked" : "active";
  const displayStatus = isLocked ? "Locked" : stage.status;

  return (
    <button
      onClick={isLocked ? undefined : onSelect}
      disabled={isLocked}
      aria-label={`${stage.title}${isLocked ? " — locked" : ""}`}
      className={cardVariants({ state })}
    >
      <div className={avatarVariants({ state })}>
        {isCompleted ? (
          <span role="img" aria-label={`${stage.badgeName ?? stage.title} badge`}>
            {stage.badge}
          </span>
        ) : isLocked ? (
          <Lock className="size-3" aria-hidden />
        ) : (
          String(stage.id)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-xs font-semibold truncate">{stage.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{stage.documentName}</p>
        <Badge
          variant={STATUS_BADGE_VARIANT[stage.status] ?? "secondary"}
          className="mt-1 text-xs px-1.5 py-0"
        >
          {displayStatus}
        </Badge>
      </div>
    </button>
  );
}
