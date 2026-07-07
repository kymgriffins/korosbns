"use client";

import Link from "next/link";
import { ChevronDown, Clock, Lock, CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { LmsModule } from "@/data/lms/types";
import { LmsRoutes } from "@/data/lms/routes";
import { cn } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type ModuleCardProps = {
  courseSlug: string;
  module: LmsModule;
  defaultOpen?: boolean;
};

const statusConfig = {
  completed: { label: "Completed", icon: CheckCircle2, tone: "text-emerald-600" },
  in_progress: { label: "In progress", icon: Circle, tone: "text-primary" },
  available: { label: "Available", icon: Circle, tone: "text-muted-foreground" },
  locked: { label: "Locked", icon: Lock, tone: "text-muted-foreground" },
} as const;

export function ModuleCard({ courseSlug, module, defaultOpen = false }: ModuleCardProps) {
  const config = statusConfig[module.status];
  const StatusIcon = config.icon;
  const locked = module.status === "locked";

  return (
    <Collapsible defaultOpen={defaultOpen && !locked} className="rounded-2xl border border-border/60 bg-card shadow-sm">
      <CollapsibleTrigger
        disabled={locked}
        className={cn(
          "flex w-full items-start gap-4 p-5 text-left transition-colors",
          !locked && "hover:bg-muted/30",
          locked && "cursor-not-allowed opacity-70",
        )}
      >
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Module {module.order}
            </span>
            <Badge variant={module.status === "completed" ? "default" : "secondary"}>{config.label}</Badge>
          </div>
          <h3 className="text-lg font-semibold tracking-tight">{module.title}</h3>
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{module.lessons.length} lessons</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {module.durationMinutes} min
            </span>
          </p>
          {locked ? (
            <p className="text-sm text-muted-foreground">Unlocked after completing the previous module</p>
          ) : null}
        </div>
        <div className="flex flex-col items-center gap-2 pt-1">
          <StatusIcon className={cn("size-5", config.tone)} />
          {!locked ? (
            <ChevronDown className="size-4 text-muted-foreground transition-transform [[data-state=open]_&]:rotate-180" />
          ) : null}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <AnimatePresence initial={false}>
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-1 border-t border-border/60 px-3 py-3"
          >
            {module.lessons.map((lesson) => (
              <li key={lesson.slug}>
                <Link
                  href={LmsRoutes.lesson(courseSlug, module.slug, lesson.slug)}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors hover:bg-muted/40"
                >
                  <span className="font-medium">{lesson.title}</span>
                  <span className="text-muted-foreground">{lesson.durationMinutes} min</span>
                </Link>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
}
