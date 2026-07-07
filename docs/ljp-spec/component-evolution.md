# Component Evolution
## Learning Journey Platform — Promotion path

Prevents AI-generated duplication. Every component has a **lifecycle stage**.

---

## 1. Promotion ladder

```
Stage 0 — Inline JSX
  Route page or parent component, < 20 lines, used once

Stage 1 — Private Component
  Same file or _components/ subfolder, used once in feature

Stage 2 — Feature Component
  src/components/lms/*.tsx, used across learn routes

Stage 3 — Shared Component
  src/components/* (e.g. profile/), used across marketing + learn

Stage 4 — Design System Primitive
  src/components/ui/*, domain-agnostic, shadcn

Stage 5 — Motion / Token Primitive
  motion/variants.ts, constants/lms-design-tokens.ts
```

**Rule:** Components only move **up** the ladder with justification. Never copy-down (duplicate Stage 2 as inline).

---

## 2. Promotion criteria

### → Stage 2 (Feature Component)

Required:

- [ ] Used or planned on **2+ learn screens**
- [ ] **Component contract** exists in `docs/component-contracts/`
- [ ] Listed in `docs/component-inventory.md`
- [ ] No business logic — data via props
- [ ] PR describes promotion in decision log if new pattern

### → Stage 3 (Shared)

Required:

- [ ] Used outside `/learn` (e.g. profile avatar)
- [ ] No learn-specific copy hardcoded
- [ ] Decision log entry

### → Stage 4 (ui primitive)

Required:

- [ ] Zero domain knowledge
- [ ] Matches shadcn patterns
- [ ] Human review — agents do not promote to ui/ alone

---

## 3. Demotion / merge

If two Stage 2 components overlap > 70%:

1. Merge into one with `variant` prop
2. Update component contract
3. Delete duplicate
4. Decision log entry

---

## 4. Current inventory & target stage

| Component | Current | Target | Action |
|-----------|---------|--------|--------|
| `CourseCard` | Stage 2 | 2 | Keep |
| `ModuleCard` | Stage 2 | 2 | Add accordion group context |
| `LessonHero` | Stage 2 | 2 | Keep |
| `VideoExperience` | Stage 2 | 2 | Rename → `VideoPlayer` per contract |
| `TriviaSheet` | Stage 2 | 2 | Rename → `TriviaPopup` per contract |
| `LessonExperience` | Stage 2 | 2 | Orchestrator — keep |
| `CourseHero` | Stage 0 (inline in page) | 2 | **Extract** |
| `LessonCard` | Stage 0 (inline in ModuleCard) | 2 | **Extract** |
| `ContinueButton` | Missing | 2 | **Create** |
| `LmsShell` | Stage 2 | 2 | Keep |

---

## 5. Agent justification template

When creating a **new** Stage 2 component:

```md
## Component promotion request

Name: ContinueButton
From: inline in lesson-footer
To: Stage 2 — src/components/lms/continue-button.tsx

Reuse check:
- [ ] lesson-footer — partial, wrong semantics
- [ ] ui/button — primitive only, no sticky/gating

Contract: docs/component-contracts/continue-button.md

Used on: lesson.md (required), trivia-popup.md (secondary)
```

---

## 6. Forbidden patterns

```
❌ New component without contract
❌ Copy CourseCard as SimilarCourseCard
❌ Feature component importing another feature's internals (use public props)
❌ Promoting to ui/ with "Learn" in the name
```
