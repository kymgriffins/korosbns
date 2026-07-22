# Dependency Graph
## DAG — not a linear backlog

Software is a graph. The scheduler uses this to compute parallel work, blocks, and critical path.

---

## Visual

```
                    [LearningShell]  LJP-001
                    /    |    \    \    \    \
                   /     |     \    \    \    \
                  /      |      \    \    \    \
           [LessonDomain] |   [CourseDetail] [Catalogue] [Achievements] [Profile] [Search]
              LJP-002     |        LJP-004     LJP-006    LJP-008      LJP-009   LJP-010
                  \       |           |
                   \      |           |
                    [Lesson]          |
                     LJP-003          |
                       |   \_________/
                       |         \
                   [Progress]   [Home]
                    LJP-007      LJP-005
```

---

## Machine-readable graph

```yaml
nodes:
  LearningShell:
    id: LJP-001
    type: infrastructure
    never_skip: true
    blocks_all_features: true

  LessonDomain:
    id: LJP-002
    type: infrastructure

  Lesson:
    id: LJP-003
    type: feature
    blueprint: D

  CourseDetail:
    id: LJP-004
    type: feature
    blueprint: B

  Home:
    id: LJP-005
    type: integration

  Catalogue:
    id: LJP-006
    type: hub

  Progress:
    id: LJP-007
    type: hub

  Achievements:
    id: LJP-008
    type: hub

  Profile:
    id: LJP-009
    type: hub

  Search:
    id: LJP-010
    type: hub

edges:
  - from: LearningShell
    to: LessonDomain
    hard: true
  - from: LearningShell
    to: CourseDetail
    hard: true
  - from: LearningShell
    to: Catalogue
    hard: true
  - from: LearningShell
    to: Achievements
    hard: true
  - from: LearningShell
    to: Profile
    hard: true
  - from: LearningShell
    to: Search
    hard: true
  - from: LessonDomain
    to: Lesson
    hard: true
  - from: LearningShell
    to: Lesson
    hard: true
  - from: Lesson
    to: Progress
    hard: true
  - from: Lesson
    to: Home
    hard: true
  - from: CourseDetail
    to: Home
    hard: true

parallel_after_LJP-001:
  - LJP-002  # domain — critical path
  - LJP-004  # course — parallel track
  - LJP-006
  - LJP-008
  - LJP-009
  - LJP-010

parallel_after_LJP-002_and_LJP-001:
  - LJP-003  # lesson — critical path

never_start_before:
  Lesson: [LearningShell, LessonDomain]
  CourseDetail: [LearningShell]
  Home: [Lesson, CourseDetail]
  Progress: [Lesson]
  # All hubs except domain: [LearningShell]

critical_path:
  - LJP-001
  - LJP-002
  - LJP-003
  - LJP-005

shared_components_at_risk:
  LearningShell:
    - all /learn routes
    - MobileBottomNav
    - learn-nav.ts
    - layout.tsx
  Lesson:
    - ContinueButton (future)
    - TriviaPopup host
```

---

## Scheduler queries

```pseudo
function isBlocked(itemId):
  return any(dep in depends_on where state[dep].completed != true)

function parallelizable():
  return items where !isBlocked(id) AND state.implementation == pending
                 AND NOT on critical_path OR critical_path_only == false

function criticalPathNext():
  return first incomplete item in critical_path list
```

---

## Component dependency map (logical)

| Node | Depends on components |
|------|----------------------|
| LearningShell | MobileBottomNav, learn-nav, LmsProviders, lms.css |
| Lesson | LearningShell, video-player, trivia-popup, continue-button |
| CourseDetail | LearningShell, course-hero, module-card |
| Home | LearningShell, continue-button, course-card |

See [change-impact.md](./change-impact.md) for blast radius.
