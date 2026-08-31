"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/utils";

export function ImmersiveBottomBar({
  prevHref,
  nextHref,
  nextLabel = "Continue",
  prevDisabled,
  nextDisabled,
  onNext,
}: {
  prevHref?: string;
  nextHref?: string;
  nextLabel?: string;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  onNext?: () => void;
}) {
  return (
    <footer className="sticky bottom-0 z-20 border-t border-foreground/10 bg-background/95 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        {prevHref ? (
          <Link
            href={prevHref}
            aria-disabled={prevDisabled}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-foreground/10 bg-card px-4 py-2.5 text-xs font-mono font-bold text-foreground transition-all hover:bg-muted hover:border-foreground/20",
              prevDisabled && "pointer-events-none opacity-40",
            )}
          >
            <ArrowLeft className="size-3.5" />
            <span>Previous</span>
          </Link>
        ) : (
          <div />
        )}

        {onNext ? (
          <button
            type="button"
            disabled={nextDisabled}
            onClick={onNext}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 px-6 py-2.5 text-xs font-mono font-bold text-primary-foreground transition-all shadow-xs disabled:opacity-40 cursor-pointer"
          >
            <span>{nextLabel}</span>
            <ArrowRight className="size-3.5" />
          </button>
        ) : nextHref ? (
          <Link
            href={nextHref}
            aria-disabled={nextDisabled}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 px-6 py-2.5 text-xs font-mono font-bold text-primary-foreground transition-all shadow-xs",
              nextDisabled && "pointer-events-none opacity-40",
            )}
          >
            <span>{nextLabel}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        ) : null}
      </div>
    </footer>
  );
}
