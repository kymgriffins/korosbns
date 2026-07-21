# Validation Gate V1 — LJP-003 Learning Experience

```yaml
spec_id: LJP-003
capability: learning-experience
date: 2026-07-07
verdict: CONDITIONAL_PASS
runtime_stage: draft
pending: gate_1_human_walkthrough
```

---

## Gate 1 — Experience Validation (Human)

**Status: PENDING — requires your walkthrough**

Automated browser validation identified a **hydration mismatch** (`DebugLogPanel` in global providers) that caused intermittent blank lesson renders in dev. Fixes applied:

- `LearningRuntimeProvider` — `useLayoutEffect` subscribe before child dispatch
- `LearningExperience` — bootstrap view (no `return null` on first paint)
- `DebugLogPanel` — client-only via `dynamic(..., { ssr: false })`

**You should verify once without devtools:**

| Check | Automated | Human required |
|-------|-----------|----------------|
| Full journey (video → trivia → reflection → complete) | Blocked by hydration (fixed) | Yes |
| No duplicate Continue | — | Yes |
| No bottom nav in immersive lesson | Pass (not rendered) | Yes |
| Single primary CTA per phase | **Fail** — `LessonHero` has extra "Resume" button | Yes |
| No layout shift / flicker | — | Yes |

**Gate 1 passes only when human walkthrough confirms all items.**

---

## Gate 2 — Runtime Validation

**Status: PASS**

Canonical test `lesson-journey.test.ts` verifies event chain:

```
LessonOpened → VideoStarted → VideoCompleted → TriviaOpened → TriviaAnswered
→ ContinuePressed → PartAdvanced → VideoStarted → VideoCompleted
→ ReflectionSaved → ContinuePressed → LessonCompleted
```

- `journey-effects.ts` owns `PartAdvanced` and `LessonCompleted` after `ContinuePressed`
- No UI component dispatches `LessonCompleted` directly
- `formatExperienceReplay()` available for timeline reconstruction

---

## Gate 3 — Traceability Validation

**Status: PASS**

| Behavior | REQ | Contract | Test | Evidence |
|----------|-----|----------|------|----------|
| Lesson entry | REQ-0200 | lesson-journey@1.0.0 | lesson-journey.test.ts | `learning-experience.tsx` |
| Trivia blocking | REQ-0088 | trivia_popup@1.0.0 | lesson-journey.test.ts | `trivia-sheet.tsx` |
| Continue CTA | REQ-0021 | continue_button@1.0.0 | lesson-journey.test.ts | `continue-button.tsx` |
| Lesson complete | REQ-0105 | progress@1.0.0 | lesson-journey.test.ts | `journey-effects.ts` |
| Video events | REQ-0103 | video_player@1.0.0 | runtime.test.ts | `video-player.tsx` |
| Reflection | REQ-0201 | lesson-screen@1.0.0 | lesson-journey.test.ts | `reflection-panel.tsx` |

---

## Gate 4 — Architecture Validation

**Status: PASS**

- No component mutates progress directly
- Runtime is sole journey owner (`deriveContinueSideEffects`)
- UI observes `deriveLessonExperience()` / `displayView`
- Shell composition unchanged (immersive mode hides bottom nav)
- Runtime contracts unchanged

---

## Gate 5 — Design Validation

**Status: CONDITIONAL**

| Question | Result |
|----------|--------|
| Hierarchy obvious? | Yes — lesson hero + video stack |
| Immersive? | Yes — no bottom nav, focused layout |
| Product identity? | Yes — black video frame, learn-scoped tokens |
| Remove anything? | **Yes** — `LessonHero` "Resume" button violates ≤2 decision budget |

Recommend removing or hiding `Resume` on in-lesson view before promotion.

---

## Gate 6 — Performance Validation

**Status: PASS** (with hydration fix)

| Check | Result |
|-------|--------|
| TypeScript | Clean (production build) |
| `pnpm build` | Pass |
| Runtime tests (5/5) | Pass |
| Session hydrate | `runtime.test.ts` recoverable test |
| Event replay | `runtime.test.ts` replayable test |
| Hydration warnings | Fixed `DebugLogPanel`; `next-themes` script tag warning may persist (pre-existing) |

---

## Promotion decision

```
Draft ──(Gate 1 human PASS)──► Validated ──► Three commits
```

**Runtime remains `draft` until you confirm Gate 1.**

When ready, commits (conceptual order):

1. `feat(runtime): establish Learning Runtime and event model`
2. `feat(shell): establish Learning Shell architecture`
3. `feat(experience): implement first Learning Experience`

Tag: **SDP v3.0 — First Proven Vertical Slice**
