/**
 * Budget Hub presentation tokens.
 * Presentation layer only — does not modify platform constitution.
 */

export const budgetHubTokens = {
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

export const BUDGET_HUB_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "budget", label: "Budget" },
  { id: "finance-bill", label: "Finance Bill" },
  { id: "counties", label: "Counties" },
  { id: "participation", label: "Participation" },
] as const;

export type BudgetHubCategoryId = (typeof BUDGET_HUB_CATEGORIES)[number]["id"];
