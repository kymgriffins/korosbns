import type { CivicModule } from "@/types/learn";

function isNumericBadge(value?: string | null): boolean {
  return /^\d+$/.test((value ?? "").trim());
}

export function getModuleEyebrow(module: Pick<CivicModule, "badge" | "badgeName" | "documentName" | "title">): string | null {
  if (module.badge && !isNumericBadge(module.badge)) {
    return module.badge;
  }

  const fallback = module.badgeName || module.documentName || module.title;
  return fallback && fallback !== module.title ? fallback : null;
}

export function getModuleOrderLabel(module: Pick<CivicModule, "order">): string {
  return String(module.order);
}
