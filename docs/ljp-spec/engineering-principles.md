# Engineering Principles
## Learning Journey Platform — Budget Ndio Story

Philosophy of the codebase — not framework marketing. These are the engineering counterpart to `../lms-spec/anti-patterns.md`.

---

## 1. Priorities

The codebase prioritizes:

| Priority | Meaning |
|----------|---------|
| **Predictability** | Same problem → same pattern → same location |
| **Composition** | Small pieces assembled; no deep inheritance |
| **Reusability** | Extend existing before creating new |
| **Explicitness** | Types, contracts, named exports — no magic |
| **Performance** | Server-first, lazy client, measurable budgets |
| **Accessibility** | Built in, not bolted on |

Over:

| Deprioritized | Why |
|---------------|-----|
| Convenience | Shortcuts create drift across agents |
| Premature abstraction | Three similar lines beat wrong abstraction |
| Configuration | Prefer code + types over YAML/env sprawl |
| Inheritance | Favor composition and flat component trees |
| Cleverness | Readable > impressive |

---

## 2. Immutable laws

### Logic & data

| Law | Rule |
|-----|------|
| E1 | **Business logic never lives in UI components** — use `src/data/lms/`, `src/lib/`, or server actions |
| E2 | **Presentational components receive data via props** — no fetching inside leaf components |
| E3 | **Route pages orchestrate** — compose features, pass data down |
| E4 | **Types are the contract** — `src/data/lms/types.ts` is source of truth for domain shapes |

### React / Next.js

| Law | Rule |
|-----|------|
| E5 | **Server Components by default** — `"use client"` only when interaction, browser APIs, or hooks required |
| E6 | **One client boundary per feature slice** — e.g. `LessonExperience` wraps interactivity; page stays server |
| E7 | **No `useEffect` for data fetching** — TanStack Query or server fetch in RSC |
| E8 | **Dynamic import heavy client modules** — trivia sheet, motion-heavy blocks |

### Structure

| Law | Rule |
|-----|------|
| E9 | **Composition over inheritance** — no class components, no HOC stacks |
| E10 | **Reuse before creating** — check `component-inventory.md` and `src/components/lms/` first |
| E11 | **Feature code stays in feature paths** — learn UI in `components/lms`, not scattered |
| E12 | **shadcn/ui is primitive layer** — `components/ui/*` never imports from `components/lms/*` |

### Quality

| Law | Rule |
|-----|------|
| E13 | **Every new pattern → decision log** — `decision-log.md` |
| E14 | **No merge without Definition of Done** — `definition-of-done.md` |
| E15 | **Tokens over literals** — spacing, motion, colors from `lms-design-tokens.ts` |

---

## 3. Engineering anti-patterns

```
❌ fetch() inside a card component
❌ 400-line page with inline JSX for reusable blocks
❌ "use client" on layout or page without reason
❌ useState for server data that should be RSC props
❌ New Zustand store without state-management.md justification
❌ Copy-paste component with renamed props (promote or compose)
❌ Magic numbers in className strings
❌ Importing from deleted src/components/learn/*
❌ Sidebar layout in /learn/*
❌ eslint-disable without comment + decision log entry
```

---

## 4. Agent decision tree

```
Need UI?
  → Exists in component-contracts + src/components/lms?
    → Yes: reuse or extend variant
    → No: write component contract first, then implement

Need data?
  → Static/catalog phase: src/data/lms/catalog.ts
  → API phase: src/lib/ + TanStack Query (see state-management.md)

Need interaction?
  → Can server component parent pass handlers?
    → Minimal client child
  → Else: client feature component
```

---

## 5. Relationship to design specs

| Design | Engineering |
|--------|---------------|
| `experience-principles.md` | Cognitive load → component count limits |
| `design-dna.md` | Tokens + motion guidelines |
| `anti-patterns.md` | Engineering anti-patterns (this doc §3) |
| Screen contracts | Route pages + composition |
| Component contracts | `src/components/lms/*.tsx` |

Design says **what** and **why**. Engineering says **where** and **how**.
