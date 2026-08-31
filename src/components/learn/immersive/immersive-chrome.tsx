"use client";

import Link from "next/link";
import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/utils";

type ImmersiveChromeProps = {
  backHref: string;
  title: string;
  subtitle?: string;
  progress?: { current: number; total: number };
  onClose?: () => void;
  trailing?: React.ReactNode;
  className?: string;
};

export function ImmersiveChrome({
  backHref,
  title,
  subtitle,
  progress,
  onClose,
  trailing,
  className,
}: ImmersiveChromeProps) {
  const pct = progress && progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <header
      className={cn(
        "immersive-chrome sticky top-0 z-20 border-b border-foreground/10 bg-background/90 backdrop-blur-md",
        className,
      )}
    >
      {progress ? (
        <div className="h-1 w-full bg-muted/40 overflow-hidden">
          <div
            className="h-full bg-orange-600 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}
      <div className="flex items-center gap-3 px-4 py-2.5 safe-area-inset-top">
        <Link
          href={backHref}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-card/70 text-foreground transition-all hover:bg-card hover:border-orange-500/40"
          aria-label="Go back"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              LEARN DESK
            </span>
            <span className="text-muted-foreground/30">/</span>
            <p className="truncate text-xs sm:text-sm font-bold text-foreground leading-tight">{title}</p>
          </div>
          {subtitle ? (
            <p className="truncate text-[11px] font-mono text-muted-foreground mt-0.5">{subtitle}</p>
          ) : null}
        </div>
        {progress ? (
          <span className="shrink-0 rounded-lg border border-foreground/10 bg-muted/40 px-2.5 py-1 text-[11px] font-mono font-bold tabular-nums text-foreground">
            STEP {String(progress.current).padStart(2, "0")}/{String(progress.total).padStart(2, "0")} · {pct}%
          </span>
        ) : null}
        {trailing}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-card/70 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
    </header>
  );
}
