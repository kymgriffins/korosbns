"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[BNS:API] Root segment error", {
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
        Something went wrong
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        An unexpected error stopped this page. Retry, or head back to programmes —
        catalogue pages use offline JSON when the API is down.
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
          href="/programmes"
          className="rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground"
        >
          Browse programmes
        </Link>
      </div>
    </div>
  );
}
