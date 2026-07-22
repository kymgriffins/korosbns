# Runtime Contract — Event Model
## Event sourcing — current state is derived

```yaml
contract:
  id: event-model
  version: 1.0.0
  status: approved
  type: runtime
```

---

## Envelope

```ts
type LearningEventEnvelope = {
  id: string;
  type: LearningEventType;
  occurredAt: string; // ISO
  sessionId: string;
  learnerId?: string;
  payload: Record<string, unknown>;
};
```

---

## Core learning events (LJP-002)

| Event | Payload | Creates state |
|-------|---------|---------------|
| `SessionStarted` | course, module, lesson, partId? | Session anchor |
| `VideoStarted` | partId, positionSeconds? | watching |
| `VideoPaused` | partId, positionSeconds | paused + bookmark |
| `VideoCompleted` | partId, durationSeconds | part progress |
| `TriviaOpened` | triviaId, partId | trivia_required |
| `TriviaAnswered` | triviaId, partId, correct | trivia progress |
| `ReflectionSaved` | lessonSlug, length | note |
| `ContinuePressed` | scope: part \| lesson \| next | transition intent |
| `LessonCompleted` | course, module, lesson | completion |

---

## Rules

1. Events are **append-only** — never mutate or delete in v1
2. State **never** set directly — only `dispatch(event)`
3. Illegal events ignored in production; warned in development
4. All events appear on **timeline**

---

## REQ mapping

| REQ | Event |
|-----|-------|
| REQ-0103 | VideoStarted / VideoPaused / VideoCompleted |
| REQ-0104 | TriviaOpened / TriviaAnswered |
| REQ-0105 | LessonCompleted |
