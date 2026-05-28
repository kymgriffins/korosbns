"use client";

import { cn } from "@/utils";
import { DownloadCloud } from "lucide-react";

export type StageCardData = {
  id: number;
  title: string;
  badge: string;
  badgeName?: string;
  documentName: string;
  status: string;
};

export function StageCard({
  stage,
  isCompleted,
  isActive,
  isCached,
  onSelect,
  onToggleCache,
}: {
  stage: StageCardData;
  isCompleted: boolean;
  isActive: boolean;
  isCached: boolean;
  onSelect: () => void;
  onToggleCache: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
        isCompleted
          ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
          : isActive
          ? "bg-card border-foreground/35 hover:border-foreground shadow-xs"
          : "bg-muted/15 border-border hover:bg-muted/30"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "size-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border z-10",
          isCompleted
            ? "bg-primary border-primary text-primary-foreground"
            : isActive
            ? "bg-card border-foreground text-foreground"
            : "bg-muted border-border text-muted-foreground",
        )}>
          {isCompleted ? stage.badge : stage.id}
        </div>
        <div>
          <div className="flex items-center gap-1">
            <h3 className="text-xs font-black uppercase tracking-tight">{stage.title}</h3>
          </div>
          <p className="text-[10px] text-muted-foreground truncate max-w-[150px] sm:max-w-xs">{stage.documentName}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={cn(
              "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
              stage.status === "Comment Open"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                : "bg-muted border-border text-muted-foreground",
            )}>
              {stage.status}
            </span>
            {isCached && (
              <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                📶 Cached
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={onToggleCache}
        className={cn(
          "p-2 rounded-lg border hover:bg-muted shrink-0",
          isCached
            ? "border-blue-500/20 text-blue-600 bg-blue-500/5"
            : "border-border text-muted-foreground",
        )}
      >
        <DownloadCloud className="size-4" />
      </button>
    </div>
  );
}
