# Learning Journey Platform — Specification System

This repository defines a **reference architecture** for a specification-driven learning experience — not a traditional LMS.

**URLs:** `/learn/*` (stable)  
**Product name (specs):** **Learning Journey Platform**  
**Avoid in specs:** "LMS" — it implies Moodle/Canvas dashboards and admin chrome.

---

## Why this exists

Implementation is judged by whether it **feels identical** to the intended experience — not whether it "works."

**No implementation commit** until the target feature passes `../ljp-spec/definition-of-done.md`:

1. Screen Contract + Component Contracts
2. Experience principles (emotion + cognitive load)
3. Design DNA + Anti-patterns
4. Design Review Checklist
5. Engineering principles + architecture (`ljp-spec/`)
6. Architecture Review Board
7. UI Acceptance Questionnaire
8. Tests per testing-strategy.md

---

## Document stack (read in order)

```
PHASE 0 — EXPERIENCE
  experience-principles.md     How it should feel (emotion, cognitive load, complexity)
  design-dna.md                Personality, visual grammar, brand recognition

PHASE 0.5 — CONSTRAINTS
  anti-patterns.md             Instant-fail catalog
  design-review-checklist.md   PR gate (every question)

PHASE 1 — PRODUCT
  ../lms-architecture.md       Vision (legacy filename)
  ../product-architecture.md   Domain model, features
  ../information-architecture.md  Site map, reachability
  ../user-journey.md           Journey-based flows
  ../screen-inventory.md       All screens
  ../interaction-inventory.md  All interactions
  ../navigation-laws.md        Immutable movement rules
  ../layout-blueprints.md      Canonical layouts

PHASE 2 — CONTRACTS
  ../screen-contracts/*        One per screen
  ../component-inventory.md    Component gap map
  ../component-contracts/*     One per component

PHASE 3 — VISUAL LAW
  ../ai-design-constitution.md
  ../ui-acceptance-questionnaire.md
  ../../src/constants/lms-design-tokens.ts

PHASE 3.5 — ENGINEERING
  ../ljp-spec/README.md              ★ Engineering architecture
  ../ljp-spec/engineering-principles.md
  ../ljp-spec/frontend-architecture.md
  ../ljp-spec/component-evolution.md
  ../ljp-spec/state-management.md
  ../ljp-spec/data-flow.md
  ../ljp-spec/motion-guidelines.md
  ../ljp-spec/performance-budget.md
  ../ljp-spec/accessibility-contract.md
  ../ljp-spec/testing-strategy.md
  ../ljp-spec/agent-workflow.md
  ../ljp-spec/decision-log.md
  ../ljp-spec/definition-of-done.md

PHASE 4 — IMPLEMENTATION (blocked)
  ../../src/app/(marketing)/learn/*
  ../../src/components/lms/*

PHASE 5 — VERIFICATION
  ../lms-ui-audit.md
  ../architecture-review-board.md
```

---

## Agent workflow

### Step 0 — Feel (no code)

Read `experience-principles.md` + `design-dna.md`.

Declare for target screen:
- Primary emotion
- Cognitive load budget
- Journey complexity level

### Step 1 — Architect (no code)

Read IA, Navigation Laws, Layout Blueprint, Screen Contract, Component Contracts.

Answer **hard questions** (Architecture Review Board W1–W5).

### Step 2 — Anti-pattern scan (no code)

Scan `anti-patterns.md` against proposed design.

Any match → redesign.

### Step 3 — Engineering (no code)

Read `../ljp-spec/agent-workflow.md` phases 3–4.

### Step 4 — Implement (minimal)

Build to contracts. Reuse components. Tokens only. Follow `frontend-architecture.md`.

### Step 5 — Review (before commit)

Complete `design-review-checklist.md` + `architecture-review-board.md` + `definition-of-done.md` + UI questionnaire.

**All pass → eligible for commit.**

---

## Current status

| Layer | Status |
|-------|--------|
| Experience Principles | ✅ |
| Design DNA | ✅ |
| Anti-Patterns | ✅ |
| Design Review Checklist | ✅ |
| Product / IA / Journey | ✅ |
| Navigation Laws / Blueprints | ✅ |
| Screen Contracts (9) | ✅ |
| Component Contracts (13) | ✅ |
| Design Constitution / Questionnaire | ✅ |
| **Engineering (ljp-spec)** | ✅ |
| **Implementation** | ⚠️ Draft — **not Done** |
| **Audit** | ⚠️ Phase 2 fail |

---

## Screen index

| Route | Contract | Blueprint | Emotion |
|-------|----------|-----------|---------|
| `/learn` | `../screen-contracts/home.md` | A | Momentum / Curiosity |
| `/learn/catalogue` | `catalogue.md` | A | Curiosity |
| `/learn/courses/[slug]` | `course-detail.md` | B | Confidence |
| `/learn/courses/.../modules/[slug]` | `module-overview.md` | C | Orientation |
| `/learn/courses/.../lessons/[slug]` | `lesson.md` | D | Focus |
| `/learn/progress` | `progress.md` | A | Accomplishment |
| `/learn/achievements` | `achievements.md` | A | Pride |
| `/learn/profile` | `profile.md` | A | Ownership |
| `/learn/search` | `search.md` | E | Intent |

---

## Naming guide

| Context | Term |
|---------|------|
| Specs & PRs | Learning Journey Platform |
| Routes | `/learn` |
| Code folder | `lms` (legacy, stable) |
| Docs folder | `lms-spec` (legacy, stable) |
| Learner | Learner (not user, student, trainee) |
| Forward action | Continue (not Next, Submit) |

---

## Reference architecture thesis

This spec stack is reusable for any **guided learning product**:

1. Vision → Experience → DNA → Anti-patterns
2. Product → IA → Journey → Laws → Blueprints
3. Screen + Component contracts
4. Constitution + Questionnaire
5. **Engineering (ljp-spec) → Definition of Done**
6. Implementation under contract
7. Audit

**Changing foundations after commit is expensive. Get the spec right first.**
