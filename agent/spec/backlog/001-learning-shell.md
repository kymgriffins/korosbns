# LJP-001 — Learning Shell

```yaml
id: LJP-001
capability: learning-shell
title: Learning Shell
priority: P0
approval_required: true
blueprint: infrastructure
estimated_complexity: 6/10
node: LearningShell

depends_on_capabilities: []

contracts:
  screen: null
  components:
    - lms_shell@1.0.0

emotion: Orientation
cognitive_load_budget: minimal — chrome only

acceptance:
  - definition_of_done
  - design_review_checklist
  - architecture_review_board

verification: capability_gates  # see spec/capabilities.yaml sub_capabilities

files_expected:
  - src/components/lms/providers/lms-providers.tsx
  - src/components/lms/providers/lms-error-boundary.tsx
  - src/components/lms/shell/learning-shell.tsx
  - src/components/lms/shell/lms-top-nav.tsx
  - src/components/lms/shell/lms-bottom-nav.tsx
  - src/components/lms/shell/lms-page.tsx
  - src/components/lms/shell/lms-toast-layer.tsx
  - src/components/lms/shell/lms-dialog-layer.tsx
  - src/components/lms/shell/lms-bottom-sheet-layer.tsx
  - src/components/lms/shell/types.ts
  - src/styles/lms.css
  - src/app/(marketing)/learn/layout.tsx
```

## Description

Build the **operating system** every LJP screen inherits. No course or lesson content.

Execution state: `runtime/state.yaml` → `capabilities.learning-shell`  
Sub-capability gates: `spec/capabilities.yaml`

## Done when

All `learning-shell` sub-capabilities pass verification with evidence — not merely "item closed."

## Draft note

Scaffold from `5ab0a452` — refactor in place per `memory/implemented.md`.

## Plan

Dry run v2: [reviews/LJP-001-dry-run-v2.md](../../reviews/LJP-001-dry-run-v2.md)
