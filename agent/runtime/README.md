# SDP Runtime
## Execution layer — mutable state only

```
agent/spec/     WHAT should exist (immutable during lock)
agent/runtime/  WHAT is happening
```

| File | Purpose |
|------|---------|
| [state.yaml](./state.yaml) | Capability + sub-capability verification state |
| [queue.yaml](./queue.yaml) | Capability execution order |
| [locks.yaml](./locks.yaml) | Spec freeze during Builder |
| [scheduler.md](./scheduler.md) | Next action algorithm |
| [dependency-graph.md](./dependency-graph.md) | DAG |
| [drift.md](./drift.md) | Contract version drift |
| [promotion.md](./promotion.md) | draft → validated → reference |
| [responsibilities.md](./responsibilities.md) | Agents incl. Dependency Analyst |

**Runtime stage:** `draft` — do not commit until [promotion.md](./promotion.md) validated after LJP-001.
