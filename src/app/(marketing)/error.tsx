"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[BNS:API] Marketing segment error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Budget Ndio Story
      </p>
      <h2 className="max-w-lg text-2xl font-semibold tracking-tight">
        This page is temporarily unavailable
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        We could not finish loading this view. Read-only catalogue data stays available
        offline where we have JSON fallbacks — try again, or continue from Learn.
      </p>
      {error.digest ? (
        <p className="font-mono text-[10px] text-muted-foreground/80">Ref: {error.digest}</p>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Try again
        </button>
        <Link
          href="/learn"
          className="rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground"
        >
          Back to Learn
        </Link>
        <Link
          href="/"
          className="rounded-md px-4 py-2 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
