# SDP 3.0 — Knowledge Graph
## Machine representation; Markdown is human view

```
agent/graph/     ← authoritative for orchestration (YAML + query)
docs/            ← rendered human documentation (views)
src/lib/sdp/     ← runtime query engine (TypeScript)
```

---

## Query (no parsing)

```ts
import { queryCapability, traceRequirement } from "@/lib/sdp/query";

queryCapability("CAP-learning-shell");
traceRequirement("REQ-0012");
```

Planner calls **GET capability**, not "read lesson.md".

---

## Entity types

`capability` · `component` · `contract` · `requirement` · `intent` · `test` · `adr` · `lesson` · `module` · `course` · `motion` · `feature`

---

## Files

| File | Purpose |
|------|---------|
| [requirements.yaml](./requirements.yaml) | REQ-* addressable requirements |
| [entities.yaml](./entities.yaml) | Entity registry |
| [relationships.yaml](./relationships.yaml) | Edges |
| [query.md](./query.md) | Query language |
| [traceability.md](./traceability.md) | REQ→evidence chain |

Runtime mirror: `src/lib/sdp/graph-data.ts` (sync on capability complete).

---

## Roadmap

1. **Now:** Shell + requirements in graph; TS query engine
2. **Next:** Sync script graph YAML → graph-data.ts
3. **SDP 3.0 complete:** Spec AST → graph; Markdown generated from graph
