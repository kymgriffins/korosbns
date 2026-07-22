# State Machine
## Per-item lifecycle — valid transitions only

Each backlog item traverses these phases. Invalid transitions → STOP.

---

## Phase states

| Phase | Values | Meaning |
|-------|--------|---------|
| `planning` | `pending` → `in_progress` → `complete` | Plan produced |
| `dependencies` | `pending` → `complete` \| `blocked` | DAG edges satisfied |
| `implementation` | `pending` → `in_progress` → `complete` | Code written |
| `tests` | `pending` → `in_progress` → `complete` \| `fail` | Layer 3 |
| `accessibility` | `pending` → `complete` \| `fail` \| `na` | Layer 4 |
| `performance` | `pending` → `complete` \| `fail` \| `na` | Layer 5 |
| `design_review` | `pending` → `complete` \| `fail` | Layer 6 |
| `architecture_review` | `pending` → `complete` \| `fail` | Layer 7 |
| `user_approval` | `not_required` \| `waiting` \| `approved` \| `rejected` | Human gate |
| `completed` | `false` → `true` | Item done |

---

## Transition rules

```yaml
start:
  planning: pending
  dependencies: pending  # computed from graph

on_plan_complete:
  planning: complete
  if approval_required and dry_run: user_approval: waiting
  else: user_approval: not_required

on_user_approved:
  user_approval: approved
  implementation: pending  # scheduler assigns Builder

on_deps_satisfied:
  dependencies: complete

on_implementation_complete:
  implementation: complete
  tests: pending  # assign Verifier chain

on_tests_pass:
  tests: complete
  accessibility: pending

on_layer_pass:
  advance_to_next_layer

on_layer_fail:
  set_layer: fail
  implementation: in_progress  # Builder revises
  rollback: evaluate  # see rollback.md

on_all_layers_pass:
  design_review: complete
  architecture_review: complete
  if release_stage < ready: advance_release_stage
  completed: true
```

---

## Global STOP states

```yaml
halt_if:
  - dependencies: blocked
  - user_approval: waiting
  - user_approval: rejected
  - any_layer: fail  # after 2 revision cycles → human
  - risk: critical AND user_approval != approved
  - confidence < confidence_threshold.human_required
```

---

## Item-level state query

```pseudo
function nextPhase(item):
  if item.blocked_by not empty: return BLOCKED
  if item.state.dependencies != complete: return RESOLVE_DEPS
  if item.state.planning == pending: return PLANNER
  if item.state.user_approval == waiting: return AWAIT_HUMAN
  if item.state.implementation == pending: return BUILDER
  if item.state.tests == pending: return VERIFIER
  # ... cascade through layers
  if item.completed: return NEXT_ITEM
```

See [scheduler.md](./scheduler.md).
