"use client";

import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { cn } from "@/utils";

interface LearnEmptyStateProps {
  icon: LucideIcon;
  heading: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  /** Render borderless — useful when the parent already has a card border */
  borderless?: boolean;
  className?: string;
}

export function LearnEmptyState({
  icon: Icon,
  heading,
  description,
  action,
  borderless = false,
  className,
}: LearnEmptyStateProps) {
  const inner = (
    <div className="flex flex-col items-center text-center gap-3 py-10">
      <div className="size-12 rounded-full bg-muted/30 flex items-center justify-center ring-1 ring-border/30">
        <Icon className="size-5 text-muted-foreground/40" aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-muted-foreground">{heading}</p>
        {description && (
          <p className="text-xs text-muted-foreground/70 max-w-xs">{description}</p>
        )}
      </div>
      {action && (
        <Button
          variant="outline"
          size="sm"
          onClick={action.onClick}
          className="rounded-lg text-xs font-semibold focus-visible:ring-2 focus-visible:ring-ring"
        >
          {action.label}
        </Button>
      )}
    </div>
  );

  if (borderless) {
    return <div className={cn("w-full", className)}>{inner}</div>;
  }

  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="p-0">{inner}</CardContent>
    </Card>
  );
}
