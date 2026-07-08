import type { LmsAchievement, LmsCourse } from "@/data/lms/types";

const PLACEHOLDER_VIDEO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export const LMS_COURSES: LmsCourse[] = [
  {
    slug: "kenya-budget-fundamentals",
    title: "Kenya Budget Fundamentals",
    subtitle: "From Treasury to citizen participation",
    description:
      "A mobile-first journey through Kenya's national budget cycle — formulation, public participation, parliamentary approval, and implementation — built for civic learners.",
    category: "Civic Education",
    difficulty: "Beginner",
    durationMinutes: 95,
    instructor: "Budget Ndio Story",
    heroImage: "/images/explainer-formulation.png",
    requirements: ["No prior finance background required", "15 minutes per session recommended"],
    learningOutcomes: [
      "Explain Kenya’s national budget cycle in plain language",
      "Identify where citizens can participate before approval",
      "Follow money from formulation to implementation",
      "Take one concrete civic action this month",
    ],
    citizensCompleted: 1284,
    awardsCertificate: true,
    modules: [
      {
        slug: "introduction",
        title: "Introduction",
        order: 1,
        durationMinutes: 18,
        status: "completed",
        objectives: [
          "Understand what the national budget is",
          "Meet the institutions that shape Kenya's fiscal year",
        ],
        lessons: [
          {
            slug: "what-is-the-budget",
            title: "What is the National Budget?",
            order: 1,
            durationMinutes: 6,
            summary: "Why the budget matters for every Kenyan.",
            reflectionPrompt: "In one sentence, why should citizens follow the budget?",
            resources: [
              {
                id: "r1",
                label: "Budget cycle overview (PDF)",
                href: "/images/explainer-formulation.png",
                kind: "pdf",
              },
            ],
            parts: [
              {
                id: "p1",
                title: "Introduction",
                durationMinutes: 3,
                videoUrl: PLACEHOLDER_VIDEO,
                transcript:
                  "The national budget is the government's plan for raising and spending public money for a financial year.",
                trivia: {
                  id: "t1",
                  type: "true_false",
                  prompt: "Kenya's national budget only affects national government spending.",
                  answer: false,
                  explanation: "County budgets and public participation also shape how money is allocated.",
                },
              },
              {
                id: "p2",
                title: "Why it matters",
                durationMinutes: 3,
                videoUrl: PLACEHOLDER_VIDEO,
                transcript: "Budget decisions determine funding for education, health, infrastructure, and more.",
              },
            ],
          },
          {
            slug: "who-makes-the-budget",
            title: "Who Makes the Budget?",
            order: 2,
            durationMinutes: 6,
            summary: "Treasury, Parliament, counties, and citizens.",
            reflectionPrompt: "Which institution do you want to engage with first?",
            resources: [],
            parts: [
              {
                id: "p1",
                title: "Institutions",
                durationMinutes: 6,
                videoUrl: PLACEHOLDER_VIDEO,
                transcript: "Treasury formulates, Parliament approves, and citizens participate throughout.",
                trivia: {
                  id: "t2",
                  type: "multiple_choice",
                  prompt: "Who presents the Budget Statement to Parliament?",
                  options: [
                    "National Treasury Cabinet Secretary",
                    "County Governor",
                    "Central Bank Governor",
                    "Attorney General",
                  ],
                  answer: "National Treasury Cabinet Secretary",
                  explanation: "The CS for National Treasury reads the budget estimates to the National Assembly.",
                },
              },
            ],
          },
          {
            slug: "fy-cycle-overview",
            title: "FY Cycle at a Glance",
            order: 3,
            durationMinutes: 6,
            summary: "Five stages from formulation to delivery.",
            reflectionPrompt: "Rate your confidence: 😀 😐 😕",
            resources: [],
            parts: [
              {
                id: "p1",
                title: "Summary",
                durationMinutes: 6,
                videoUrl: PLACEHOLDER_VIDEO,
                transcript: "Formulation, participation, approval, assent, and implementation.",
              },
            ],
          },
        ],
      },
      {
        slug: "core-concepts",
        title: "Core Concepts",
        order: 2,
        durationMinutes: 32,
        status: "in_progress",
        objectives: [
          "Read sector allocations with confidence",
          "Track MTEF and BPS milestones",
        ],
        lessons: [
          {
            slug: "reading-allocations",
            title: "Reading Sector Allocations",
            order: 1,
            durationMinutes: 10,
            summary: "Education, health, infrastructure and more.",
            reflectionPrompt: "Which sector matters most to your community?",
            resources: [
              {
                id: "r2",
                label: "FY2026/27 sector snapshot",
                href: "/reports",
                kind: "link",
              },
            ],
            parts: [
              {
                id: "p1",
                title: "Sector map",
                durationMinutes: 5,
                videoUrl: PLACEHOLDER_VIDEO,
                transcript: "Sector votes show how KES 4.82T is distributed across government priorities.",
              },
              {
                id: "p2",
                title: "Practice",
                durationMinutes: 5,
                videoUrl: PLACEHOLDER_VIDEO,
                transcript: "Follow a worked example for education and health allocations.",
                trivia: {
                  id: "t3",
                  type: "fill_blank",
                  prompt: "Education was allocated approximately KES _____ billion in FY2026/27.",
                  answer: "781",
                  explanation: "The estimates highlight KES 781.4B for education.",
                },
              },
            ],
          },
          {
            slug: "public-participation",
            title: "Public Participation",
            order: 2,
            durationMinutes: 12,
            summary: "How citizens submit input before approval.",
            reflectionPrompt: "What question would you ask at a county hearing?",
            resources: [],
            parts: [
              {
                id: "p1",
                title: "Town halls",
                durationMinutes: 12,
                videoUrl: PLACEHOLDER_VIDEO,
                transcript: "Memoranda, hearings, and civic forums feed into the estimates review.",
              },
            ],
          },
          {
            slug: "parliament-review",
            title: "Parliamentary Review",
            order: 3,
            durationMinutes: 10,
            summary: "What happens after public hearings.",
            reflectionPrompt: "What would you track during committee sittings?",
            resources: [],
            parts: [
              {
                id: "p1",
                title: "Approval",
                durationMinutes: 10,
                videoUrl: PLACEHOLDER_VIDEO,
                transcript: "The National Assembly scrutinises estimates and adopts amendments.",
              },
            ],
          },
        ],
      },
      {
        slug: "practice",
        title: "Practice & Application",
        order: 3,
        durationMinutes: 45,
        status: "locked",
        objectives: ["Apply learning to a county scenario", "Complete a civic action checklist"],
        lessons: [
          {
            slug: "county-scenario",
            title: "County Budget Scenario",
            order: 1,
            durationMinutes: 15,
            summary: "Follow allocations from county to ward projects.",
            reflectionPrompt: "What project would you prioritise in your ward?",
            resources: [],
            parts: [
              {
                id: "p1",
                title: "Scenario walkthrough",
                durationMinutes: 15,
                videoUrl: PLACEHOLDER_VIDEO,
                transcript: "Trace a sample devolved fund from approval to implementation.",
              },
            ],
          },
          {
            slug: "civic-action-plan",
            title: "Your Civic Action Plan",
            order: 2,
            durationMinutes: 12,
            summary: "Turn knowledge into participation steps.",
            reflectionPrompt: "Write one action you will take this month.",
            resources: [],
            parts: [
              {
                id: "p1",
                title: "Action planning",
                durationMinutes: 12,
                videoUrl: PLACEHOLDER_VIDEO,
                transcript: "Choose hearings, memoranda, or community tracking as your next step.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "county-budget-tracking",
    title: "County Budget Tracking",
    subtitle: "Follow the money in your county",
    description:
      "Learn to monitor county estimates, implementation reports, and citizen feedback loops across Kenya's 47 counties.",
    category: "County Governance",
    difficulty: "Intermediate",
    durationMinutes: 70,
    instructor: "Budget Ndio Story",
    heroImage: "/images/towwnhallmay/129A3863.jpg",
    requirements: ["Completed Kenya Budget Fundamentals recommended"],
    modules: [
      {
        slug: "county-basics",
        title: "County Basics",
        order: 1,
        durationMinutes: 20,
        status: "available",
        objectives: ["Understand county fiscal framework"],
        lessons: [
          {
            slug: "county-structure",
            title: "County Fiscal Structure",
            order: 1,
            durationMinutes: 10,
            summary: "Revenue, equitable share, and own-source funding.",
            reflectionPrompt: "What revenue source is most visible in your county?",
            resources: [],
            parts: [
              {
                id: "p1",
                title: "Overview",
                durationMinutes: 10,
                videoUrl: PLACEHOLDER_VIDEO,
                transcript: "Counties raise and spend funds under devolved governance.",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const LMS_ACHIEVEMENTS: LmsAchievement[] = [
  { id: "first-lesson", title: "First Steps", description: "Completed your first lesson", icon: "🎯", unlocked: true },
  { id: "streak-3", title: "3 Day Streak", description: "Learned three days in a row", icon: "🔥", unlocked: true },
  { id: "trivia-10", title: "Trivia Master", description: "10 trivia answers correct", icon: "💡", unlocked: false },
  { id: "module-complete", title: "Module Champion", description: "Finished a full module", icon: "🏆", unlocked: false },
  { id: "perfect-score", title: "Perfect Score", description: "100% on a lesson trivia set", icon: "⭐", unlocked: false },
];

export function getCourse(slug: string) {
  return LMS_COURSES.find((c) => c.slug === slug);
}

export function getModule(courseSlug: string, moduleSlug: string) {
  const course = getCourse(courseSlug);
  return course?.modules.find((m) => m.slug === moduleSlug);
}

export function getLesson(courseSlug: string, moduleSlug: string, lessonSlug: string) {
  const mod = getModule(courseSlug, moduleSlug);
  return mod?.lessons.find((l) => l.slug === lessonSlug);
}

export function getTotalLessons(course: LmsCourse) {
  return course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

export function getCompletedLessonsCount(course: LmsCourse) {
  let count = 0;
  for (const mod of course.modules) {
    if (mod.status === "completed") count += mod.lessons.length;
    else if (mod.status === "in_progress") count += 1;
  }
  return count;
}
