/**
 * Learn design tokens — 8pt grid, motion, layout.
 * Aligned to Reference Experience RX-001 (ADR-015).
 * Pixel Discipline: every Learn UI value must come from here or a SIC.
 * @see docs/lms-spec/sic-cap-004-course-detail.md
 * Do not invent spacing/radius/type/motion outside these scales.
 */

export const LMS_SPACING = {
  "2xs": 4,
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  "2xl": 64,
  "3xl": 80,
} as const;

/** Prefer these raw px values when computing padding — never invent between. */
export const LMS_SPACING_SCALE = [4, 8, 16, 24, 32, 48, 64, 80] as const;

export const LMS_LAYOUT = {
  maxWidth: 1280,
  maxWidthClass: "max-w-[1280px]",
  contentPaddingDesktop: 48,
  contentPaddingTablet: 32,
  contentPaddingMobile: 20,
  lessonMaxWidth: 1100,
  lessonMaxWidthClass: "max-w-[1100px]",
  proseMaxWidth: "max-w-prose",
  proseCh: 65,
  /** Blueprint B course hero split */
  courseHeroMediaRatio: 0.6,
  courseHeroInfoRatio: 0.4,
  /** SIC-CAP-004 — desktop hero media column */
  heroDesktopMinHeight: 280,
  heroDesktopMinHeightClass: "lg:min-h-[280px]",
  heroMobileAspect: "16 / 10",
  heroMobileAspectClass: "aspect-[16/10]",
} as const;

/** Breakpoints — CSS must match; do not invent midpoints (SIC-CAP-004 §3). */
export const LMS_BREAKPOINTS = {
  md: 768,
  lg: 1024,
} as const;

export const LMS_RADIUS = {
  inputPx: 14,
  buttonPx: 16,
  cardPx: 24,
  dialogPx: 28,
  /** Tailwind class mirrors */
  input: "rounded-[14px]",
  button: "rounded-xl",
  card: "rounded-2xl",
  cardLg: "rounded-3xl",
  dialog: "rounded-[28px]",
} as const;

export const LMS_MOTION = {
  hoverMs: 120,
  openMs: 200,
  pageMs: 250,
  accordionMs: 220,
  triviaSheetMs: 300,
  stickyCtaMs: 250,
  durationMs: 200,
  durationClass: "duration-200",
  hoverScale: "hover:scale-[1.02]",
  activeScale: "active:scale-[0.98]",
  /** Prefer tween for UI; soft spring only for sheets */
  spring: { type: "spring" as const, damping: 28, stiffness: 320 },
} as const;

/** Exact px scale — Pixel Discipline; map to Tailwind via LMS_TYPE classes. */
export const LMS_TYPE_SCALE = {
  display: 48,
  h1: 40,
  h2: 32,
  h3: 24,
  body: 16,
  caption: 14,
  meta: 12,
} as const;

/**
 * Prefer semantic Tailwind tokens in components.
 * These hex notes document RX-001 intent for auditors — use theme vars where possible.
 */
export const LMS_COLORS = {
  cta: "bg-foreground text-background hover:bg-foreground/95",
  ctaOutline: "border-foreground/20 text-foreground hover:bg-foreground/5",
  border: "border-border/60",
  card: "bg-card",
  page: "bg-[#FAFAFA] dark:bg-background",
  /** RX-001 reference hex (light) — do not scatter new accents in chrome */
  reference: {
    background: "#FAFAFA",
    surface: "#FFFFFF",
    primaryText: "#111111",
    secondary: "#6B7280",
    border: "#E5E7EB",
    success: "#16A34A",
    warning: "#D97706",
  },
  dark: {
    canvas: "#0B0B0C",
    nav: "#101012",
    surface: "#171719",
    elevated: "#202024",
    hover: "#252525",
    borderSubtle: "rgba(255,255,255,0.06)",
  },
} as const;

export const LMS_TOUCH = {
  minTarget: "min-h-11 min-w-11", // 44px
} as const;

export const LMS_TYPE = {
  /** Bound to LMS_TYPE_SCALE — Course Detail reference (SIC-CAP-004) */
  display: "text-5xl", // 48
  h1: "text-4xl", // 40
  h2: "text-3xl", // 32
  h3: "text-2xl", // 24
  body: "text-base", // 16
  caption: "text-sm", // 14
  meta: "text-xs", // 12
  /** Journey hero title: H2 mobile → H1 desktop */
  journeyTitle: "text-3xl lg:text-4xl",
  /** @deprecated prefer display/h1/journeyTitle */
  hero: "text-3xl lg:text-4xl",
  title: "text-3xl lg:text-4xl",
  section: "text-2xl",
} as const;
