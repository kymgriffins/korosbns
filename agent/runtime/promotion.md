# Runtime Promotion (revised)
## Architecture validated by composition, not isolation

```yaml
stages:
  draft:
    meaning: SDP defined, not proven under features
    current: true

  learning_shell_complete:
    meaning: LJP-001 capability done
    achieved: true

  learning_runtime_complete:
    meaning: LJP-002 capability done + runtime DoD
    achieved: true

  learning_experience_complete:
    meaning: LJP-003 canonical journey test + composition
    achieved: true

  lesson_complete:
    achieved: true

  validated:
    meaning: Shell + runtime + experience — commit allowed
    commit_allowed: true
    pending: gate_1_human_walkthrough

  reference:
    meaning: Multiple capabilities; reusable platform

commit_gate: validated  # NOT learning_shell_complete alone
```

---

## Path to first commit

```
LJP-001 ✓ → LJP-002 → LJP-003 → validated → commit (shell + runtime + lesson)
```

Shell alone does not promote runtime to `validated`.
