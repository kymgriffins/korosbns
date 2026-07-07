# Domain Model
## Learning Journey Platform — Ubiquitous language

Business concepts, not database tables. Code types in `src/data/lms/types.ts` must align with this model.

---

## 1. Concept map

```
Learner
  └── Enrollment (per Course)
        └── Progress (per Lesson / Module / Course)
  └── Achievement (milestones)
  └── Notes (v2, per Lesson)
  └── Bookmarks (v2)

Course
  └── Module (ordered, gated)
        └── Lesson (ordered)
              └── VideoPart (3–4 per Lesson)
                    └── Checkpoint (optional)
                          └── Trivia (0–1 per VideoPart)
              └── Reflection (1 prompt per Lesson)
              └── Resource (0–n, collapsed)
  └── Certificate (on Course completion, v2)

Assessment (v2) — separate from inline Trivia
```

---

## 2. Entity definitions

### Course

A shareable learning path. The enrollment unit.

| Attribute | Description |
|-----------|-------------|
| slug | URL identifier |
| title, subtitle, description | Discovery copy |
| modules | Ordered list |
| difficulty, duration | Metadata for catalogue |

**Does not:** play video, track trivia answers (delegates to Enrollment/Progress).

---

### Module

A gated chapter in the journey. Collapsed on Course page until expanded.

| Attribute | Description |
|-----------|-------------|
| order | Sequence in Course |
| status | `locked` \| `available` \| `in_progress` \| `completed` |
| lessons | Ordered list |
| objectives | Learner-facing goals |

---

### Lesson

The **atomic unit of value**. One learning session.

| Attribute | Description |
|-----------|-------------|
| parts | VideoParts (target 3–4) |
| reflectionPrompt | One integration question |
| resources | Optional downloads/links |

---

### VideoPart

A digestible video segment. Not a separate route.

| Attribute | Description |
|-----------|-------------|
| videoUrl, transcript | Media |
| trivia | Optional checkpoint |

---

### Checkpoint / Trivia

One question, one objective, instant feedback. Overlays lesson — never a page.

---

### Reflection

Optional or soft-required capture after parts. Not a blocker for Continue in v1 unless contract updates.

---

### Resource

External file or link. Collapsed by default.

---

### Enrollment

Relationship: **Learner ↔ Course**. Created on "Enroll & start."

| Holds (future API) | enrolledAt, lastLessonSlug, resumePartId |
|--------------------|------------------------------------------|

---

### Progress

Derived + persisted completion state.

| Granularity | lessonPartWatched, triviaPassed, lessonComplete, moduleComplete, courseComplete |
|-------------|-------------------------------------------------------------------------------------|

---

### Achievement

Milestone badge owned by Learner. Unlocked by rules (first lesson, streak, etc.).

---

### Certificate

Proof of Course completion. Belongs to Learner + Course. v2.

---

## 3. Invariants (must always hold)

### Structural

| ID | Invariant |
|----|-----------|
| DM-1 | A **Lesson** belongs to exactly **one** Module |
| DM-2 | A **Module** belongs to exactly **one** Course |
| DM-3 | A **VideoPart** belongs to exactly **one** Lesson |
| DM-4 | A **Trivia** belongs to at most **one** VideoPart |
| DM-5 | Module `order` values are unique within a Course |
| DM-6 | Lesson `order` values are unique within a Module |

### Behavioral

| ID | Invariant |
|----|-----------|
| DM-7 | **Continue** cannot enable until required interactions for current step complete |
| DM-8 | Required interactions = all VideoParts watched + Trivia answered where present |
| DM-9 | A **locked** Module's Lessons are not startable |
| DM-10 | A **Course** cannot be `completed` until every **required** Lesson is `completed` |
| DM-11 | **Trivia** cannot be skipped when present on a VideoPart |
| DM-12 | **Progress** never decreases on back navigation (Law 11) |
| DM-13 | Only **one** Module accordion open on Course page (Law 5) |

### UI (domain-driven)

| ID | Invariant |
|----|-----------|
| DM-14 | Video never renders outside Lesson context |
| DM-15 | Trivia never renders outside Lesson overlay |
| DM-16 | Certificate only after DM-10 satisfied |

---

## 4. Aggregates (DDD-lite)

| Aggregate root | Contains | Consistency boundary |
|----------------|----------|----------------------|
| **Course** | Modules, Lessons (catalog) | Static catalog integrity |
| **Enrollment** | Progress snapshot | Per learner per course |
| **LessonSession** | Part progress, trivia results, reflection draft | Client session until persisted |

LessonSession maps to `LessonExperience` client state — see `state-machines.md`.

---

## 5. Type alignment

| Concept | TypeScript |
|---------|------------|
| Course | `LmsCourse` |
| Module | `LmsModule` |
| Lesson | `LmsLesson` |
| VideoPart | `LmsVideoPart` |
| Trivia | `LmsTrivia` |
| Resource | `LmsResource` |
| Achievement | `LmsAchievement` |
| Module status | `ModuleStatus` |

Future:

| Concept | TypeScript (planned) |
|---------|----------------------|
| Enrollment | `LjpEnrollment` |
| LessonSession | `LjpLessonSession` |
| Progress | `LjpProgress` |

---

## 6. Forbidden concepts in v1

```
❌ Assignment (separate from Trivia)
❌ Grade book
❌ Forum thread as domain entity on learn routes
❌ SCORM package
❌ Instructor role in learner UI
```

---

## 7. Glossary (use in specs & PRs)

| Term | Use | Avoid |
|------|-----|-------|
| Learner | Person learning | User, student, trainee |
| Continue | Forward action | Next, Submit |
| Module | Chapter | Section, unit |
| VideoPart | Segment | Clip, video (ambiguous) |
| Checkpoint | Trivia moment | Quiz, assessment |
| Enrollment | Started course | Subscription |
