import { describe, expect, it } from "vitest";
import { resolveActiveCourse, resolveContinueLesson } from "@/lib/learning-runtime/continue";
import { EMPTY_PROGRESS } from "@/lib/learning-runtime/reducer";
import type { LmsCourse } from "@/data/lms/types";
import type { LearningSession } from "@/lib/learning-runtime/types";

const course: LmsCourse = {
  slug: "kenya-budget-fundamentals",
  title: "Kenya Budget Fundamentals",
  subtitle: "Test",
  description: "Test",
  category: "Civic",
  difficulty: "Beginner",
  durationMinutes: 60,
  instructor: "BNS",
  heroImage: "/test.png",
  requirements: [],
  awardsCertificate: true,
  citizensCompleted: 10,
  modules: [
    {
      slug: "introduction",
      title: "Introduction",
      order: 1,
      durationMinutes: 18,
      status: "in_progress",
      objectives: [],
      lessons: [
        {
          slug: "what-is-the-budget",
          title: "What is the Budget?",
          order: 1,
          durationMinutes: 6,
          summary: "",
          reflectionPrompt: "",
          resources: [],
          parts: [{ id: "p1", title: "Part 1", durationMinutes: 3, videoUrl: "/v.mp4", transcript: "" }],
        },
        {
          slug: "who-makes-the-budget",
          title: "Who Makes the Budget?",
          order: 2,
          durationMinutes: 6,
          summary: "",
          reflectionPrompt: "",
          resources: [],
          parts: [{ id: "p1", title: "Part 1", durationMinutes: 3, videoUrl: "/v.mp4", transcript: "" }],
        },
      ],
    },
  ],
};

const session: LearningSession = {
  sessionId: "test",
  courseSlug: "kenya-budget-fundamentals",
  moduleSlug: "introduction",
  lessonSlug: "what-is-the-budget",
  partId: "p1",
  startedAt: "2026-07-08T00:00:00.000Z",
};

describe("resolveContinueLesson", () => {
  it("returns session lesson when in progress", () => {
    const target = resolveContinueLesson(course, EMPTY_PROGRESS, session);
    expect(target?.label).toBe("Continue Learning");
    expect(target?.href).toContain("what-is-the-budget");
  });

  it("returns next incomplete lesson after first completed", () => {
    const progress = {
      ...EMPTY_PROGRESS,
      completedLessons: ["kenya-budget-fundamentals/introduction/what-is-the-budget"],
    };
    const target = resolveContinueLesson(course, progress, session);
    expect(target?.href).toContain("who-makes-the-budget");
    expect(target?.label).toBe("Continue Learning");
  });

  it("returns enroll label for fresh learner", () => {
    const emptySession: LearningSession = {
      sessionId: "test",
      courseSlug: null,
      moduleSlug: null,
      lessonSlug: null,
      partId: null,
      startedAt: null,
    };
    const target = resolveContinueLesson(course, EMPTY_PROGRESS, emptySession);
    expect(target?.label).toBe("Start Journey");
  });
});

describe("resolveActiveCourse", () => {
  it("prefers session course", () => {
    const active = resolveActiveCourse([course], session);
    expect(active?.slug).toBe("kenya-budget-fundamentals");
  });
});
