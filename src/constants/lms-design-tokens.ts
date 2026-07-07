/**
 * LMS design tokens — 8pt grid, motion, layout.
 * Required by docs/ai-design-constitution.md
 * Import these instead of magic numbers in LMS components.
 */

export const LMS_SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  "2xl": 64,
} as const;

export const LMS_LAYOUT = {
  maxWidth: 1280,
  maxWidthClass: "max-w-[1280px]",
  lessonMaxWidth: 1100,
  lessonMaxWidthClass: "max-w-[1100px]",
  proseMaxWidth: "max-w-prose",
} as const;

export const LMS_RADIUS = {
  card: "rounded-2xl", // 16px
  cardLg: "rounded-3xl", // 24px — hero only
  button: "rounded-xl",
} as const;

export const LMS_MOTION = {
  durationMs: 200,
  durationClass: "duration-200",
  hoverScale: "hover:scale-[1.02]",
  activeScale: "active:scale-[0.98]",
  spring: { type: "spring" as const, damping: 28, stiffness: 320 },
} as const;

export const LMS_COLORS = {
  cta: "bg-foreground text-background hover:bg-foreground/95",
  ctaOutline: "border-foreground/20 text-foreground hover:bg-foreground/5",
  border: "border-border/60",
  card: "bg-card",
  page: "bg-[#FAFAFA] dark:bg-background",
} as const;

export const LMS_TOUCH = {
  minTarget: "min-h-11 min-w-11", // 44px
} as const;
