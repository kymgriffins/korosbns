/**
 * @sdp-provenance
 * capability: CAP-home-continue
 * spec_id: LJP-005
 * contracts: continue-button@1.0.0, course-card@1.0.0
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import type { LmsCourse } from "@/data/lms/types";
import { getCompletedLessonsCount, getTotalLessons } from "@/data/lms/catalog";
import {
  resolveActiveCourse,
  resolveContinueLesson,
  useLearningRuntime,
} from "@/lib/learning-runtime";
import { ProgressBar } from "@/components/lms/progress-bar";
import { LMS_LAYOUT, LMS_RADIUS } from "@/constants/lms-design-tokens";
import { cn } from "@/utils";

type ContinueCardProps = {
  courses: LmsCourse[];
};

export function ContinueCard({ courses }: ContinueCardProps) {
  const { state } = useLearningRuntime();
  const course = resolveActiveCourse(courses, state.session);
  const target = course ? resolveContinueLesson(course, state.progress, state.session) : null;

  if (!course || !target) return null;

  const total = getTotalLessons(course);
  const completed = getCompletedLessonsCount(course);

  return (
    <Link
      href={target.href}
      className={cn(
        "group block overflow-hidden border border-border/50 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:ljp-surface-elevated",
        LMS_RADIUS.cardLg,
      )}
    >
      <div className="grid gap-0 lg:grid-cols-[3fr_2fr]">
        <div
          className={cn(
            "relative",
            LMS_LAYOUT.heroFeaturedMobileHeightClass,
            LMS_LAYOUT.heroFeaturedTabletHeightClass,
            LMS_LAYOUT.heroFeaturedDesktopHeightClass,
          )}
        >
          <Image
            src={course.heroImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>
        <div className="flex flex-col justify-center gap-6 p-6 md:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Continue learning
          </p>
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">{course.title}</h3>
          <ProgressBar completed={completed} total={total} />
          <span className="inline-flex min-h-11 items-center text-sm font-semibold text-foreground">
            {target.label} →
          </span>
        </div>
      </div>
    </Link>
  );
}
