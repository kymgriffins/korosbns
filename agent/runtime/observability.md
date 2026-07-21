# AI Observability
## Every Builder action produces an auditable record

```yaml
version: 1
location: agent/runtime/observability/
```

---

## Record schema

```yaml
observability:
  id: OBS-LJP-002-001
  capability: learning-runtime
  spec_id: LJP-002
  date: 2026-07-07
  duration_ms: null

  pipeline:
    planner: { status: complete, output: reviews/LJP-002-plan.md }
    builder: { status: complete }
    verifier: { status: complete }
    guardian: { status: complete }
    critic: { status: complete }

  files_changed: []

  requirements_satisfied: []

  contracts_used: []

  tests_added: []

  evidence: []

  confidence: null

  decisions: []
```

---

## Visualization (future)

Planner → Builder → Files → REQ → Contracts → Tests → Evidence → Confidence → Duration

---

## Rule

No capability `complete` without observability file for that build session.
