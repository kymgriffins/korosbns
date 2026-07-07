"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LmsRoutes } from "@/data/lms/routes";

/**
 * Learn route error boundary — @see docs/ljp-spec/error-handling.md
 */
export function LmsErrorBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  // Phase B: wrap with react-error-boundary or class boundary
  return <>{children}</>;
}

export function LmsErrorFallback() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        Your progress is saved when possible. Try again or return home.
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => window.location.reload()}>
          Reload
        </Button>
        <Button asChild>
          <Link href={LmsRoutes.home}>Back to Learn</Link>
        </Button>
      </div>
    </div>
  );
}
