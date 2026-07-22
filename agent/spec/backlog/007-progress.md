# LJP-007 — Progress

```yaml
id: LJP-007
title: Progress hub
priority: P2
status: pending
approval_required: true
blueprint: A
estimated_complexity: 5/10

dependencies:
  - LJP-001

contracts:
  screen: progress
  components:
    - progress_bar
    - course_card

emotion: Achievement
cognitive_load_budget: stats tier

acceptance:
  - definition_of_done
  - ui_questionnaire
  - design_review_checklist
  - architecture_review_board

verification_layers: all

files_expected:
  - src/app/(marketing)/learn/progress/page.tsx
  - src/components/lms/progress/progress-summary.tsx
```

## Description

Progress hub per screen contract. Wire to domain progress helpers.

## Plan

_(Filled during Planning Mode)_

## Verification

_(reviews/LJP-007.md)_
