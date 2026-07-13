"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ADMIN_TEACHING_STORAGE_KEY,
  LEARN_TEACHING_STORAGE_KEY,
  readTeachingState,
  writeTeachingState,
  type TeachingState,
} from "./teaching-storage";

type TeachingContextValue = {
  ready: boolean;
  muted: boolean;
  setMuted: (muted: boolean) => void;
  isPageDismissed: (pageId: string) => boolean;
  dismissPage: (pageId: string) => void;
  restorePage: (pageId: string) => void;
  resetDismissals: () => void;
};

const TeachingContext = createContext<TeachingContextValue | null>(null);

export function TeachingProvider({
  storageKey,
  children,
}: {
  storageKey: string;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<TeachingState>({ muted: false, dismissedPages: [] });

  useEffect(() => {
    setState(readTeachingState(storageKey));
    setReady(true);
  }, [storageKey]);

  const commit = useCallback(
    (next: TeachingState) => {
      setState(next);
      writeTeachingState(storageKey, next);
    },
    [storageKey],
  );

  const setMuted = useCallback(
    (muted: boolean) => {
      commit({ ...state, muted });
    },
    [commit, state],
  );

  const isPageDismissed = useCallback(
    (pageId: string) => state.dismissedPages.includes(pageId),
    [state.dismissedPages],
  );

  const dismissPage = useCallback(
    (pageId: string) => {
      if (state.dismissedPages.includes(pageId)) return;
      commit({ ...state, dismissedPages: [...state.dismissedPages, pageId] });
    },
    [commit, state],
  );

  const restorePage = useCallback(
    (pageId: string) => {
      commit({
        ...state,
        dismissedPages: state.dismissedPages.filter((id) => id !== pageId),
      });
    },
    [commit, state],
  );

  const resetDismissals = useCallback(() => {
    commit({ ...state, dismissedPages: [] });
  }, [commit, state]);

  const value = useMemo(
    () => ({
      ready,
      muted: state.muted,
      setMuted,
      isPageDismissed,
      dismissPage,
      restorePage,
      resetDismissals,
    }),
    [ready, state.muted, setMuted, isPageDismissed, dismissPage, restorePage, resetDismissals],
  );

  return <TeachingContext.Provider value={value}>{children}</TeachingContext.Provider>;
}

export function AdminTeachingProvider({ children }: { children: ReactNode }) {
  return <TeachingProvider storageKey={ADMIN_TEACHING_STORAGE_KEY}>{children}</TeachingProvider>;
}

export function LearnTeachingProvider({ children }: { children: ReactNode }) {
  return <TeachingProvider storageKey={LEARN_TEACHING_STORAGE_KEY}>{children}</TeachingProvider>;
}

export function useTeaching() {
  const ctx = useContext(TeachingContext);
  if (!ctx) {
    throw new Error("useTeaching must be used within TeachingProvider");
  }
  return ctx;
}

/** @deprecated Prefer useTeaching */
export const useAdminTeaching = useTeaching;

export function useTeachingOptional() {
  return useContext(TeachingContext);
}

/** @deprecated Prefer useTeachingOptional */
export const useAdminTeachingOptional = useTeachingOptional;
