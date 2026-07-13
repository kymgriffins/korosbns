export type TeachingState = {
  muted: boolean;
  dismissedPages: string[];
};

export const ADMIN_TEACHING_STORAGE_KEY = "bns_admin_teaching_v1";
export const LEARN_TEACHING_STORAGE_KEY = "bns_learn_teaching_v1";

const DEFAULT_STATE: TeachingState = {
  muted: false,
  dismissedPages: [],
};

export function readTeachingState(storageKey: string): TeachingState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<TeachingState>;
    return {
      muted: Boolean(parsed.muted),
      dismissedPages: Array.isArray(parsed.dismissedPages)
        ? parsed.dismissedPages.filter((x): x is string => typeof x === "string")
        : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function writeTeachingState(storageKey: string, state: TeachingState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey, JSON.stringify(state));
}

/** @deprecated Use TeachingState */
export type AdminTeachingState = TeachingState;
