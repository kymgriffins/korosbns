# Journey Contract — Lesson Journey
## CAP-learning-experience · LJP-003

```yaml
contract:
  id: lesson-journey
  version: 1.0.0
  status: approved
  type: journey
```

---

## Journey map

```
Lesson Opened (LessonOpened)
        │
Video Part N (VideoStarted → VideoCompleted)
        │
Checkpoint (hasTrivia?)
        ├─ yes → TriviaOpened → TriviaAnswered
        └─ no  → part complete
        │
Continue (ContinuePressed scope: part) — if more parts
        │
… repeat parts …
        │
Reflection (ReflectionSaved)
        │
Continue (ContinuePressed scope: lesson)
        │
Lesson Completed (LessonCompleted)
        │
Next Lesson (navigation unlock)
```

---

## Required events

| Step | Event | REQ |
|------|-------|-----|
| Entry | `LessonOpened` | REQ-0200 |
| Watch | `VideoStarted`, `VideoCompleted` | REQ-0103 |
| Trivia | `TriviaOpened`, `TriviaAnswered` | REQ-0088, REQ-0104 |
| Reflection | `ReflectionSaved` | REQ-0201 |
| Exit | `LessonCompleted` | REQ-0105 |
| Forward | `ContinuePressed` | REQ-0021 |

---

## Blocking events

- `TriviaOpened` without prior `VideoCompleted` for part — invalid
- `LessonCompleted` without `ReflectionSaved` when reflection required — invalid
- Dismiss trivia without answer — **forbidden** (REQ-0088)

---

## Exit criteria

- `LessonCompleted` in event log
- Progress contains lesson key
- Timeline contains full journey chain
- Navigation unlocks next lesson

---

## Failure recovery

- Refresh → `hydrate()` → resume from last event-derived state
- Experience Replay reconstructs journey from timeline

---

## Experience metrics

| Metric | Goal |
|--------|------|
| Time to first learning | Lesson opened → VideoStarted < 2s |
| Time to continue | TriviaAnswered → Continue visible immediate |
| Decision count per viewport | ≤ 2 (Play + Continue max) |
