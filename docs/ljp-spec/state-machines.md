# State Machines
## Learning Journey Platform — Behavioral contracts

Allowed transitions only. **No impossible states** in implementation.

Implement lesson/video machines in `LessonExperience`. Persist per `state-management.md`.

---

## 1. Course (enrollment lifecycle)

```
not_enrolled
    │ enroll
    ▼
enrolled
    │ start_first_lesson
    ▼
started
    │ complete_any_lesson
    ▼
in_progress ──────────────────┐
    │                         │ resume
    │ complete_all_required   │
    ▼                         │
completed ◄───────────────────┘
    │ issue_certificate (v2)
    ▼
certified
```

| From | Event | To |
|------|-------|-----|
| not_enrolled | `CourseEnrolled` | enrolled |
| enrolled | `LessonStarted` (first) | started |
| started | `LessonCompleted` | in_progress |
| in_progress | `LessonCompleted` (partial) | in_progress |
| in_progress | `CourseCompleted` | completed |
| completed | `CertificateGenerated` | certified |

**Invariant:** Cannot reach `completed` unless all required lessons complete (DM-10).

---

## 2. Module

```
locked
    │ previous_module_completed
    ▼
available
    │ lesson_started_in_module
    ▼
in_progress
    │ all_lessons_completed
    ▼
completed
```

| From | Event | To |
|------|-------|-----|
| locked | `ModuleUnlocked` | available |
| available | `LessonStarted` | in_progress |
| in_progress | `LessonCompleted` (not all) | in_progress |
| in_progress | `ModuleCompleted` | completed |

**UI:** `locked` → accordion disabled. Status badge read-only.

---

## 3. Lesson (session machine)

Primary implementation contract for `LessonExperience`.

```
loading
    │ data_ready
    ▼
ready
    │ play / autoplay_metadata
    ▼
watching
    │ pause
    ├──────────────────┐
    ▼                  │
paused ──play──────────┘
    │
    │ video_ended
    ▼
part_ended
    │ has_trivia?
    ├─ yes ─► trivia_required
    │              │ answered
    │              ▼
    │         trivia_answered
    │              │
    └─ no ─────────┤
                   ▼
            part_complete
                   │ more_parts?
                   ├─ yes ─► ready (next part)
                   │
                   └─ no ─► reflection
                              │ saved / skipped (v1)
                              ▼
                         lesson_complete
                              │ continue_click
                              ▼
                         navigating_away
```

| State | Continue visible? | Trivia? |
|-------|-------------------|---------|
| loading | No | No |
| watching | No | No |
| trivia_required | No | Open sheet |
| trivia_answered | No | Closing |
| part_complete | Yes (next part) | No |
| reflection | Yes (finish lesson) | No |
| lesson_complete | Yes (next lesson) | No |

**Forbidden transitions:**

```
❌ trivia_required → watching (without answer)
❌ loading → lesson_complete
❌ watching → lesson_complete (skip parts)
```

---

## 4. Video (player sub-machine)

Owned by `VideoPlayer` / `VideoExperience`.

```
idle
    │ loadstart
    ▼
buffering
    │ canplay
    ▼
ready
    │ play
    ▼
playing
    │ pause ──► paused ──play──► playing
    │ ended
    ▼
ended
    │ emit onPartEnd
    ▼
(idle on next part swap)
```

| State | UI |
|-------|-----|
| buffering | Spinner overlay optional |
| playing | Native controls |
| ended | Parent handles trivia |

**Error transition:** any → `error` → `idle` on retry

---

## 5. Trivia (overlay machine)

```
closed
    │ VideoPartEnded + hasTrivia
    ▼
open
    │ option_selected / fill_submitted
    ▼
answering
    │ check_answer
    ▼
feedback
    │ continue_in_sheet
    ▼
closed
```

| From | Event | To |
|------|-------|-----|
| open | backdrop_click | **blocked** |
| open | escape | **blocked** |
| feedback | continue | closed |

Emit `TriviaAnswered` on transition to `feedback`.

---

## 6. Module accordion (UI machine)

```
collapsed
    │ expand (if not locked)
    ▼
expanded
    │ collapse | other_module_expanded
    ▼
collapsed
```

**Group rule:** `expanded` on module A forces `collapsed` on B, C, … (Law 5).

---

## 7. Continue button (derived state)

Not independent — **derived** from lesson machine:

```ts
continueEnabled =
  currentPartEnded &&
  (!partHasTrivia || triviaAnswered) &&
  (isLastPart ? reflectionDone || reflectionOptional : true)
```

v1: reflection optional — `lesson_complete` after all parts + trivia.

---

## 8. Implementation map

| Machine | Owner file |
|---------|------------|
| Lesson session | `lesson-experience.tsx` (refactor to explicit reducer) |
| Video | `video-experience.tsx` |
| Trivia | `trivia-sheet.tsx` |
| Module accordion | `module-accordion-group.tsx` (to create) |
| Course enrollment | server/API (future) |

**Recommendation:** Implement lesson machine as `useReducer` + types in `src/data/lms/lesson-state.ts` when building Lesson v2.

---

## 9. Testing requirements

Each machine:

- [ ] Unit test illegal transition rejected
- [ ] Integration test happy path
- [ ] Integration test trivia cannot skip

See `testing-strategy.md`.
