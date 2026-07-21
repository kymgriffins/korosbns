# Runtime Contract — Session
## Current learning context

```yaml
contract:
  id: session
  version: 1.0.0
  status: approved
  type: runtime
```

---

## Session shape

```ts
type LearningSession = {
  sessionId: string;
  courseSlug: string | null;
  moduleSlug: string | null;
  lessonSlug: string | null;
  partId: string | null;
  startedAt: string | null;
};
```

---

## Lifecycle

```
null session
  │ SessionStarted
  ▼
active session (course + module + lesson + optional part)
  │ LessonCompleted | SessionEnded
  ▼
session cleared or new SessionStarted
```

---

## Derived from

Latest `SessionStarted` event, updated by video/trivia events on `partId`.

---

## REQ-0106

Session fields owned by runtime only — components read via `useLearningRuntime()`.
