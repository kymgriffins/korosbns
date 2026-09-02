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
    <footer className="sticky bottom-0 z-20 border-t border-foreground/10 bg-background/95 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        {prevHref ? (
          <Link
            href={prevHref}
            aria-disabled={prevDisabled}
            className={cn(
              "flex size-11 items-center justify-center rounded-xl border border-foreground/10 bg-card text-foreground",
              prevDisabled && "pointer-events-none opacity-40",
            )}
            aria-label="Previous"
          >
            <ArrowLeft className="size-4" />
          </Link>
        ) : (
          <div className="size-11" />
        )}

        {onNext ? (
          <button
            type="button"
            disabled={nextDisabled}
            onClick={onNext}
            className="immersive-primary-action flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            <span>{nextLabel}</span>
            <ArrowRight className="size-4" />
          </button>
        ) : nextHref ? (
          <Link
            href={nextHref}
            aria-disabled={nextDisabled}
            className={cn(
              "immersive-primary-action flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground",
              nextDisabled && "pointer-events-none opacity-40",
            )}
          >
            <span>{nextLabel}</span>
            <ArrowRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </footer>
  );
}
