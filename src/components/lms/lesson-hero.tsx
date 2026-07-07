"use client";

import { Bookmark, Clock, Share2 } from "lucide-react";
import { ProgressBar } from "@/components/lms/progress-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

type LessonHeroProps = {
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonNumber: number;
  durationMinutes: number;
  completed: number;
  total: number;
  className?: string;
};

export function LessonHero({
  courseTitle,
  moduleTitle,
  lessonTitle,
  lessonNumber,
  durationMinutes,
  completed,
  total,
  className,
}: LessonHeroProps) {
  return (
    <header className={cn("space-y-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm md:p-6", className)}>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>{courseTitle}</p>
        <p>{moduleTitle}</p>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Lesson {lessonNumber}</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{lessonTitle}</h1>
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" />
            {durationMinutes} minutes
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="icon" className="rounded-full" aria-label="Bookmark">
            <Bookmark className="size-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" className="rounded-full" aria-label="Share">
            <Share2 className="size-4" />
          </Button>
        </div>
      </div>
      <ProgressBar completed={completed} total={total} />
      <Button className="w-full sm:w-auto">Resume</Button>
    </header>
  );
}
