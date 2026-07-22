# LJP-002 — Learning Runtime

```yaml
id: LJP-002
capability: learning-runtime
title: Learning Runtime
priority: P0
approval_required: false
blueprint: infrastructure
estimated_complexity: 7/10
node: LearningRuntime

depends_on_capabilities:
  - learning-shell

contracts:
  runtime:
    - learning-runtime@1.0.0
    - event-model@1.0.0
    - session@1.0.0
    - progress@1.0.0
    - timeline@1.0.0
  engineering:
    - state_machines@1.0.0
    - events@1.0.0

acceptance:
  - runtime_definition_of_done
  - architecture_review_board

verification: capability_gates

files_expected:
  - src/lib/learning-runtime/**
  - src/data/lms/events.ts
  - agent/spec/runtime-contracts/**
```

## Description

Event-sourced **Learning Runtime** — session, progress, timeline, navigation. No UI.

Architecture:

```
LearningShell → Learning Runtime → (Session | Progress | Timeline) → Lesson/Video/Trivia
```

## Done when

- Deterministic, replayable, observable, recoverable (runtime DoD)
- All `learning-runtime` sub-capabilities pass with evidence
- `events.ts` dispatches through runtime
- Graph + traceability updated

## Plan

See `reviews/LJP-002-plan.md` after Planner.
