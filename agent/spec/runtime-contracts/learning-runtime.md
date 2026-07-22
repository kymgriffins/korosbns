# Runtime Contract — Learning Runtime
## CAP-learning-runtime · LJP-002

```yaml
contract:
  id: learning-runtime
  version: 1.0.0
  status: approved
  type: runtime
```

---

## Purpose

**Single source of truth** for all learning behavior. No UI. Sits between Learning Shell and feature components.

```
LearningShell
      │
      ▼
Learning Runtime  ← this contract
      │
 ┌────┼────┐
Session Progress Timeline
      │
      ▼
Lesson · Video · Trivia (UI only dispatches events)
```

---

## Responsibilities

| Domain | Owns |
|--------|------|
| Session | Current course, module, lesson, video part |
| Progress | Completed lessons/modules, watch position, bookmarks, notes |
| Timeline | Ordered learner event history |
| Navigation | Next/previous lesson, locked/unlocked |
| Events | Append-only learning event log |
| Persistence | Replay after refresh |

---

## Guarantees

1. **Single source of truth** — components never mutate progress directly
2. **No UI** — runtime has zero render output
3. **Deterministic** — same events → same state
4. **Replayable** — state rebuilds from event log
5. **Observable** — every event inspectable
6. **Recoverable** — hydrate from sessionStorage on load

---

## Does not

- Render components
- Fetch catalog (reads catalog via injected context)
- Own routing (emits navigation intents; router consumes)

---

## Implementation path

- `src/lib/learning-runtime/`
- Provider: `LearningRuntimeProvider` in `context.tsx`
- Re-exports: `src/data/lms/events.ts` delegates dispatch to runtime

---

## Traceability

| REQ | Satisfies |
|-----|-----------|
| REQ-0100 | Single source of truth for progress |
| REQ-0101 | Event-sourced state |
| REQ-0102 | Timeline observable |

---

## Definition of Done (runtime)

- [ ] Deterministic — property test same events → same state
- [ ] Replayable — `replay(events)` rebuilds state
- [ ] Observable — `getTimeline()`, `getEvents()`
- [ ] Recoverable — `hydrate()` after simulated refresh
