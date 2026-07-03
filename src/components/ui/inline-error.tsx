"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/index";

interface InlineErrorProps {
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function InlineError({
  message = "Something went wrong",
  error,
  onRetry,
  className,
  compact,
}: InlineErrorProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  if (errorMessage) {
    console.error("[InlineError]", errorMessage);
  }

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5",
        compact ? "p-3" : "p-5",
        className,
      )}
    >
      <AlertTriangle className={cn(
        "mt-0.5 shrink-0 text-destructive",
        compact ? "size-4" : "size-5",
      )} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className={cn(
          "font-medium text-destructive",
          compact ? "text-xs" : "text-sm",
        )}>
          {message}
        </p>
        {errorMessage && (
          <p className={cn(
            "text-destructive/70",
            compact ? "text-[10px]" : "text-xs",
          )}>
            {errorMessage}
          </p>
        )}
        {onRetry && (
          <div className="mt-1">
            <Button
              variant="outline"
              size={compact ? "xs" : "sm"}
              onClick={onRetry}
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
