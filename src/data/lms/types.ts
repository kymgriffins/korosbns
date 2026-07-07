export type ModuleStatus = "completed" | "in_progress" | "locked" | "available";

export type TriviaType =
  | "multiple_choice"
  | "true_false"
  | "fill_blank";

export type LmsResource = {
  id: string;
  label: string;
  href: string;
  kind: "pdf" | "link" | "template";
};

export type LmsTrivia = {
  id: string;
  type: TriviaType;
  prompt: string;
  options?: string[];
  answer: string | boolean;
  explanation: string;
};

export type LmsVideoPart = {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl: string;
  transcript: string;
  trivia?: LmsTrivia;
};

export type LmsLesson = {
  slug: string;
  title: string;
  order: number;
  durationMinutes: number;
  summary: string;
  parts: LmsVideoPart[];
  reflectionPrompt: string;
  resources: LmsResource[];
};

export type LmsModule = {
  slug: string;
  title: string;
  order: number;
  durationMinutes: number;
  status: ModuleStatus;
  objectives: string[];
  lessons: LmsLesson[];
};

export type LmsCourse = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMinutes: number;
  instructor: string;
  heroImage: string;
  requirements: string[];
  modules: LmsModule[];
};

export type LmsAchievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};
