# Interaction Inventory
## LMS — Every learner interaction and its home

Maps **gesture → component → law**. Implementation must not invent interactions outside this list.

---

## Global interactions

| Interaction | Component | Screen(s) | Law |
|-------------|-----------|-----------|-----|
| Switch hub tab | `LmsBottomNav` / `LmsTopNav` | Hub | 2, 3 |
| Search | `LmsTopNav` → Search page | All hubs | 14 |
| Open profile | Nav → Profile | All hubs | 3 |

---

## Discovery interactions

| Interaction | Component | Screen | Outcome |
|-------------|-----------|--------|---------|
| Tap continue card | `CourseCard` (continue variant) | Home | → Lesson resume |
| Tap course card | `CourseCard` | Home, Catalogue | → Course Detail |
| Filter category | Filter chips | Catalogue | Filter list |
| Filter difficulty | Badges | Catalogue | Filter list |
| Type search query | Search input | Catalogue, Search | Filter / results |

---

## Course interactions

| Interaction | Component | Screen | Outcome |
|-------------|-----------|--------|---------|
| Enroll & start | `CourseHero` primary CTA | Course Detail | → First available lesson |
| Expand module | `ModuleCard` accordion | Course Detail | Reveal lessons in place (Law 4) |
| Collapse module | `ModuleCard` | Course Detail | Hide lessons |
| Tap lesson link | `LessonCard` row | Course Detail (expanded) | → Lesson |
| View requirements | Collapsible section | Course Detail | Progressive disclosure |

**Why module list is on course page:** Enrollment decision happens before curriculum depth. Modules are disclosure, not navigation tree.

---

## Module overview interactions (optional deep link)

| Interaction | Component | Screen | Outcome |
|-------------|-----------|--------|---------|
| Start module | Primary CTA | Module Overview | → First lesson |
| Tap lesson | `LessonCard` | Module Overview | → Lesson |
| Back to course | Breadcrumb | Module Overview | → Course Detail |

---

## Lesson interactions (core loop)

| Interaction | Component | Screen | Outcome |
|-------------|-----------|--------|---------|
| Play video | `VideoPlayer` | Lesson | Playing state |
| Pause video | `VideoPlayer` | Lesson | Paused |
| Video ends | `VideoPlayer` | Lesson | → Trivia if configured |
| Select video part | Part selector | Lesson | Swap active part |
| Open transcript | `<details>` | Lesson | Expand transcript |
| Answer trivia | `TriviaPopup` | Lesson overlay | Feedback → Continue in sheet |
| Submit reflection | `ReflectionCard` | Lesson | Save draft (v2: persist) |
| Expand resources | `ResourceSection` | Lesson | Show downloads/links |
| Continue (primary) | `ContinueButton` | Lesson sticky | Next part / lesson / module |
| Previous lesson | Ghost button | Lesson secondary row | → Prior lesson (Law 11) |
| Mark complete | Ghost button | Lesson secondary row | Update progress |
| Discussion | Ghost button | Lesson secondary row | v2 — forum link |

---

## Progress & motivation

| Interaction | Component | Screen | Outcome |
|-------------|-----------|--------|---------|
| View overall progress | `ProgressBar` | Progress | — |
| Resume course | `CourseCard` continue | Progress | → Lesson or Course |
| View achievement | `AchievementBadge` | Achievements | — |

---

## Interaction rules

| Rule | Detail |
|------|--------|
| No navigate on module expand | Law 4 |
| No full-page trivia | Law 8 |
| Trivia requires answer | Law 8 — no overlay dismiss |
| Continue gated | Law 10 — after required steps |
| One primary per viewport | Law 13 |

---

## Interaction → component contract map

| Interaction domain | Contracts |
|--------------------|-----------|
| Video | `component-contracts/video-player.md` |
| Trivia | `component-contracts/trivia-popup.md` |
| Forward motion | `component-contracts/continue-button.md` |
| Curriculum | `component-contracts/module-card.md`, `lesson-card.md` |
| Discovery | `component-contracts/course-hero.md`, `course-card.md` |
| Motivation | `component-contracts/progress-ring.md`, `achievement-badge.md` |
