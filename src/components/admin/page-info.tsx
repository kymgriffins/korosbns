"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function PageInfo({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Page info"
          >
            <Info className="size-3.5" />
            Tips
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="start" className="max-w-sm">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function PageSection({ title, tip }: { title: string; tip: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <PageInfo>
          <p>{tip}</p>
        </PageInfo>
      </div>
    </div>
  );
}
