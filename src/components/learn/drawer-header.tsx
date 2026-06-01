"use client";

import Image from "next/image";
import type { CivicModuleAuthor } from "@/types/learn";

export type DrawerSubTab = "learn" | "documents" | "forum";

interface DrawerHeaderProps {
  title: string;
  badge: string;
  currentStep: number;
  activeSubTab: DrawerSubTab;
  onSubTabChange: (tab: DrawerSubTab) => void;
  isCached: boolean;
  onClose: () => void;
  author?: CivicModuleAuthor;
}

export function DrawerHeader({
  title,
  badge,
  currentStep,
  activeSubTab,
  onSubTabChange,
  isCached,
  onClose,
  author,
}: DrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 h-12 border-b border-border shrink-0 bg-background/80 backdrop-blur-xs z-20">
      <div className="flex items-center gap-2 min-w-0">
        <span className="hidden md:inline text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
          {title}
        </span>
        <span className="md:hidden text-xs font-black truncate flex items-center gap-1.5">
          <span className="text-base">{badge}</span>
          <span className="truncate">{title}</span>
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {author && (
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/40 border border-border/50">
            <Image
              src={author.image}
              alt={author.name}
              width={16}
              height={16}
              className="size-4 rounded-full object-cover"
            />
            <span className="text-[8px] font-bold text-muted-foreground truncate max-w-[90px]">
              {author.name}
            </span>
          </div>
        )}

        <div className="flex rounded-lg border border-border bg-card p-0.5">
          <button
            onClick={() => onSubTabChange("learn")}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeSubTab === "learn"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Guided Journey
          </button>
          <button
            onClick={() => onSubTabChange("documents")}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeSubTab === "documents"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => onSubTabChange("forum")}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeSubTab === "forum"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Forum
          </button>
        </div>

        <button
          onClick={onClose}
          className="size-7 flex items-center justify-center rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
