# Runtime Contract — Progress
## Derived from events — never mutated by UI

```yaml
contract:
  id: progress
  version: 1.0.0
  status: approved
  type: runtime
```

---

## Progress shape

```ts
type LearningProgress = {
  completedLessons: string[];      // lesson keys: course/module/lesson
  completedModules: string[];
  watchPositions: Record<string, number>; // partId → seconds
  triviaPassed: string[];          // triviaId
  bookmarks: Array<{ partId: string; positionSeconds: number; at: string }>;
  notes: Array<{ lessonSlug: string; length: number; at: string }>;
};
```

---

## Derivation rules

| Event | Progress update |
|-------|-----------------|
| VideoPaused | bookmark + watchPositions |
| VideoCompleted | watchPositions at duration |
| TriviaAnswered (correct) | triviaPassed |
| ReflectionSaved | notes |
| LessonCompleted | completedLessons |

Module completion: derived when all lessons in module ⊆ completedLessons (requires catalog in selector).

---

## Anti-pattern

```ts
// FORBIDDEN
progress.completedLessons.push(slug);
```

```ts
// REQUIRED
runtime.dispatch({ type: 'LessonCompleted', payload: { ... } });
```

---

## REQ-0100

Progress store owned by Learning Runtime.
