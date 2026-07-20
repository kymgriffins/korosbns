import type { CivicModule } from "@/types/learn";

function isNumericBadge(value?: string | null): boolean {
  return /^\d+$/.test((value ?? "").trim());
}

/**
 * Citizen UI displays:
 * - "badge" as a small icon/emoji (numeric backend ids must not leak)
 * - eyebrow as a human label (usually from badgeName/documentName)
 */
export function getModuleEyebrow(
  module: Pick<CivicModule, "badgeName" | "documentName" | "title">,
): string | null {
  const fallback = module.badgeName || module.documentName || module.title;
  return fallback && fallback !== module.title ? fallback : null;
}

export function getModuleOrderLabel(module: Pick<CivicModule, "order">): string {
  return String(module.order);
}

export function getModuleEmoji(badge?: string | null): string {
  // Backend sometimes returns numeric "badge" ids — do not render them literally.
  if (!badge || isNumericBadge(badge)) return "📘";
  // If a long string slips in (e.g. "Infrastructure"), still degrade gracefully.
  const trimmed = badge.trim();
  return trimmed.length > 4 ? "📘" : trimmed;
}
