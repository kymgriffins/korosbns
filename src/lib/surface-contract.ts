/**
 * Surface contracts — what/why locked; how variants swappable for tests.
 * Spec: agent/spec/surface-contracts/
 */

export type SurfaceEmotion =
  | "Discovery"
  | "Focus"
  | "Mastery"
  | "Utility"
  | "Reassurance";

export type SurfaceFormat =
  | "tile-row"
  | "board"
  | "story-scroll"
  | "short-slide"
  | "checklist"
  | "table-reveal"
  | "long-article"
  | "podcast-chapter"
  | "quiz-beat"
  | "hero-cta";

export type SurfaceDataSource =
  | "next_seed"
  | "next_isr"
  | "django"
  | "local_progress"
  | "local_events"
  | "derived";

export type SurfaceDataField = {
  key: string;
  source: SurfaceDataSource;
  required: boolean;
  fallback?: string | null;
  note?: string;
};

export type SurfaceVariant = {
  id: string;
  format: SurfaceFormat;
  description: string;
  motion?: string;
};

/** Locked product intent for one viewport region. */
export type SurfaceContract = {
  id: string;
  job: string;
  why: string;
  emotion: SurfaceEmotion;
  cognitive_load: "browse" | "lesson" | "assess" | "account";
  success: { event: string; description: string };
  data: SurfaceDataField[];
  how: { default: string; variants: SurfaceVariant[] };
  anti?: string[];
};

/** Runtime: pick a how-variant without changing data binding. */
export type SurfaceRenderProps<TData> = {
  surfaceId: string;
  variantId: string;
  data: TData;
  onSuccess: (event: string, payload?: Record<string, unknown>) => void;
};
