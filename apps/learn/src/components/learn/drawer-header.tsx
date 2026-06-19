"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, WifiOff } from "lucide-react";
import { Routes } from "@/constants/routes";
import { getAuthorSlug } from "@/lib/learn-authors";
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

export function DrawerHeader({ title, badge, currentStep, activeSubTab, onSubTabChange, isCached, onClose, author }: DrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 md:px-5 h-11 border-b border-border/30 shrink-0 bg-background/60 backdrop-blur z-20">
      <div className="flex items-center gap-2 min-w-0">
        <span className="hidden md:inline text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">{title}</span>
        <span className="md:hidden text-xs font-bold truncate flex items-center gap-1.5">
          <span className="text-sm">{badge}</span>
          <span className="truncate">{title}</span>
        </span>
        {isCached && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[7px] font-bold uppercase tracking-wider shrink-0" title="Available offline">
            <WifiOff className="size-2.5" />
            Offline
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {author && (
          <Link
            href={Routes.LearnAuthor(getAuthorSlug(author))}
            className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
          >
            <Image src={author.image} alt={author.name} width={14} height={14} className="size-3.5 rounded-full object-cover" />
            <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-foreground truncate max-w-[80px]">{author.name}</span>
            <ExternalLink className="size-2.5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
          </Link>
        )}

        <div className="flex rounded-lg bg-muted/30 p-0.5">
          {(["learn", "documents", "forum"] as const).map((tab) => (
            <button key={tab} onClick={() => onSubTabChange(tab)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeSubTab === tab ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}>
              {tab === "learn" ? "Journey" : tab === "documents" ? "Docs" : "Forum"}
            </button>
          ))}
        </div>

        <button onClick={onClose} className="size-6 flex items-center justify-center rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
          <span className="text-xs">\u2715</span>
        </button>
      </div>
    </div>
  );
}
