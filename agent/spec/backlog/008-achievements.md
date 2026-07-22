# LJP-008 — Achievements

```yaml
id: LJP-008
title: Achievements
priority: P2
status: pending
approval_required: true
blueprint: A
estimated_complexity: 4/10

dependencies:
  - LJP-001

contracts:
  screen: achievements
  components:
    - achievement_badge

emotion: Delight
cognitive_load_budget: gallery tier

acceptance:
  - definition_of_done
  - ui_questionnaire
  - design_review_checklist
  - architecture_review_board

verification_layers: all

files_expected:
  - src/app/(marketing)/learn/achievements/page.tsx
  - src/components/lms/achievements/achievement-grid.tsx
```

## Description

Achievements gallery per screen contract.

## Plan

_(Filled during Planning Mode)_

## Verification

_(reviews/LJP-008.md)_
