"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types/tasks";

const STATUS_LABEL: Record<TaskStatus, string> = {
  draft: "Draft",
  audited: "Audited",
  published: "Published",
};

export function TaskDetailMobileChrome({
  task,
  backHref,
  trailing,
  className,
}: {
  task: Task;
  backHref: string;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 -mx-2 flex items-center gap-2 border-b border-border/60 bg-background/95 px-2 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-0 sm:px-0 lg:hidden",
        className,
      )}
    >
      <Link
        href={backHref}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Back to tasks"
      >
        <ArrowLeft className="size-4" />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">{task.title}</p>
        <p className="truncate font-mono text-[10px] text-muted-foreground">
          ref {task.id.slice(0, 8)}
        </p>
      </div>
      <span className="shrink-0 rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-[10px] font-semibold">
        {STATUS_LABEL[task.status]}
      </span>
      {trailing}
    </header>
  );
}
