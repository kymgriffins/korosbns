# Information Architecture
## LMS — Budget Ndio Story

---

## 1. Purpose

Define **what exists**, **where it lives**, and **how learners move** between destinations — without inventing navigation at implementation time.

**Key question this document answers:**

> How does a learner reach every destination without a sidebar?

---

## 2. Site map

```
/learn                          [HUB] Home
├── /catalogue                  [HUB] Browse all courses
├── /search                     [UTILITY] Global search
├── /progress                   [HUB] Milestones & courses
├── /achievements               [HUB] Badges
├── /profile                    [HUB] Learner identity
├── /courses/[courseSlug]       [FLOW] Course detail
│   └── /modules/[moduleSlug]   [FLOW] Module overview (optional deep link)
│       └── /lessons/[lessonSlug] [FLOW] Lesson (primary learning surface)
└── /account/*                  [ADJACENT] Auth settings (no LMS shell)
```

### Tier definitions

| Tier | Purpose | Nav access |
|------|---------|------------|
| **HUB** | Re-orient, resume, discover | Bottom nav (5) + top nav |
| **FLOW** | Complete learning | Breadcrumb + Continue; bottom nav hidden on lesson |
| **UTILITY** | Find content | Top nav search icon + direct URL |
| **ADJACENT** | Account | Marketing/auth chrome |

---

## 3. Content hierarchy

```
Level 0 — Platform        Budget Ndio Story Learn
Level 1 — Hub screen      Home | Catalogue | Progress | …
Level 2 — Course          Kenya Budget Fundamentals
Level 3 — Module          Introduction
Level 4 — Lesson          What is the National Budget?
Level 5 — Video part      Part 1: Introduction
Level 6 — Interaction     Trivia | Reflection
```

**Rule:** Learners should rarely perceive Level 0–1 during a session. Once in a lesson (Level 4), Levels 1–3 compress into breadcrumb context.

---

## 4. Navigation model

### 4.1 Hub navigation (persistent)

| Mobile | Desktop |
|--------|---------|
| Bottom bar: Home, Learn, Progress, Achievements, Profile | Sticky top: Logo, Courses, Discover, My Learning, Achievements, Search, Profile |

**Why:** Hubs are peers. No hierarchy among them — learner picks intent.

### 4.2 Flow navigation (contextual)

| Mechanism | Used when |
|-----------|-----------|
| **Breadcrumb** | Course → Module → Lesson |
| **Continue button** | Forward in lesson flow |
| **Module accordion** | Reveal lessons without leaving course page |
| **Back link** | Up one level (module ← lesson) |

**Why:** Flow screens don't need global nav competing with Continue. Lesson hides bottom nav.

### 4.3 Reachability matrix

*How many taps from any hub to current lesson?*

| From | To current lesson | Path |
|------|-------------------|------|
| Home | Continue card | **1 tap** |
| Catalogue | Course → Enroll → Lesson | **3 taps** (acceptable for new enrolment) |
| Progress | Course continue card | **2 taps** |
| Course page | Expand module → Lesson | **2 taps** |
| Lesson | — | **0** (destination) |

**Law:** Returning learners must reach their lesson in **≤ 2 taps** from any hub (see Navigation Law 1).

---

## 5. User journeys

### Journey A — New learner

```
Landing / Home
  → Catalogue (optional)
  → Course Detail
  → Enroll & Start
  → Lesson (Part 1)
  → Trivia
  → Continue
  → … → Module complete → Course complete → Certificate
```

### Journey B — Returning learner

```
Home
  → Continue Learning card
  → Lesson (resume)
  → Continue
```

### Journey C — Progress check

```
Bottom nav → Progress
  → Course row
  → Course Detail OR Lesson resume
```

### Journey D — Achievement unlock

```
Lesson complete (inline feedback)
  → Achievements tab (optional)
  → View badge
```

---

## 6. URL strategy

| Pattern | Rationale |
|---------|-----------|
| `/learn/courses/[slug]` | Shareable course |
| `/learn/courses/.../lessons/[slug]` | Shareable lesson deep link |
| `/learn/courses/.../modules/[slug]` | Optional — module landing for objectives |
| No `/learn/videos` | Videos live inside lessons only |
| No `?tab=` hub routing | Each hub is a real route (SEO, shareability) |

---

## 7. Information priority per tier

### Hub screens

Show: resume, streak, recommendations  
Hide: full curriculum, long copy

### Course screen

Show: hero, enroll CTA, collapsed modules  
Hide: lesson content, video player

### Module screen (optional)

Show: objectives, lesson list, start CTA  
Hide: video, trivia

### Lesson screen

Show: video, continue  
Hide: global hub chrome (bottom nav), full module tree

---

## 8. Search & discovery IA

Search indexes:

- Courses (title, description)
- Modules (title)
- Lessons (title, summary)

Search does **not** index:

- Video transcripts (v2)
- User notes (v2)

Results grouped by type with deep links to FLOW routes.

---

## 9. Account IA (adjacent)

```
/learn/account           Profile settings (auth)
/learn/account/password
/learn/account/notifications
/learn/account/sign-out
```

Not listed in hub bottom nav. Accessible from Profile hub → Settings link.

---

## 10. Anti-patterns (forbidden)

| Pattern | Why forbidden |
|---------|---------------|
| Left sidebar curriculum | Violates content-first; duplicates module accordion |
| `?tab=modules` hub | Hides routes; breaks deep linking |
| Lesson opens in modal | Breaks shareable URLs |
| Trivia on separate `/quiz` route | Breaks learning loop |
| Dashboard with 6+ widgets | Competing CTAs |

---

## 11. IA ↔ implementation map

| IA node | Route | Screen contract |
|---------|-------|-----------------|
| Home | `LmsRoutes.home` | `screen-contracts/home.md` |
| Catalogue | `LmsRoutes.catalogue` | `screen-contracts/catalogue.md` |
| Course | `LmsRoutes.course(slug)` | `screen-contracts/course-detail.md` |
| Module | `LmsRoutes.module(...)` | `screen-contracts/module-overview.md` |
| Lesson | `LmsRoutes.lesson(...)` | `screen-contracts/lesson.md` |
| Progress | `LmsRoutes.progress` | `screen-contracts/progress.md` |
| Achievements | `LmsRoutes.achievements` | `screen-contracts/achievements.md` |
| Profile | `LmsRoutes.profile` | `screen-contracts/profile.md` |
| Search | `LmsRoutes.search` | `screen-contracts/search.md` |
