# Runtime Scheduler
## Capability-centric — computes next action from queue + state + locks

```
READ queue.yaml → state.yaml → locks.yaml → spec/capabilities.yaml
NEVER read state from spec/backlog/
```

---

## Algorithm (SDP 2.1)

```
1. IF execution_lock.active → reject spec edits; Builder only
2. LOAD active_capability from queue.yaml
3. IF capability blocked → Dependency Analyst report → STOP
4. FOR each sub_capability in spec/capabilities.yaml:
     IF verification != pass → compute next build/verify action
5. capability_complete ONLY when ALL sub_capabilities pass WITH evidence
6. RUN risk-engine + confidence on proposed action
7. IF confidence < 70 OR risk critical without approval → Reporter → human
8. ON capability complete:
     - Critic merge verdict
     - Retrospective (Historian + Librarian)
     - drift scan
     - unlock execution_lock
     - check runtime promotion (promotion.md)
9. ADVANCE queue to next unblocked capability
```

---

## Capability vs backlog item

| Old | New |
|-----|-----|
| "LJP-001 done" | `learning-shell` all 13 sub-capabilities `pass` + evidence |
| Linear backlog | `queue.yaml` + dependency graph |
| State in backlog md | `runtime/state.yaml` only |

---

## Current computed state

```yaml
runtime_stage: draft
active_capability: learning-shell
execution_lock: false
next_action: dry_run_v2_then_await_approval
sequence:
  1: Planner — dry run v2 under SDP 2.1 model
  2: Dependency Analyst — shell blast radius + coupling report
  3: Critic — adversarial pre-merge review of plan
  4: Reporter — human approval gate
  5: ON APPROVE → locks.yaml execution_lock ON → Builder per sub_capability
  6: Verifier + Guardian per sub_capability → evidence required
  7: Critic merge verdict
  8: Historian + Librarian → retrospective
  9: IF LJP-001 E2E success → runtime_stage: validated → then commit allowed
```

---

## Sub-capability build order (learning-shell)

```
providers → error_boundary → top_navigation → bottom_navigation
→ page_container → learning_shell_composer → toasts → dialogs
→ bottom_sheets → theme → motion → accessibility → layout_integration
```

Each sub-capability must pass its listed verification layers before marking `pass`.

---

## Dry run mode

```yaml
dry_run: true
builder: disabled
output: reviews/LJP-001-dry-run-v2.md
sets: execution.phases.dry_run_v2: complete
does_not_set: capability complete
```
