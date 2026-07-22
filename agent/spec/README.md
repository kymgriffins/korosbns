# Specification Layer
## Immutable intent — Builder NEVER modifies this tree

```
agent/spec/          ← WHAT should exist (immutable during execution)
agent/runtime/       ← WHAT is happening (mutable)
src/                 ← WHAT was built
```

---

## Rules

| Rule | Enforcement |
|------|-------------|
| Backlog describes intent | `spec/backlog/*.md` — no `state:` blocks |
| Runtime describes execution | `runtime/state.yaml`, `queue.yaml`, `locks.yaml` |
| Builder never edits `spec/` | `locks.yaml` blocks; Historian/Librarian only via retrospective |
| Capabilities gate completion | `spec/capabilities.yaml` — all sub-capabilities must pass |
| Contracts are versioned | `spec/contracts/versions.yaml` — drift detection in runtime |

---

## Contents

| Path | Purpose |
|------|---------|
| [backlog/](./backlog/) | Feature intent (LJP-001–010) |
| [capabilities.yaml](./capabilities.yaml) | Capability + sub-capability gates |
| [contracts/versions.yaml](./contracts/versions.yaml) | Contract IDs, versions, status |
| [contracts/index.md](./contracts/index.md) | Path map to `docs/` |

---

## Amendment protocol (when NOT locked)

1. Human approves spec change
2. Librarian edits `docs/` + bumps version in `versions.yaml`
3. Dependency Analyst runs impact analysis
4. Runtime drift scan flags affected implementations
5. Never amend during `execution_lock.active: true`

See [runtime/locks.yaml](../runtime/locks.yaml).
