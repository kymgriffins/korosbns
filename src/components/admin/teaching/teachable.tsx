"use client";

import { useState, type ReactNode } from "react";
import { CircleHelp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTeachingOptional } from "./teaching-context";

type TeachableProps = {
  /** Must match an action id in the page catalog when possible */
  tipId: string;
  title: string;
  body: string;
  children: ReactNode;
  className?: string;
  /** Place the help affordance */
  align?: "start" | "end";
};

/**
 * Wraps a control with an optional coachmark (?). Hidden entirely when teaching is muted.
 */
export function Teachable({ tipId, title, body, children, className, align = "end" }: TeachableProps) {
  const teaching = useTeachingOptional();
  const [open, setOpen] = useState(false);
  const show = teaching?.ready && !teaching.muted;

  if (!show) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn("relative inline-flex max-w-full items-start gap-1", className)}
      data-teach-id={tipId}
    >
      <div className="min-w-0 flex-1">{children}</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className={cn(
              "mt-0.5 size-6 shrink-0 rounded-full text-muted-foreground hover:text-foreground",
              align === "start" && "order-first",
            )}
            aria-label={`What is ${title}?`}
          >
            <CircleHelp className="size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align={align === "start" ? "start" : "end"} className="w-72 space-y-1.5 p-3">
          <p className="text-sm font-semibold leading-snug">{title}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
