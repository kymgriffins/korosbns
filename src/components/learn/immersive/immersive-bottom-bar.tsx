"use client";

import Link from "next/link";
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
    <footer className="sticky bottom-0 z-20 border-t border-border/40 bg-background/90 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg gap-3">
        {prevHref ? (
          <Link
            href={prevHref}
            aria-disabled={prevDisabled}
            className={cn(
              "immersive-primary-action flex flex-1 items-center justify-center border border-border bg-card font-semibold",
              prevDisabled && "pointer-events-none opacity-40",
            )}
          >
            Back
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {onNext ? (
          <button
            type="button"
            disabled={nextDisabled}
            onClick={onNext}
            className="immersive-primary-action flex flex-[1.4] items-center justify-center bg-primary font-semibold text-primary-foreground disabled:opacity-40"
          >
            {nextLabel}
          </button>
        ) : nextHref ? (
          <Link
            href={nextHref}
            aria-disabled={nextDisabled}
            className={cn(
              "immersive-primary-action flex flex-[1.4] items-center justify-center bg-primary font-semibold text-primary-foreground",
              nextDisabled && "pointer-events-none opacity-40",
            )}
          >
            {nextLabel}
          </Link>
        ) : null}
      </div>
    </footer>
  );
}
