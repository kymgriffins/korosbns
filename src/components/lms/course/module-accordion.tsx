/**
 * @sdp-provenance
 * capability: CAP-course-detail
 * spec_id: LJP-004
 * contracts: module-card@1.0.0,sic-cap-004@1.0.0
 */
"use client";

import Link from "next/link";
import { Clock, Lock, CheckCircle2, Circle } from "lucide-react";
import type { LmsCourse } from "@/data/lms/types";
import { LmsRoutes } from "@/data/lms/routes";
import { isLessonUnlocked, useLearningRuntime } from "@/lib/learning-runtime";
import { lessonKey } from "@/lib/learning-runtime/types";
import { cn } from "@/utils";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LMS_MOTION, LMS_RADIUS, LMS_TYPE } from "@/constants/lms-design-tokens";
import { resolveDefaultOpenModule } from "./format-journey-time";

type ModuleAccordionProps = {
  course: LmsCourse;
};

const statusConfig = {
  completed: { label: "Completed", icon: CheckCircle2, tone: "text-emerald-600" },
  in_progress: { label: "In progress", icon: Circle, tone: "text-foreground" },
  available: { label: "Available", icon: Circle, tone: "text-muted-foreground" },
  locked: { label: "Locked", icon: Lock, tone: "text-muted-foreground" },
} as const;

export function ModuleAccordion({ course }: ModuleAccordionProps) {
  const { state } = useLearningRuntime();
  const defaultOpen = resolveDefaultOpenModule(course.modules);

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen}
      className="space-y-4"
    >
      {course.modules.map((mod) => {
        const config = statusConfig[mod.status];
        const StatusIcon = config.icon;
        const locked = mod.status === "locked";
        const lessonTotal = mod.lessons.length;
        const completedInModule =
          mod.status === "completed"
            ? lessonTotal
            : mod.lessons.filter((lesson) =>
                state.progress.completedLessons.includes(
                  lessonKey({
                    courseSlug: course.slug,
                    moduleSlug: mod.slug,
                    lessonSlug: lesson.slug,
                  }),
                ),
              ).length;
        const showProgress = completedInModule > 0 || mod.status === "completed";

        return (
          <AccordionItem
            key={mod.slug}
            value={mod.slug}
            disabled={locked}
            className={cn(
              "overflow-hidden border border-border/60 bg-card shadow-sm",
              LMS_RADIUS.card,
            )}
            style={{ transitionDuration: `${LMS_MOTION.hoverMs}ms` }}
          >
            <AccordionTrigger
              className={cn(
                "px-4 py-4 hover:no-underline hover:bg-muted/30 md:px-5 md:py-5 [&[data-state=open]>svg]:rotate-180",
                locked && "cursor-not-allowed opacity-70",
              )}
              style={{ transitionDuration: `${LMS_MOTION.hoverMs}ms` }}
            >
              <div className="flex flex-1 items-start gap-4 text-left">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        LMS_TYPE.meta,
                        "font-semibold uppercase tracking-wider text-muted-foreground",
                      )}
                    >
                      Module {mod.order}
                    </span>
                    <Badge variant={mod.status === "completed" ? "default" : "secondary"}>
                      {config.label}
                    </Badge>
                  </div>
                  <h3 className={cn(LMS_TYPE.body, "text-lg font-semibold tracking-tight")}>
                    {mod.title}
                  </h3>
                  <p className={cn(LMS_TYPE.caption, "flex flex-wrap items-center gap-3 text-muted-foreground")}>
                    <span>{mod.lessons.length} lessons</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" aria-hidden />
                      {mod.durationMinutes} min
                    </span>
                    {showProgress ? (
                      <span>
                        {completedInModule}/{lessonTotal}
                      </span>
                    ) : null}
                  </p>
                </div>
                <StatusIcon className={cn("size-5 shrink-0", config.tone)} aria-hidden />
              </div>
            </AccordionTrigger>
            <AccordionContent
              className="px-3 pb-3"
              style={{ transitionDuration: `${LMS_MOTION.accordionMs}ms` }}
            >
              <ul className="space-y-1 border-t border-border/60 pt-3">
                {mod.lessons.map((lesson) => {
                  const unlocked = isLessonUnlocked(
                    course,
                    mod.slug,
                    lesson.slug,
                    state.progress,
                  );
                  return (
                    <li key={lesson.slug}>
                      {unlocked ? (
                        <Link
                          href={LmsRoutes.lesson(course.slug, mod.slug, lesson.slug)}
                          className={cn(
                            "flex items-center justify-between px-3 py-3 text-sm transition-colors hover:bg-muted/40",
                            LMS_RADIUS.button,
                          )}
                          style={{ transitionDuration: `${LMS_MOTION.hoverMs}ms` }}
                        >
                          <span className="font-medium">{lesson.title}</span>
                          <span className="text-muted-foreground">{lesson.durationMinutes} min</span>
                        </Link>
                      ) : (
                        <div
                          className={cn(
                            "flex items-center justify-between px-3 py-3 text-sm text-muted-foreground opacity-60",
                            LMS_RADIUS.button,
                          )}
                        >
                          <span className="inline-flex items-center gap-2 font-medium">
                            <Lock className="size-3.5" aria-hidden />
                            {lesson.title}
                          </span>
                          <span>{lesson.durationMinutes} min</span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
