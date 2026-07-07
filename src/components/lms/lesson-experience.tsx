"use client";

import { useMemo, useState } from "react";
import type { LmsLesson } from "@/data/lms/types";
import { LessonHero } from "@/components/lms/lesson-hero";
import { VideoExperience } from "@/components/lms/video-experience";
import { TriviaSheet } from "@/components/lms/trivia-sheet";
import { ReflectionCard } from "@/components/lms/reflection-card";
import { ResourcesSection } from "@/components/lms/resources-section";
import { LessonFooter } from "@/components/lms/lesson-footer";

type LessonExperienceProps = {
  courseTitle: string;
  moduleTitle: string;
  lesson: LmsLesson;
  lessonNumber: number;
  completedLessons: number;
  totalLessons: number;
  prevHref?: string;
  nextHref?: string;
};

export function LessonExperience({
  courseTitle,
  moduleTitle,
  lesson,
  lessonNumber,
  completedLessons,
  totalLessons,
  prevHref,
  nextHref,
}: LessonExperienceProps) {
  const triviaByPart = useMemo(() => {
    const map = new Map<string, NonNullable<(typeof lesson.parts)[number]["trivia"]>>();
    for (const part of lesson.parts) {
      if (part.trivia) map.set(part.id, part.trivia);
    }
    return map;
  }, [lesson.parts]);

  const [activeTrivia, setActiveTrivia] = useState<(typeof lesson.parts)[number]["trivia"] | null>(null);

  return (
    <div className="space-y-6 pb-8">
      <LessonHero
        courseTitle={courseTitle}
        moduleTitle={moduleTitle}
        lessonTitle={lesson.title}
        lessonNumber={lessonNumber}
        durationMinutes={lesson.durationMinutes}
        completed={completedLessons}
        total={totalLessons}
      />

      <p className="text-sm leading-relaxed text-muted-foreground">{lesson.summary}</p>

      <VideoExperience
        parts={lesson.parts}
        onPartEnd={(partId) => {
          const trivia = triviaByPart.get(partId);
          if (trivia) setActiveTrivia(trivia);
        }}
      />

      {activeTrivia ? (
        <TriviaSheet
          trivia={activeTrivia}
          open={Boolean(activeTrivia)}
          onClose={() => setActiveTrivia(null)}
        />
      ) : null}

      <ReflectionCard prompt={lesson.reflectionPrompt} />
      <ResourcesSection resources={lesson.resources} />
      <LessonFooter prevHref={prevHref} nextHref={nextHref} />
    </div>
  );
}
