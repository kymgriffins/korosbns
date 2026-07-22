# ADOS Workflow
## Machine-readable development lifecycle

```yaml
version: 1
process: Read → Plan → Build → Verify → Ask → Continue
no_shortcuts: true
```

---

## Steps

### Phase READ

| Step | ID | Action | Output | Gate |
|------|-----|--------|--------|------|
| 1 | `read.backlog` | Load current item from `backlog/` | Item ID, priority, deps | Item exists |
| 2 | `read.context` | Execute `context/loader.md` | Contract paths loaded | All required contracts found |
| 3 | `read.memory` | Load `memory/implemented.md` | Reuse candidates | — |
| 4 | `read.deps` | Verify dependency items status = `done` | Deps satisfied | Else STOP |

### Phase PLAN

| Step | ID | Action | Output | Gate |
|------|-----|--------|--------|------|
| 5 | `plan.components` | List reuse vs create per decision-tree | Component plan | No create without contract |
| 6 | `plan.files` | Map to `frontend-architecture.md` paths | File list | — |
| 7 | `plan.show` | Write plan to user | Plan markdown | — |
| 8 | `plan.approve` | Await approval if `approval_required` | Approved | Human YES or auto if false |

### Phase BUILD

| Step | ID | Action | Output | Gate |
|------|-----|--------|--------|------|
| 9 | `build.implement` | Write code per contracts only | Diff | — |
| 10 | `build.memory` | Update `memory/implemented.md` | Memory patch | — |

### Phase VERIFY

| Step | ID | Action | Output | Gate |
|------|-----|--------|--------|------|
| 11 | `verify.all` | Run `verification.md` layers 1–9 | Report | ALL PASS |

### Phase ASK

| Step | ID | Action | Output | Gate |
|------|-----|--------|--------|------|
| 12 | `ask.checkpoint` | Answer `questions.md` post-implementation | Answers | No FAIL |
| 13 | `ask.human` | If fundamental question triggered | Human response | Resolved |

### Phase CONTINUE

| Step | ID | Action | Output | Gate |
|------|-----|--------|--------|------|
| 14 | `continue.review` | Evidence-backed review per TEMPLATE.md | Review file | PASS + evidence |
| 15 | `continue.retrospective` | Historian + Librarian learning loop | retrospective.md | Filed |
| 16 | `continue.unlock` | `locks.yaml` execution_lock OFF | — | — |
| 17 | `continue.promotion` | Check runtime promotion.md | validated? | LJP-001 E2E |
| 18 | `continue.commit` | Only if validated + capability complete | SHA | — |
| 19 | `continue.next` | Advance queue.yaml | Next capability | — |

---

## STOP conditions (immediate halt)

```yaml
stop_if:
  - spec_conflict_unresolved
  - dependency_not_done
  - verification_layer_failed
  - fundamental_question_unanswered
  - missing_contract
  - anti_pattern_detected
  - navigation_law_violation
  - definition_of_done_incomplete
```

On STOP: document reason in `reviews/[item-id].md` status `BLOCKED`. Do not commit.

---

## State machine

```
idle → reading → planning → awaiting_approval → building → verifying → asking → committing → done
                      ↑                              |
                      └──────── verify_fail ─────────┘
```

---

## Automation hooks (future CI)

```bash
# agent/tests/run-verification.sh
pnpm exec tsc --noEmit          # layer 1
pnpm test                       # layer 3
# + manual layers 6-9 via review agent
```

See [tests/commands.md](./tests/commands.md).
