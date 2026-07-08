/**
 * @sdp-provenance capability: CAP-learning-runtime
 * contracts: learning-runtime@1.0.0
 */
import type { LearningEvent } from "./types";

const STORAGE_KEY = "ljp-learning-runtime-events";

export function loadPersistedEvents(): LearningEvent[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LearningEvent[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function persistEvents(events: LearningEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // quota or private mode — non-fatal
  }
}

export function clearPersistedEvents(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
