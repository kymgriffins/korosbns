/**
 * @sdp-provenance
 * intent: INTENT-002
 * capability: CAP-learning-runtime
 * contracts: learning-runtime@1.0.0, event-model@1.0.0
 */
import type {
  LearningEvent,
  LearningEventPayloads,
  LearningEventType,
  LearningRuntimeState,
  TimelineEntry,
} from "./types";
import { reduceEvents } from "./reducer";
import { loadPersistedEvents, persistEvents } from "./persistence";
import { eventsToTimeline } from "./timeline";
import { deriveContinueSideEffects } from "./journey-effects";

let eventIdCounter = 0;

function nextEventId(): string {
  eventIdCounter += 1;
  return `evt-${Date.now()}-${eventIdCounter}`;
}

export type DispatchInput<T extends LearningEventType> = {
  type: T;
  payload: LearningEventPayloads[T];
  sessionId?: string;
  learnerId?: string;
  occurredAt?: string;
};

export class LearningRuntime {
  private events: LearningEvent[] = [];
  private listeners = new Set<() => void>();
  private sessionId: string;

  constructor(sessionId = "local") {
    this.sessionId = sessionId;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  dispatch<T extends LearningEventType>(input: DispatchInput<T>): Extract<LearningEvent, { type: T }> {
    const eventsBefore = this.events;

    const event = {
      id: nextEventId(),
      type: input.type,
      occurredAt: input.occurredAt ?? new Date().toISOString(),
      sessionId: input.sessionId ?? this.sessionId,
      learnerId: input.learnerId,
      payload: input.payload,
    } as Extract<LearningEvent, { type: T }>;

    this.events = [...this.events, event];

    if (event.type === "ContinuePressed") {
      const sideEffects = deriveContinueSideEffects(
        eventsBefore,
        event as Extract<LearningEvent, { type: "ContinuePressed" }>,
      );
      for (const side of sideEffects) {
        this.events = [
          ...this.events,
          {
            id: nextEventId(),
            type: side.type,
            occurredAt: new Date().toISOString(),
            sessionId: side.sessionId ?? this.sessionId,
            learnerId: side.learnerId,
            payload: side.payload,
          } as LearningEvent,
        ];
      }
    }

    persistEvents(this.events);
    this.notify();
    return event;
  }

  replay(events: LearningEvent[]): void {
    this.events = [...events].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
    persistEvents(this.events);
    this.notify();
  }

  hydrate(): boolean {
    const loaded = loadPersistedEvents();
    if (!loaded) return false;
    this.events = loaded;
    this.notify();
    return true;
  }

  getEvents(): readonly LearningEvent[] {
    return this.events;
  }

  getState(): LearningRuntimeState {
    return reduceEvents(this.events);
  }

  getTimeline(): TimelineEntry[] {
    return eventsToTimeline(this.events);
  }

  clear(): void {
    this.events = [];
    persistEvents(this.events);
    this.notify();
  }
}

/** Singleton for client session — Provider may replace per learner later */
let defaultRuntime: LearningRuntime | null = null;

export function getLearningRuntime(sessionId = "local"): LearningRuntime {
  if (!defaultRuntime) {
    defaultRuntime = new LearningRuntime(sessionId);
  }
  return defaultRuntime;
}

export function resetLearningRuntimeForTests(): void {
  defaultRuntime = null;
  eventIdCounter = 0;
}
