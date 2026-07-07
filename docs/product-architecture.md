# Product Architecture
## Budget Ndio Story — Learning Management System

---

## 1. Product definition

**What it is**

A mobile-first civic education platform where structured courses replace a traditional LMS dashboard. The learner progresses through video micro-lessons, inline trivia, and reflections — not through menus.

**What it is not**

- A document repository
- A forum-first community
- A multi-tab learning hub with sidebars
- A content management surface for admins (that lives elsewhere)

**Core product unit**

The **lesson** is the atomic unit of value. Everything else (courses, modules, progress, achievements) exists to move the learner to the next lesson.

---

## 2. Domain model

```
Organisation
  └── Course (enrollable learning path)
        └── Module (gated chapter, journey card)
              └── Lesson (single learning session)
                    └── Video Part (3–4 per lesson)
                          └── Trivia (optional, one question)
                    └── Reflection (one prompt)
                    └── Resources (collapsed)
        └── Certificate (on course completion)
  └── Learner Profile
        └── Progress (per course / module / lesson)
        └── Achievements (milestones)
        └── Notes (time-linked, future)
        └── Bookmarks (future)
```

### Entity responsibilities

| Entity | Owns | Does not own |
|--------|------|--------------|
| **Course** | Title, description, modules, enroll CTA | Lesson playback |
| **Module** | Objectives, lesson list, lock state | Full-page lesson UI |
| **Lesson** | Video parts, trivia, reflection, resources | Navigation chrome |
| **Video Part** | Media, transcript, checkpoint trivia | Quiz pages |
| **Progress** | Completion %, streak, milestones | Content authoring |
| **Achievement** | Unlock rules, badges | Grading |

---

## 3. Feature domains

### 3.1 Discovery

Learner finds a course via Home recommendations, Catalogue search/filters, or Search.

**Why it exists:** Reduce time-to-first-lesson. Discovery is lightweight; depth lives inside the course.

### 3.2 Enrollment & continuation

Learner enrolls (or resumes) from Course Detail. Home surfaces "Continue learning."

**Why it exists:** One tap back into the learning loop. The product optimises for **returning learners**, not browsing.

### 3.3 Guided learning loop

```
Watch part → Trivia (if any) → Next part → Reflection → Continue → Next lesson
```

**Why it exists:** Cognitive load stays low. The learner never chooses *how* to learn — only *whether* to continue.

### 3.4 Progress & motivation

Progress page, achievements, streaks, certificates.

**Why it exists:** Milestones sustain habit without dashboard clutter. Shown in hub tabs, not sidebars.

### 3.5 Account (adjacent)

`/learn/account/*` — password, notifications, sign-out.

**Why it exists:** Auth requirement. **Excluded from LMS shell** — not part of the learning journey.

---

## 4. System boundaries

| In scope (v1) | Out of scope (v1) |
|---------------|-------------------|
| Course catalogue & detail | Live instructor video |
| Module accordion on course page | Forum / discussions (stub only) |
| Lesson video + trivia + reflection | Full notes editor |
| Mock progress & achievements | Backend progress API |
| Mobile bottom + desktop top nav | Admin course authoring |
| Search across static catalog | Certificates PDF generation |

---

## 5. Technical architecture

```
┌─────────────────────────────────────────────────┐
│  Next.js App Router (marketing group)            │
│  /learn/*                                       │
├─────────────────────────────────────────────────┤
│  LmsShell (nav chrome)                          │
│    └── Page (server) → LmsPage container         │
│          └── Client islands (video, trivia)     │
├─────────────────────────────────────────────────┤
│  Data layer (v1: static)                        │
│    src/data/lms/catalog.ts                      │
│    src/data/lms/types.ts                        │
│    src/data/lms/routes.ts                       │
├─────────────────────────────────────────────────┤
│  Component library                              │
│    src/components/lms/*                       │
├─────────────────────────────────────────────────┤
│  Design system                                  │
│    shadcn/ui + Tailwind + Motion                │
│    src/constants/lms-design-tokens.ts           │
└─────────────────────────────────────────────────┘
```

### State strategy (v1 → v2)

| Concern | v1 | v2 |
|---------|----|----|
| Course content | Static `catalog.ts` | CMS / API |
| Progress | Derived from mock status | TanStack Query + API |
| Trivia answers | Client-only | Persisted per learner |
| Enrolment | Implicit on CTA click | Server action |

---

## 6. Relationships to other BNS surfaces

| Surface | Relationship |
|---------|--------------|
| Marketing landing | Links to `/learn` — acquisition |
| `/learn/account` | Auth settings — parallel, not nested in shell |
| `/learnhub` | Legacy dashboard demo — **not** canonical LMS |
| Reports / Budget Hub | Cross-link from lesson resources only |

---

## 7. Success metrics (product)

1. **Time to first lesson** — ≤ 3 taps from `/learn`
2. **Lesson completion rate** — trivia + continue, no drop-off at navigation
3. **Return rate** — continue card on Home
4. **Cognitive load** — one primary CTA per viewport (measurable via contract audit)

---

## 8. Architectural invariants

These never change without a new product version:

1. **Course is the product** — not the dashboard
2. **Lesson is the atom** — all UX serves lesson completion
3. **Progressive disclosure** — modules collapse, transcripts collapse, resources collapse
4. **No sidebar navigation** — ever
5. **Trivia overlays** — never navigates away
6. **Continue is the universal forward action**

See `navigation-laws.md` for enforceable rules.
