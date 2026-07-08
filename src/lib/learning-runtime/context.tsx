/**
 * @sdp-provenance capability: CAP-learning-runtime
 */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LmsCourse } from "@/data/lms/types";
import {
  getLearningRuntime,
  type DispatchInput,
  type LearningRuntime,
} from "./runtime";
import type { LearningEventType, LearningRuntimeState, TimelineEntry } from "./types";
import { resolveNavigation, type NavigationState } from "./navigation";

type LearningRuntimeContextValue = {
  runtime: LearningRuntime;
  state: LearningRuntimeState;
  timeline: TimelineEntry[];
  dispatch: <T extends LearningEventType>(input: DispatchInput<T>) => void;
  getNavigation: (course: LmsCourse) => NavigationState | null;
};

const LearningRuntimeContext = createContext<LearningRuntimeContextValue | null>(null);

export function LearningRuntimeProvider({
  children,
  sessionId = "local",
  autoHydrate = true,
}: {
  children: ReactNode;
  sessionId?: string;
  autoHydrate?: boolean;
}) {
  const runtime = useMemo(() => getLearningRuntime(sessionId), [sessionId]);
  const [state, setState] = useState<LearningRuntimeState>(() => runtime.getState());
  const [timeline, setTimeline] = useState<TimelineEntry[]>(() => runtime.getTimeline());

  const sync = useCallback(() => {
    setState(runtime.getState());
    setTimeline(runtime.getTimeline());
  }, [runtime]);

  useLayoutEffect(() => {
    if (autoHydrate) {
      runtime.hydrate();
    }
    const unsubscribe = runtime.subscribe(sync);
    sync();
    return unsubscribe;
  }, [runtime, autoHydrate, sync]);

  const dispatch = useCallback(
    <T extends LearningEventType>(input: DispatchInput<T>) => {
      runtime.dispatch(input);
    },
    [runtime],
  );

  const getNavigation = useCallback(
    (course: LmsCourse) => {
      const { session, progress } = runtime.getState();
      if (!session.courseSlug || !session.moduleSlug || !session.lessonSlug) {
        return null;
      }
      return resolveNavigation(
        course,
        {
          courseSlug: session.courseSlug,
          moduleSlug: session.moduleSlug,
          lessonSlug: session.lessonSlug,
        },
        progress,
      );
    },
    [runtime],
  );

  const value = useMemo(
    () => ({ runtime, state, timeline, dispatch, getNavigation }),
    [runtime, state, timeline, dispatch, getNavigation],
  );

  return (
    <LearningRuntimeContext.Provider value={value}>{children}</LearningRuntimeContext.Provider>
  );
}

export function useLearningRuntime(): LearningRuntimeContextValue {
  const ctx = useContext(LearningRuntimeContext);
  if (!ctx) {
    throw new Error("useLearningRuntime must be used within LearningRuntimeProvider");
  }
  return ctx;
}
