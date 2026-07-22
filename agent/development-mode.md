# Development Modes
## ADOS — Agent role definitions

The agent **always declares its mode** at the start of a turn. One mode per turn unless Orchestrator coordinates handoff.

---

## Mode: Architecture

| Field | Value |
|-------|-------|
| **Code** | `architecture` |
| **Writes code** | No |
| **Writes docs** | Yes — specs, contracts, decision log only |
| **Output** | Spec amendments, new contracts, backlog items |

Use when: new screen, new law, spec conflict resolution, continuous architecture review.

---

## Mode: Planning

| Field | Value |
|-------|-------|
| **Code** | `planning` |
| **Writes code** | No |
| **Output** | Implementation plan, dependency graph, approval request |

Use when: breaking down backlog item, estimating complexity, identifying missing contracts.

---

## Mode: Implementation

| Field | Value |
|-------|-------|
| **Code** | `implementation` |
| **Writes code** | Yes — `src/` only per contracts |
| **Prerequisite** | Plan approved + context loaded |

Use when: building approved backlog item after shell dependencies met.

---

## Mode: Review

| Field | Value |
|-------|-------|
| **Code** | `review` |
| **Writes code** | No — critique only |
| **Output** | Filled review template, PASS/FAIL per layer |

Use when: post-implementation verification, pre-merge gate.

---

## Mode: Refactor

| Field | Value |
|-------|-------|
| **Code** | `refactor` |
| **Writes code** | Yes — no behavior change unless contract update |
| **Output** | Promotion/demotion per component-evolution.md |

Use when: extracting components, aligning draft UI to contracts.

---

## Mode: Performance

| Field | Value |
|-------|-------|
| **Code** | `performance` |
| **Output** | Budget report vs performance-budget.md |

---

## Mode: Accessibility

| Field | Value |
|-------|-------|
| **Code** | `accessibility` |
| **Output** | a11y audit vs accessibility-contract.md |

---

## Mode: Testing

| Field | Value |
|-------|-------|
| **Code** | `testing` |
| **Output** | New tests per testing-strategy.md |

---

## Mode: Release

| Field | Value |
|-------|-------|
| **Code** | `release` |
| **Output** | Git commit with ADOS-compliant message |

**Never** release without Review mode PASS on scoped item.

---

## Auto Development Mode

Orchestrated sequence for autonomous runs:

```
FOR each backlog item IN priority order:
  SET mode = planning
  RUN workflow steps 1-6 (through approval)
  SET mode = implementation
  RUN workflow steps 7-9
  SET mode = review
  RUN verification.md (all layers)
  IF FAIL: SET mode = implementation; REVISE; GOTO review
  IF fundamental question: STOP; AWAIT human
  SET mode = release
  COMMIT
  UPDATE memory
  RUN continuous architecture checklist
NEXT
```

Human approval gates: see [questions.md](./questions.md) § Human gates.

---

## Mode declaration template

```md
**ADOS Mode:** implementation
**Backlog:** LJP-001 Learning Shell
**Contracts:** shell/types, lms-shell component contract, layout-blueprints A/D
```
