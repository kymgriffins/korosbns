# Release Contract
## Stages — not just "commit"

Each item and component has a `release_stage`. Verification requirements increase per stage.

---

## Stages

```
draft → experimental → internal → ready → released
```

| Stage | Meaning | Verification required |
|-------|---------|----------------------|
| `draft` | Scaffold / WIP | Layers 1–2 only |
| `experimental` | Behind flag or dev-only | Layers 1–5 |
| `internal` | Team review | Layers 1–7 |
| `ready` | Merge candidate | All 9 layers + DoD |
| `released` | On learnreformed / production | All 9 + sign-off + audit updated |

---

## Transitions

```yaml
draft → experimental:
  requires: [compilation, lint]

experimental → internal:
  requires: [tests, accessibility, performance]

internal → ready:
  requires: [design_review, architecture_review, questionnaire_or_na]

ready → released:
  requires: [definition_of_done, user_approval if critical risk, commit, memory update]

released → draft:  # regression
  trigger: rollback level 2+
  action: rollback.md
```

---

## Item release mapping

| Item | Current stage | Target after LJP-001 complete |
|------|---------------|--------------------------------|
| LJP-001 | draft | ready (then released on commit) |
| LJP-002–010 | draft | unchanged |

---

## Commit rules (Release responsibility)

```yaml
commit_when:
  release_stage: ready
  verification.overall: PASS
  state.completed: true

commit_format:
  feat(lms): complete LJP-001 learning shell

  Release stage: ready → released
  Review: agent/reviews/LJP-001.md
  Risk: critical (approved)
```

Separate commits: `feat(spec):` for SDP runtime vs `feat(lms):` for implementation.

---

## Component-level stages

Track in `memory/implemented.md`:

```yaml
LmsShell:
  release_stage: draft  # → ready after LJP-001
MobileBottomNav:
  release_stage: released  # site primitive — do not modify without impact analysis
```
