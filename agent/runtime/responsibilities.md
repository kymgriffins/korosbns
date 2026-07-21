# Responsibility Agents
## SDP 2.1 — responsibilities, not roles

---

## Hierarchy

```
Orchestrator (scheduler + state + locks)
│
├── Planner                 What to build; sub-capability plan
├── Dependency Analyst      What breaks if we change X; graph health
├── Builder                 Writes src/ only; never edits spec/
├── Reviewer                Finds defects; evidence-backed PASS/FAIL
├── Verifier                Tests + Definition of Done
├── Guardian                Architecture, laws, a11y
├── Optimizer               Performance
├── Critic                  Prove implementation should NOT merge
├── Historian               memory/, state.yaml, ADRs, retrospective
├── Librarian               contracts/ versions (lock OFF only)
└── Reporter                Human summary; approval gates
```

---

## Responsibility map

| Agent | Writes | Reads |
|-------|--------|-------|
| Planner | plans in reviews/ | spec/backlog, capabilities.yaml |
| Dependency Analyst | impact in reviews/ | dependency-graph, memory, import graph |
| Builder | `src/` | spec/, runtime/ (read-only spec) |
| Reviewer | evidence in reviews/ | verification.md |
| Verifier | tests | testing-strategy |
| Guardian | evidence | navigation-laws, contracts |
| Critic | adversarial report | all specs |
| Historian | memory/, state.yaml, retrospective | — |
| Librarian | docs/ + versions.yaml | locks.yaml (must be OFF) |
| Reporter | human summaries | confidence, risk |

**Builder rule:** NEVER modify `agent/spec/`. Violation → STOP.

---

## Critic mandate (merge-blocking adversary)

**Explicit goal: prove the implementation should NOT be merged.**

Must answer:

1. Where is the weakest architectural decision?
2. Which component is most likely to become technical debt?
3. What future feature will break this implementation?
4. Is any abstraction premature?
5. Can a simpler implementation achieve the same result?

Output:

```yaml
critic_verdict:
  merge_recommendation: APPROVE | REJECT | CONDITIONAL
  findings: []
  unable_to_find_issues: true | false  # if true, note as evidence
```

If `REJECT` → Builder must revise. Reviewer cannot override Critic on navigation law violations.

---

## Dependency Analyst mandate

Continuous ownership of:

- `runtime/dependency-graph.md` accuracy
- Cycle detection
- Over-coupling flags (e.g. feature imports shell internals)
- Change impact before every Builder session
- Drift + blast radius when contracts bump

Output before Builder:

```yaml
dependency_analysis:
  target: LearningShell
  breaks_if_changed:
    routes: []
    components: []
    capabilities: []
  coupling_score: low | medium | high
  refactor_recommendations: []
```

---

## Learning loop (post-capability)

Historian + Librarian **automatically** generate retrospective:

See [reviews/RETROSPECTIVE-TEMPLATE.md](../reviews/RETROSPECTIVE-TEMPLATE.md)

```
What surprised us? → Spec gaps? → Engineering gaps? → Tests missing?
→ Contract updates? → Anti-patterns? → Future optimizations?
```

File: `reviews/[spec-id]-retrospective.md`

Required before `execution_lock` release and capability `complete`.

---

## Scheduler assignments (learning-shell)

```yaml
pre_build:
  - Planner
  - Dependency Analyst
  - Critic (plan review)
  - Reporter (approval)

build:
  - Builder (per sub_capability, lock ON)
  - Verifier
  - Guardian
  - Optimizer

post_build:
  - Critic (merge verdict)
  - Reviewer (evidence audit)
  - Historian (memory + contract bindings)
  - Librarian (if retrospective proposes version bump — lock OFF)
  - Reporter
```
