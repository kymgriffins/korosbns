"use client";

import { cn } from "@/utils";
import { Lock } from "lucide-react";

export type StageCardData = {
  id: number;
  title: string;
  badge: string;
  badgeName?: string;
  documentName: string;
  status: string;
};

export function StageCard({ stage, isCompleted, isActive, isLocked, onSelect }: {
  stage: StageCardData;
  isCompleted: boolean;
  isActive: boolean;
  isLocked?: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={isLocked ? undefined : onSelect}
      className={cn(
        "relative flex items-center gap-3 p-3 rounded-xl transition-all",
        isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        isCompleted ? "bg-primary/5 shadow-xs hover:bg-primary/8" :
        isActive ? "bg-card shadow-xs hover:bg-accent/30" :
        "bg-muted/15 hover:bg-muted/30"
      )}
    >
      <div className={cn(
        "size-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
        isCompleted ? "bg-primary text-primary-foreground" :
        isActive ? "bg-muted/50 text-foreground" :
        "bg-muted/30 text-muted-foreground"
      )}>
        {isCompleted ? stage.badge : isLocked ? <Lock className="size-3" /> : stage.id}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-xs font-bold truncate">{stage.title}</h3>
        <p className="text-[10px] text-muted-foreground truncate">{stage.documentName}</p>
        <span className={cn(
          "text-[10px] font-semibold px-1 py-0.5 rounded inline-block mt-0.5",
          stage.status === "Comment Open" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted/30 text-muted-foreground"
        )}>
          {isLocked ? "Locked" : stage.status}
        </span>
      </div>
    </div>
  );
}
