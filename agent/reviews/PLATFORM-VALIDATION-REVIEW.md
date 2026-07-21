# Platform Validation Review (Template)
## Earliest after CAP-010 — do NOT run after CAP-004/005

```yaml
document: PLATFORM-VALIDATION-REVIEW
status: template
earliest_trigger: CAP-search  # LJP-010
requires: evidence packages for CAP-001 through CAP-010
output: decide whether Baseline v1.1 is warranted
```

> Constitution stays frozen until this review. Anticipation is not sufficient to amend Baseline v1.0.

---

## Inputs

| Input | Path |
|-------|------|
| Capability Ledger | `agent/runtime/capability-ledger.yaml` |
| Architecture Audit | `agent/reviews/ARCHITECTURE-AUDIT.md` |
| PLATFORM constitution | `agent/PLATFORM.md` |
| Per-capability reviews + retrospectives | `agent/reviews/LJP-00*.md` |
| Observability | `agent/runtime/observability/` |

---

## KPIs (from ledger)

| Metric | Goal | Actual (fill at review) |
|--------|------|-------------------------|
| `platform_changes` / capability (sum) | 0 | |
| `constitution_exceptions` / capability (sum) | 0 | |
| Architecture drift (overall) | <5% | |

---

## Questions

1. Which laws were never challenged?
2. Which laws caused friction?
3. Which ADRs were created?
4. Which abstractions were reused most?
5. Which components remained stable?
6. Did platform drift stay under target (<5%)?
7. Did any capability require a `constitution_exception`? List law + rationale.
8. Totals for `platform_changes` and `constitution_exceptions` vs goals?
9. Did any Capability Validation falsify a platform hypothesis? What did we learn?

---

## Verdict

```yaml
baseline_v1_1_warranted: false  # flip only with evidence
rationale: |
  _
required_ADRs: []
next_actions: []
```

If `baseline_v1_1_warranted: true`, list Rule-of-Three evidence and human approval before amending constitution.
