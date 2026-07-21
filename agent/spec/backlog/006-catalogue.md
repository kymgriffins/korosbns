# LJP-006 — Catalogue

```yaml
id: LJP-006
title: Catalogue
priority: P2
status: pending
approval_required: true
blueprint: A
estimated_complexity: 4/10

dependencies:
  - LJP-001

contracts:
  screen: catalogue
  components:
    - course_card

emotion: Discovery
cognitive_load_budget: browse tier

acceptance:
  - definition_of_done
  - ui_questionnaire
  - design_review_checklist
  - architecture_review_board

verification_layers: all

files_expected:
  - src/app/(marketing)/learn/catalogue/page.tsx
  - src/components/lms/catalogue/course-grid.tsx
```

## Description

Course catalogue grid per screen contract. Refactor draft to contract compliance.

## Plan

_(Filled during Planning Mode)_

## Verification

_(reviews/LJP-006.md)_
