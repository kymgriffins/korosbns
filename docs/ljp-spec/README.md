# Learning Journey Platform — Engineering Specification

**Product specs:** `../lms-spec/` (experience, design, anti-patterns)  
**Product architecture:** `../product-architecture.md` through `../screen-contracts/`  
**Engineering specs:** this folder (`ljp-spec/`)

---

## Purpose

Prevent **engineering drift** as multiple agents touch the codebase. Design specs say what and why; **these docs say where and how**.

**No implementation commit until `definition-of-done.md` passes for the scoped feature.**

---

## Document index

| # | Document | Role |
|---|----------|------|
| 1 | [engineering-principles.md](./engineering-principles.md) | Philosophy + immutable laws E1–E15 |
| 2 | [frontend-architecture.md](./frontend-architecture.md) | Folder map, import rules, page patterns |
| 3 | [component-evolution.md](./component-evolution.md) | Private → Feature → Shared promotion |
| 4 | [state-management.md](./state-management.md) | Where every state type lives |
| 5 | [data-flow.md](./data-flow.md) | Server → client data paths |
| 6 | [motion-guidelines.md](./motion-guidelines.md) | Animation catalog with ms/spring/fallback |
| 7 | [performance-budget.md](./performance-budget.md) | LCP, JS, hydration limits |
| 8 | [accessibility-contract.md](./accessibility-contract.md) | Behavioral a11y (trivia trap, etc.) |
| 9 | [testing-strategy.md](./testing-strategy.md) | Unit / integration / E2E map |
| 10 | [agent-workflow.md](./agent-workflow.md) | Mandatory 41-step lifecycle |
| 11 | [decision-log.md](./decision-log.md) | ADR-style decision history |
| 12 | [definition-of-done.md](./definition-of-done.md) | Feature completion gate |
| 13 | [domain-model.md](./domain-model.md) | Ubiquitous language + invariants |
| 14 | [state-machines.md](./state-machines.md) | Allowed transitions only |
| 15 | [events.md](./events.md) | Domain event catalog |
| 16 | [error-handling.md](./error-handling.md) | Failure philosophy |
| 17 | [implementation-roadmap.md](./implementation-roadmap.md) | Shell-first build order |

---

## Full stack (design + engineering)

```
EXPERIENCE     lms-spec/experience-principles.md
               lms-spec/design-dna.md
               lms-spec/anti-patterns.md
               lms-spec/design-review-checklist.md

PRODUCT        product-architecture.md
               information-architecture.md
               user-journey.md
               navigation-laws.md
               layout-blueprints.md
               screen-contracts/*
               component-contracts/*

ENGINEERING    ljp-spec/*  ← you are here

IMPLEMENT      src/app/(marketing)/learn/*
               src/components/lms/*
               src/data/lms/*

VERIFY         lms-ui-audit.md
               architecture-review-board.md
               ui-acceptance-questionnaire.md
               definition-of-done.md
```

---

## Current status

| Layer | Status |
|-------|--------|
| Engineering principles | ✅ |
| Frontend architecture | ✅ |
| Component evolution | ✅ |
| State management | ✅ |
| Data flow | ✅ |
| Motion guidelines | ✅ |
| Performance budget | ✅ |
| Accessibility contract | ✅ |
| Testing strategy | ✅ |
| Agent workflow | ✅ |
| Decision log | ✅ (12 decisions) |
| Definition of Done | ✅ |
| **Implementation** | ⚠️ Draft — **not Done** |

---

## First commit scope (recommended)

When implementation begins, **one feature Done**:

**Lesson screen** — satisfies highest contract density, unlocks patterns for all other screens.

Do not batch Home + Course + Lesson in first commit.

---

## Naming

| Context | Name |
|---------|------|
| Product | Learning Journey Platform |
| Engineering folder | `ljp-spec` |
| Code (stable) | `lms` paths |
| Routes (stable) | `/learn/*` |
