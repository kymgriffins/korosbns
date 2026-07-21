# Runtime Contract — Timeline
## Every learner action has history

```yaml
contract:
  id: timeline
  version: 1.0.0
  status: approved
  type: runtime
```

---

## Timeline entry

```ts
type TimelineEntry = {
  id: string;
  occurredAt: string;
  label: string;       // human-readable
  eventType: LearningEventType;
  payload: Record<string, unknown>;
};
```

---

## Example

```
09:02  Video Started      (part-1)
09:08  Video Paused       (part-1 @ 4:32)
09:12  Trivia Correct     (trivia-1)
09:14  Reflection Saved
09:15  Lesson Completed
```

---

## API

```ts
runtime.getTimeline(): TimelineEntry[]
runtime.getEvents(): LearningEvent[]
```

---

## Guarantees

- 1:1 mapping event → timeline entry (plus display label)
- Sorted by `occurredAt` ascending
- Immutable history in v1

---

## REQ-0102

Timeline observable for analytics, debugging, AI recommendations (future).
