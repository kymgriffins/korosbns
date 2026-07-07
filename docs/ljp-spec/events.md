# Event Contracts
## Learning Journey Platform — Domain events

Every significant learner action **emits an event**. Analytics, achievements, and progress sync subscribe later — UI emits now.

Types: `src/data/lms/events.ts` (commit 2 scaffold)

---

## 1. Event envelope

```ts
type LjpEvent<T extends string, P> = {
  type: T;
  payload: P;
  occurredAt: string; // ISO
  learnerId?: string; // when auth available
  sessionId: string;  // browser session
};
```

Emit via `emitLearnEvent(event)` (future) — v1: `console.debug` in dev + sessionStorage log optional.

---

## 2. Catalog

### Discovery

| Event | Payload | When |
|-------|---------|------|
| `CourseViewed` | `{ courseSlug }` | Course detail mount |
| `CatalogueFiltered` | `{ query?, category?, difficulty? }` | Filter change |
| `SearchPerformed` | `{ query, resultCount }` | Search submit |

### Enrollment

| Event | Payload | When |
|-------|---------|------|
| `CourseEnrolled` | `{ courseSlug }` | Enroll CTA success |
| `CourseResumed` | `{ courseSlug, lessonSlug }` | Continue card tap |

### Video

| Event | Payload | When |
|-------|---------|------|
| `VideoPartStarted` | `{ courseSlug, moduleSlug, lessonSlug, partId }` | play |
| `VideoPartPaused` | `{ ...partId, positionSeconds }` | pause |
| `VideoPartCompleted` | `{ ...partId, durationSeconds }` | ended |

### Trivia

| Event | Payload | When |
|-------|---------|------|
| `TriviaOpened` | `{ triviaId, partId }` | sheet open |
| `TriviaAnswered` | `{ triviaId, correct: boolean }` | after check |
| `TriviaClosed` | `{ triviaId }` | sheet close after answer |

### Lesson flow

| Event | Payload | When |
|-------|---------|------|
| `ReflectionSaved` | `{ lessonSlug, length }` | save tap (v2) |
| `LessonCompleted` | `{ courseSlug, moduleSlug, lessonSlug }` | mark complete / continue exit |
| `LessonContinued` | `{ fromLessonSlug, toHref }` | Continue navigation |

### Progression

| Event | Payload | When |
|-------|---------|------|
| `ModuleCompleted` | `{ courseSlug, moduleSlug }` | last lesson in module |
| `ModuleUnlocked` | `{ courseSlug, moduleSlug }` | gate cleared |
| `CourseCompleted` | `{ courseSlug }` | all required lessons |
| `CertificateGenerated` | `{ courseSlug, credentialId }` | v2 |

### Engagement

| Event | Payload | When |
|-------|---------|------|
| `AchievementUnlocked` | `{ achievementId }` | rule fired |
| `BookmarkCreated` | `{ targetType, targetSlug }` | v2 |
| `BookmarkRemoved` | `{ targetType, targetSlug }` | v2 |

### Navigation

| Event | Payload | When |
|-------|---------|------|
| `HubNavigated` | `{ destination }` | bottom/top nav |
| `BreadcrumbNavigated` | `{ href }` | breadcrumb click |

---

## 3. Event → state machine map

| Event | Updates machine |
|-------|-----------------|
| `VideoPartCompleted` | Lesson: `part_ended` |
| `TriviaOpened` | Trivia: `open` |
| `TriviaAnswered` | Trivia: `feedback`; Lesson: `trivia_answered` |
| `LessonCompleted` | Module/Course enrollment machines |
| `ModuleCompleted` | Next module: `ModuleUnlocked` |

---

## 4. Event → achievement rules (v2)

| Event | Achievement candidate |
|-------|----------------------|
| `LessonCompleted` (first) | First Steps |
| `TriviaAnswered` (cumulative) | Trivia Master |
| `ModuleCompleted` | Module Champion |
| `CourseCompleted` | Course graduate |

---

## 5. Privacy

- No PII in reflection event payload — length only
- `learnerId` only when authenticated
- Events batchable for API sync (future)

---

## 6. Implementation phases

| Phase | Behavior |
|-------|----------|
| v1 | Type definitions + dev logger |
| v2 | `sessionStorage` queue + API ingest |
| v3 | Real-time analytics dashboard |

---

## 7. Forbidden

```
❌ Silent state changes without events (when instrumenting)
❌ PII in event payloads
❌ Events for every keystroke
❌ Blocking UI on event dispatch failure
```
