# Frontend Architecture
## Learning Journey Platform — Folder ownership

AI agents must not invent folder structures. Extend this map only via decision log.

---

## 1. Repository layout (Learn feature)

```
src/
├── app/(marketing)/learn/          # Routes only — thin pages
│   ├── layout.tsx                  # LmsShell gate (client: pathname check)
│   ├── page.tsx                    # Home (server)
│   ├── catalogue/page.tsx
│   ├── progress/page.tsx
│   ├── achievements/page.tsx
│   ├── profile/page.tsx
│   ├── search/page.tsx             # client (search state)
│   ├── courses/[courseSlug]/       # server pages
│   │   ├── page.tsx
│   │   └── modules/[moduleSlug]/
│   │       ├── page.tsx
│   │       └── lessons/[lessonSlug]/page.tsx
│   └── account/                    # Adjacent — no LmsShell
│
├── components/
│   ├── lms/                        # ★ Learning Journey UI (feature)
│   ├── ui/                         # shadcn primitives — domain-agnostic
│   └── profile/                    # Shared profile avatars (cross-feature)
│
├── data/lms/                       # ★ Domain types, catalog, route helpers
│   ├── types.ts
│   ├── catalog.ts
│   ├── routes.ts
│   └── helpers.ts
│
├── constants/
│   └── lms-design-tokens.ts        # Design tokens (not business data)
│
├── lib/
│   └── learn-nav.ts                # Nav active-state helpers
│
├── motion/
│   └── variants.ts                 # Shared motion variants (import in lms)
│
└── styles/
    ├── tokens.css                  # Global CSS variables
    └── components.css              # Global component utilities
```

**Future (API phase)** — add when needed, not before:

```
src/
├── features/learn/                 # Optional: hooks + server actions colocated
│   ├── hooks/
│   ├── actions/
│   └── queries/
└── services/                       # API client wrappers for learn endpoints
```

---

## 2. Folder ownership

| Path | Owns | Must not own |
|------|------|--------------|
| `app/.../learn/**/page.tsx` | Metadata, data loading, composition, notFound | Video logic, trivia state |
| `components/lms/` | Learn UI, motion, interaction | API calls (except containers TBD) |
| `components/ui/` | Primitives | Learn-specific copy or data |
| `data/lms/` | Types, static catalog, pure helpers | React, JSX |
| `constants/lms-design-tokens.ts` | Spacing, motion, layout tokens | Component implementations |
| `lib/learn-nav.ts` | Path → active state | UI rendering |

---

## 3. Route page pattern

**Server page (default):**

```tsx
// app/(marketing)/learn/courses/[courseSlug]/page.tsx
export default async function CoursePage({ params }) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();
  return (
    <LmsPage>
      <CourseDetailView course={course} />
    </LmsPage>
  );
}
```

**Client boundary** — only where contracts require interaction:

| Screen | Client module |
|--------|---------------|
| Lesson | `LessonExperience` |
| Catalogue | page (filters) or extract `CatalogueView` |
| Search | page or `SearchView` |
| Shell | `LmsShell`, `LmsNav` |

---

## 4. Import rules

```
pages     → components/lms, data/lms, constants
lms       → components/ui, data/lms, constants, motion
ui        → utils only (no lms, no data/lms)
data/lms  → nothing from components
```

---

## 5. Naming conventions

| Artifact | Convention | Example |
|----------|------------|---------|
| Route folder | kebab-case | `course-slug` param |
| Component file | kebab-case | `continue-button.tsx` |
| Component export | PascalCase | `ContinueButton` |
| Data helpers | camelCase | `getLessonNeighbors` |
| Types | `Lms` prefix | `LmsCourse`, `LmsLesson` |

---

## 6. Docs co-location

| Spec type | Location |
|-----------|----------|
| Design / experience | `docs/lms-spec/` |
| Engineering | `docs/ljp-spec/` |
| Screen contracts | `docs/screen-contracts/` |
| Component contracts | `docs/component-contracts/` |

---

## 7. What not to create

```
❌ src/components/learn/          (deleted — do not recreate)
❌ src/features/learn/ui/         (premature — use components/lms)
❌ src/pages/                     (App Router only)
❌ Duplicate route under /learnhub for production learn flows
```
