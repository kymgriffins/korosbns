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
        "immersive-chrome sticky top-0 z-20 border-b border-border/40 bg-background/80",
        className,
      )}
    >
      {progress ? (
        <div className="h-0.5 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out w-[var(--p)]"
            style={{ "--p": `${pct}%` } as React.CSSProperties}
          />
        </div>
      ) : null}
      <div className="flex items-center gap-3 px-4 py-3 safe-area-inset-top">
        <Link
          href={backHref}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted/60 text-foreground transition-colors hover:bg-muted"
          aria-label="Go back"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-tight tracking-tight">{title}</p>
          {subtitle ? (
            <p className="truncate text-[13px] text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {progress ? (
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[12px] font-semibold tabular-nums text-muted-foreground">
            {progress.current}/{progress.total}
          </span>
        ) : null}
        {trailing}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted/60"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        ) : null}
      </div>
    </header>
  );
}
