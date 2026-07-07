# Data Flow
## Learning Journey Platform — End-to-end data paths

---

## 1. Current phase: static catalog

```
src/data/lms/catalog.ts
        │
        ▼
  getCourse / getLesson / helpers (pure functions)
        │
        ▼
  Server Component page (async)
        │
        ▼
  Props → Feature components (lms/)
        │
        ▼
  Client components (interaction only)
```

**No network** for learn content in v1. Catalog is source of truth.

---

## 2. Future phase: API-backed

```
Django API (citizen learn endpoints)
        │
        ▼
  src/lib/api-client.ts (or services/learn.ts)
        │
        ├── Server: fetch in RSC (cache tags)
        │
        └── Client: TanStack Query (mutations, live progress)
        │
        ▼
  Same component props shape as types.ts
```

**Rule:** API response mappers live in `data/lms/` or `lib/` — never in components.

---

## 3. Flow diagrams

### Course detail (server)

```
Request /learn/courses/[slug]
  → getCourse(slug)
  → getTotalLessons, getCompletedLessonsCount (mock → API)
  → <CourseDetailView course={...} stats={...} />
```

### Lesson (hybrid)

```
Request .../lessons/[slug]
  → getLesson, getModule, getCourse (server)
  → getLessonNeighbors (server)
  → <LessonExperience initial={...} /> (client)
        → video events → sessionStorage
        → trivia state local
        → Continue → router.push(nextHref)
```

### Home continue (server → fix per Law 1)

```
getCourse(primaryEnrolled)
  → resolve lastLessonHref (helper TBD)
  → <CourseCard variant="continue" href={lessonHref} />
```

---

## 4. Data dependencies by screen

| Screen | Server data | Client state |
|--------|-------------|--------------|
| Home | courses, progress summary | — |
| Catalogue | LMS_COURSES | filter query |
| Course | course, progress | accordion open id |
| Lesson | lesson, neighbors | video, trivia, continue |
| Progress | all courses progress | — |
| Achievements | LMS_ACHIEVEMENTS | — |
| Search | LMS_COURSES (client filter) | query |
| Profile | stats (mock) | — |

---

## 5. Types flow

```
types.ts          ← domain definitions
catalog.ts        ← implements types with static data
helpers.ts        ← pure transforms (neighbors, first lesson)
routes.ts         ← URL builders only
page.tsx          ← wires helpers + components
```

Never duplicate type shapes inline in components.

---

## 6. Server Actions (when needed)

Use for:

- Mark lesson complete (mutation)
- Save reflection (v2)
- Enroll in course

Pattern:

```
src/features/learn/actions/mark-complete.ts  (future)
  'use server'
  → revalidateTag('learn-progress')
```

Not for: reading catalog, navigation, trivia validation (client-first).

---

## 7. Caching strategy

| Data | Strategy |
|------|----------|
| Static catalog | `cache()` wrapper on getters or build-time |
| Course page | ISR revalidate 3600 (when CMS) |
| Lesson progress | `no-store` or private short cache |
| User progress | Per-user, never static |

---

## 8. Error boundaries

| Failure | Handling |
|---------|----------|
| Unknown slug | `notFound()` |
| Empty catalog | Empty state in hub |
| Video load error | `VideoPlayer` error state + retry |
| API error (future) | Error boundary + toast + stale cache fallback |
