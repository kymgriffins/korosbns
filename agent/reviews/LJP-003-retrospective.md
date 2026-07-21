# Retrospective: learning-experience — LJP-003

```yaml
capability: learning-experience
spec_id: LJP-003
date: 2026-07-07
owners: [Historian, Librarian]
```

---

## What surprised us?

- Renaming from "Lesson Screen" to "Learning Experience" clarified the vertical-slice intent — composition validation, not UI assembly.
- Journey side effects (`journey-effects.ts`) were needed so UI never orchestrates `LessonCompleted` or `PartAdvanced` — only `ContinuePressed`.
- `readonly LearningEvent[]` in derive helpers caught a real tsc gap late.

---

## Specification gaps?

| Gap | Severity | Action |
|-----|----------|--------|
| Journey contracts not in capabilities registry initially | low | Added `journey-contracts/` |
| Experience metrics not instrumented in production | medium | Design targets in observability; add RUM later |
| module/course journey stubs only | low | Flesh out when LJP-004+ ship |

---

## Engineering gaps?

- Navigation after complete uses `useEffect` + `router.push` — acceptable observe pattern; e2e should verify.
- No browser perf measurement for time-to-first-learning yet.
- Legacy `lesson-experience.tsx` re-export still exists.

---

## Tests missing?

- E2E Playwright journey (validated promotion gate).
- `journey-effects.ts` unit tests in isolation (covered indirectly by canonical test).
- Experience replay snapshot test.

---

## Contract updates?

```yaml
proposed_bumps: none  # lock was ON during build
adr_required: [journey side effects owned by runtime dispatch]
```

---

## Anti-pattern additions?

- UI dispatching `LessonCompleted` or `PartAdvanced` after Continue — **forbidden**; runtime `deriveContinueSideEffects` owns this.

---

## Future optimizations?

- Experience Replay UI panel (debug / analytics).
- AI Tutor hooks on event stream without UI rewrite.
- Instrument experience metrics via timeline timestamps.

---

## Outcomes

```yaml
spec_amendments: LJP-003 renamed learning-experience; Law 1 in manifest
runtime_learnings: first vertical slice proves shell + runtime + contracts compose
promotion_impact: eligible for validated → three-commit strategy
sdp_3.0: journey contracts + canonical acceptance test established
```
