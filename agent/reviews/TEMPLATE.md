# Review: {{ITEM_ID}} — {{CAPABILITY}}

```yaml
item: {{ITEM_ID}}
capability: {{CAPABILITY}}
date: {{DATE}}
status: PASS | FAIL | BLOCKED
evidence_required: true
```

---

## Summary

_One paragraph._

---

## Verification layers (evidence mandatory)

**PASS without evidence list = invalid review.**

### Layer 1 — Compilation

```yaml
result: PASS | FAIL
evidence:
  - "pnpm exec tsc --noEmit exit 0"
```

### Layer 2 — Lint

```yaml
result: PASS | FAIL
evidence:
  - "No new errors in [files]"
```

### Layer 3 — Tests

```yaml
result: PASS | FAIL
evidence:
  - "pnpm test src/components/lms/shell — N passed"
```

### Layer 4 — Accessibility

```yaml
result: PASS | FAIL | N/A
evidence:
  - "nav aria-label present: lms-top-nav.tsx:L36"
  - "Law 12: layout uses resolveShellMode immersive"
```

### Layer 5 — Performance

```yaml
result: PASS | FAIL | N/A
evidence: []
```

### Layer 6 — Design

```yaml
result: PASS | FAIL
evidence:
  - "Design DNA: no new colors introduced"
  - "anti-patterns.md: zero matches"
```

### Layer 7 — Architecture

```yaml
result: PASS | FAIL
evidence:
  - "Navigation Law 12 satisfied — bottom nav hidden on /lessons/"
  - "lms-shell@1.0.0 variants hub/immersive/account implemented"
  - "No new navigation pattern introduced"
```

### Layer 8 — Questionnaire

```yaml
result: PASS | FAIL | N/A
score: null | N/70
evidence: []
```

### Layer 9 — Definition of Done

```yaml
result: PASS | FAIL
evidence:
  - "Shell roadmap Phase B items 1-10 addressed"
```

---

## Sub-capability evidence (capability gates)

| Sub-capability | Contract | Result | Evidence |
|----------------|----------|--------|----------|
| providers | lms_shell@1.0.0 | | |
| layout_integration | lms_shell@1.0.0 | | |

---

## Contract implementation bindings

```yaml
components:
  LearningShell:
    implements: [lms-shell@1.0.0]
    drift: none
```

---

## Critic verdict

```yaml
merge_recommendation: APPROVE | REJECT | CONDITIONAL
weakest_decision:
likely_debt:
future_break_risk:
premature_abstraction:
simpler_alternative:
unable_to_find_issues: false
```

---

## Dependency Analyst

```yaml
coupling_score:
blast_radius_if_changed:
```

---

## Human gates

| Gate | Resolution |
|------|------------|
| | |

---

## Required action (if FAIL)

```
Reason:
Fix:
Re-run from:
```
