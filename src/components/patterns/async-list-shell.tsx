"use client";

import type { ReactNode } from "react";
import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EmptyStateShell({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
        {icon ?? <Inbox className="size-6" aria-hidden />}
      </div>
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function AsyncListShell({
  loading,
  error,
  isEmpty,
  onRetry,
  loadingFallback,
  empty,
  children,
  className,
}: {
  loading: boolean;
  error?: string | null;
  isEmpty: boolean;
  onRetry?: () => void;
  loadingFallback?: ReactNode;
  empty: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  if (loading) {
    return (
      <div className={className} aria-busy="true" aria-live="polite">
        {loadingFallback ?? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive",
          className,
        )}
        role="alert"
      >
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div className="min-w-0 flex-1">
            <p>{error}</p>
            {onRetry && (
              <Button variant="link" className="h-auto px-0 text-destructive" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return <div className={className}>{empty}</div>;
  }

  return <div className={className}>{children}</div>;
}
