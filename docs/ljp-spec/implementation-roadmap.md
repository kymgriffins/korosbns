# Implementation Roadmap
## Learning Journey Platform — Build order

**Do not implement Lesson before Learning Shell.**

Implementation commits follow this sequence. Each step must pass `definition-of-done.md` before the next begins.

---

## Phase A — Specification (commits 1–2)

| Step | Deliverable | Status |
|------|-------------|--------|
| A1 | All `docs/lms-spec`, `docs/ljp-spec`, contracts | ✅ |
| A2 | Repo scaffold (tokens, types, tests dirs, shell placeholders) | Commit 2 |

---

## Phase B — Learning Shell (commit 3+)

**The operating system.** Every screen inherits from this.

Build order within shell:

```
1. LmsProviders          Motion, reduced-motion, future event bus
2. LmsErrorBoundary      error-handling.md
3. LearningShell         Composes layers below
4. LmsTopNav             Desktop sticky
5. LmsBottomNav          Mobile 5-item
6. LmsPage               Content container (max-width, padding)
7. LmsToastLayer         Sonner placement scoped to learn
8. LmsDialogLayer        Shared dialog portal (v2)
9. LmsBottomSheetLayer   Trivia host (portal target)
10. lms.css              Scoped tokens (black CTA, prose)
```

**Done when:**

- Hub route renders empty shell with nav
- Lesson route renders shell with bottom nav hidden
- Account route excluded from shell
- Performance budget met for shell-only page
- a11y: landmarks, focus order

**Do not:** implement Course or Lesson content in this phase.

---

## Phase C — Domain infrastructure

```
1. lesson-state.ts       Reducer + state machine types
2. events.ts             Event types + dev emitter
3. session-persistence   sessionStorage helpers
4. helpers tests         100% coverage
```

---

## Phase D — Feature screens (order)

```
1. Lesson (Blueprint D)     — highest contract density
2. Course Detail (B)        — hero + accordion group
3. Home (A)                 — continue wired to lesson
4. Catalogue (A)
5. Progress (A)
6. Achievements (A)
7. Profile (A)
8. Search (E)
9. Module Overview (C)      — optional deep link
```

---

## Phase E — API integration

```
1. Enrollment endpoints
2. Progress sync
3. TanStack Query migration from catalog.ts
4. Event ingest
```

---

## Commit mapping (recommended)

| Commit | Scope |
|--------|-------|
| `feat(spec): establish LJP reference architecture` | All docs |
| `chore(frontend): align repo with architecture contracts` | Scaffold, no feature UI |
| `feat(shell): implement Learning Shell` | Phase B |
| `feat(learn): lesson domain state + events` | Phase C |
| `feat(lesson): implement Lesson experience Blueprint D` | Phase D.1 |
| … | Subsequent screens |

---

## What not to do

```
❌ Lesson before shell
❌ Course hero before LmsPage container
❌ Trivia sheet before bottom sheet layer
❌ Multiple screens in one Done commit
❌ Spec changes bundled with feature commits (unless amending decision log)
```

---

## Shell dependency graph

```
LearningShell
  ├── used by → Home, Catalogue, Progress, Achievements, Profile, Search
  ├── used by → Course Detail, Module Overview
  └── immersive variant → Lesson (no bottom nav)
```

Every feature PR should state: **Shell dependency: met / new shell API required**
