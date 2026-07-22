# Contract Drift Detection
## Orchestrator answers: "implements v1.1, current is v1.3 — drift detected"

```yaml
scan_triggers:
  - capability_complete
  - librarian_version_bump
  - nightly  # future CI

algorithm:
  1. READ memory/implemented.md implements[] per component
  2. READ spec/contracts/versions.yaml current versions
  3. COMPARE semver — implemented < current → DRIFT
  4. RUN Dependency Analyst impact for drifted components
  5. EMIT Reporter summary
```

---

## Drift record format

```yaml
drift:
  component: LessonExperience
  implements: lesson-screen@1.0.0
  current: lesson-screen@1.0.0
  status: none

drift:
  component: LessonExperience
  implements: lesson-screen@1.0.0
  current: lesson-screen@1.3.0
  status: detected
  severity: minor | major
  required_action: refactor | human_decision
  impacted_capabilities: [lesson-screen, home-continue]
```

---

## Current drift scan (pre-implementation)

All draft components: **unbound** — no `implements` recorded yet.  
First bind on capability complete via Historian.
