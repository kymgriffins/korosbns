/**
 * @sdp-provenance
 * capability: CAP-course-detail
 * spec_id: LJP-004
 * contracts: course-hero@1.0.0,sic-cap-004@1.0.0
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LmsCourse } from "@/data/lms/types";
import { getCompletedLessonsCount, getTotalLessons } from "@/data/lms/catalog";
import { resolveContinueLesson, useLearningRuntime } from "@/lib/learning-runtime";
import { ProgressBar } from "@/components/lms/progress-bar";
import { Badge } from "@/components/ui/badge";
import {
  LMS_LAYOUT,
  LMS_MOTION,
  LMS_RADIUS,
  LMS_TOUCH,
  LMS_TYPE,
} from "@/constants/lms-design-tokens";
import { JourneyMeta } from "./journey-meta";
import { cn } from "@/utils";

type CourseHeroProps = {
  course: LmsCourse;
};

export function CourseHero({ course }: CourseHeroProps) {
  const { state } = useLearningRuntime();
  const total = getTotalLessons(course);
  const completed = getCompletedLessonsCount(course);
  const target = resolveContinueLesson(course, state.progress, state.session);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target?.href]);

  const accessibleLabel = target ? `${target.label}: ${course.title}` : undefined;
  const initial = course.category.trim().charAt(0).toUpperCase() || "J";

  return (
    <>
      <section
        aria-labelledby="journey-hero-title"
        className={cn(
          "overflow-hidden border border-border/60 bg-card shadow-sm",
          LMS_RADIUS.cardLg,
        )}
      >
        <div className="grid gap-0 lg:grid-cols-[3fr_2fr]">
          <div
            className={cn(
              "relative w-full bg-background",
              LMS_LAYOUT.heroMobileAspectClass,
              LMS_LAYOUT.heroDesktopMinHeightClass,
              "lg:aspect-auto",
            )}
          >
            {course.heroImage ? (
              <Image
                src={course.heroImage}
                alt=""
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            ) : (
              <div
                className={cn(
                  "flex h-full w-full items-center justify-center bg-background",
                  LMS_LAYOUT.heroDesktopMinHeightClass,
                )}
                aria-hidden
              >
                <span className={cn(LMS_TYPE.caption, "text-muted-foreground")}>{initial}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-4 p-6 lg:p-8">
            <div className="flex flex-wrap gap-2">
              <Badge className={LMS_TYPE.caption}>{course.category}</Badge>
              <Badge variant="outline" className={LMS_TYPE.caption}>
                {course.difficulty}
              </Badge>
            </div>

            <div className="space-y-2">
              <h1
                id="journey-hero-title"
                className={cn(LMS_TYPE.journeyTitle, "font-semibold tracking-tight")}
              >
                {course.title}
              </h1>
              <p className={cn(LMS_TYPE.body, "max-w-[60ch] text-muted-foreground")}>
                {course.subtitle}
              </p>
            </div>

            <JourneyMeta course={course} />

            <ProgressBar
              completed={completed}
              total={total}
              label={`${completed} of ${total} lessons`}
            />

            {target ? (
              <div className="pt-2">
                <Link
                  ref={ctaRef}
                  href={target.href}
                  aria-label={accessibleLabel}
                  onClick={() => setOpening(true)}
                  className={cn(
                    "ljp-btn-primary inline-flex w-full items-center justify-center px-6 text-sm font-semibold transition-opacity sm:w-auto",
                    LMS_TOUCH.minTarget,
                    LMS_RADIUS.button,
                    opening && "pointer-events-none opacity-60",
                  )}
                  style={{ transitionDuration: `${LMS_MOTION.hoverMs}ms` }}
                >
                  {opening ? "Opening…" : target.label}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {target && stickyVisible ? (
        <div
          role="region"
          aria-label="Continue journey"
          className={cn(
            "fixed inset-x-0 z-40 border-t border-border/60 bg-background/95 p-4 backdrop-blur-md lg:hidden",
            "bottom-[var(--mobile-nav-height,4rem)] pb-[calc(1rem+env(safe-area-inset-bottom,0px))]",
          )}
          style={{ transitionDuration: `${LMS_MOTION.stickyCtaMs}ms` }}
        >
          <Link
            href={target.href}
            aria-label={accessibleLabel}
            onClick={() => setOpening(true)}
            className={cn(
              "ljp-btn-primary flex w-full items-center justify-center px-6 text-sm font-semibold",
              LMS_TOUCH.minTarget,
              LMS_RADIUS.button,
              opening && "pointer-events-none opacity-60",
            )}
          >
            {opening ? "Opening…" : target.label}
          </Link>
        </div>
      ) : null}
    </>
  );
}
