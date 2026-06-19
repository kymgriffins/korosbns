export type StageTrivia = {
  id?: string;
  type: "multiple-choice" | "reflection";
  question: string;
  options?: string[];
  answer?: number;
  explanation?: string;
  placeholder?: string;
  trivia_id?: string | null;
};

export type StageTakeaway = {
  type: "info" | "warning" | "tip";
  title: string;
  text: string;
};

export type ChapterVideo = {
  order: number;
  role: string;
  title?: string;
  url?: string;
  youtube_video_id?: string;
};

export type ChapterStep = {
  id: string;
  chapterId?: string;
  triviaId?: string | null;
  title: string;
  order: number;
  youtube_url: string;
  youtube_urls?: string[];
  image_urls?: string[];
  audio_url: string;
  transcript: string;
  text: string;
  article_slug?: string | null;
  article_summary?: string;
  report?: Record<string, unknown>;
  takeaways: StageTakeaway[];
  trivia?: StageTrivia[];
  estimated_minutes?: number;
  is_completed: boolean;
  is_locked: boolean;
  learning_outcomes?: LearningOutcome[];
  videos?: ChapterVideo[];
  budget_entity_id?: string | null;
  budget_entity_name?: string | null;
};

export type LearningOutcome = {
  id: string;
  description: string;
};

export type CivicModuleSocials = {
  linkedin?: string;
  x?: string;
  website?: string;
  [platform: string]: string | undefined;
};

export type CivicModuleAuthor = {
  name: string;
  slug: string;
  image: string;
  role: string;
  bio: string;
  intro_video_url?: string;
  socials?: CivicModuleSocials;
};

export type CivicModule = {
  id: string;
  title: string;
  slug: string;
  badge: string;
  badgeName: string;
  documentName: string;
  archive: string;
  link: string;
  status: string;
  credits: string;
  description: string;
  expectations: string[];
  image_url?: string;
  order: number;
  is_financial_year_analysis?: boolean;
  fiscal_year_id?: string | null;
  fiscal_year_label?: string | null;
  metadata?: Record<string, unknown>;
  is_locked?: boolean;
  steps: ChapterStep[];
  author?: CivicModuleAuthor | null;
  trivia?: StageTrivia[];
  trivia_id?: string | null;
};

export type LearnContentType =
  | "video"
  | "article"
  | "story"
  | "document"
  | "path"
  | "quest"
  | "lesson";

export type LearnHubItem = {
  id: string;
  content_type: LearnContentType;
  title: string;
  summary?: string;
  slug?: string;
  url?: string;
  thumbnail_url?: string;
  published_at?: string | null;
  difficulty?: string | null;
  tags?: Array<{ name?: string; slug?: string }>;
  lesson_count?: number;
  fiscal_year?: number | null;
  module_code?: string;
  points?: number;
  path_slug?: string;
};

export type LearnHubSummary = {
  counts: Record<string, number>;
  trending: LearnHubItem[];
};

export type LearnProfileResponse = {
  gamification: GamificationPayload | null;
  progress: ProgressRow[];
};

export type GamificationPayload = {
  points: number;
  level: number;
  streak_days: number;
  badges: BadgeData[];
  certificates: CertificateData[];
  recent_progress: ProgressRow[];
  total_progress: number;
};

export type ProgressRow = {
  content_type: string;
  content_id: string;
  completed_at: string;
  progress_percent: number;
};

export type BadgeData = {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  awarded_at?: string;
};

export type CertificateData = {
  id: string;
  civic_module_id?: string;
  civic_module_title?: string;
  civic_module_slug?: string;
  issued_at: string;
  certificate_url?: string;
};

export type ForumPost = {
  id: string;
  content: string;
  upvotes: number;
  author_name: string;
  author_initials: string;
  author_id: string | null;
  author_avatar: string | null;
  created_at: string;
};

export type ForumThread = {
  id: string;
  title: string;
  civic_module: string | null;
  civic_chapter: string | null;
  posts_count: number;
  author_name: string;
  author_initials: string;
  author_id: string | null;
  author_avatar: string | null;
  created_at: string;
};

export type ForumThreadDetail = ForumThread & {
  posts: ForumPost[];
};
