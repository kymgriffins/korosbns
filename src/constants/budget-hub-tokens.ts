/**
 * Budget Hub presentation tokens.
 * Presentation layer only — does not modify platform constitution.
 */

export const budgetHubTokens = {
  layer: "L1",
  spec: "budget-hub-editorial-v1",
  contentMax: "70rem",
  proseMax: "42rem",
  sectionY: "clamp(3rem, 6vw, 5rem)",
  navHeight: "3.5rem",
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
  },
} as const;

/**
 * Layer 1 reference token for the "Aca." page specification.
 * Maps the provided visual system into a typed token contract.
 */
export const budgetHubLayer1AcaTokens = {
  id: "L1-ACA-COURSE-PAGE",
  sourceSpec: "DESIGN_SPEC.md",
  colors: {
    background: "bg-white",
    foreground: "text-zinc-950",
    muted: "text-zinc-500",
    mutedForeground: "text-zinc-400",
    border: "border-zinc-200",
    secondaryBg: "bg-zinc-100",
    primaryAction: "bg-zinc-900 hover:bg-zinc-800",
    accent: "text-amber-400",
  },
  typography: {
    fontFamily: "font-sans",
    heading: "font-semibold tracking-tight text-zinc-950",
    body: "font-normal leading-relaxed text-zinc-600",
    caption: "text-xs font-medium text-zinc-500 uppercase",
  },
  layout: {
    container: "max-w-7xl",
    sectionPadding: "px-4 md:px-8 lg:px-12",
    gridDesktop: "lg:grid-cols-12",
    contentSpan: "lg:col-span-7",
    sidebarSpan: "lg:col-span-5",
  },
  radius: {
    card: "rounded-xl",
    image: "rounded-2xl",
    button: "rounded-md",
    pill: "rounded-full",
  },
  motion: {
    fadeUpY: 20,
    fadeUpDurationMs: 500,
    staggerStepMs: 100,
    buttonHoverScale: 1.02,
    buttonTapScale: 0.98,
  },
} as const;

export const BUDGET_HUB_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "budget", label: "Budget" },
  { id: "finance-bill", label: "Finance Bill" },
  { id: "counties", label: "Counties" },
  { id: "participation", label: "Participation" },
] as const;

export type BudgetHubCategoryId = (typeof BUDGET_HUB_CATEGORIES)[number]["id"];
