"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
  trailing,
  className,
}: ImmersiveChromeProps) {
  const pct =
    progress && progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  return (
    <header
      className={cn(
        "immersive-chrome sticky top-0 z-20 border-b border-foreground/10 bg-background/95 backdrop-blur-md",
        className,
      )}
    >
      {progress ? (
        <div className="h-1 w-full overflow-hidden bg-muted/40">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}
      <div className="flex items-center gap-3 px-4 py-3 safe-area-inset-top">
        <Link
          href={backHref}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-card text-foreground"
          aria-label="Go back"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1 pr-2">
          <p className="truncate text-sm font-semibold leading-tight">{title}</p>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {progress ? (
          <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
            {progress.current}/{progress.total}
          </span>
        ) : null}
        {trailing}
      </div>
    </header>
  );
}
