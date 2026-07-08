"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LmsRoutes } from "@/data/lms/routes";

type BoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type BoundaryState = {
  hasError: boolean;
};

/**
 * @sdp-provenance capability: CAP-learning-shell
 * @see docs/ljp-spec/error-handling.md
 */
export class LmsErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("[LmsErrorBoundary]", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <LmsErrorFallback />;
    }
    return this.props.children;
  }
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
        <Button asChild className="ljp-btn-primary">
          <Link href={LmsRoutes.home}>Back to Learn</Link>
        </Button>
      </div>
    </div>
  );
}
