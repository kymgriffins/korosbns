# LJP-010 — Search

```yaml
id: LJP-010
title: Search
priority: P2
status: pending
approval_required: true
blueprint: E
estimated_complexity: 5/10

dependencies:
  - LJP-001

contracts:
  screen: search
  components:
    - course_card

emotion: Utility
cognitive_load_budget: search tier

acceptance:
  - definition_of_done
  - ui_questionnaire
  - design_review_checklist
  - architecture_review_board

verification_layers: all

files_expected:
  - src/app/(marketing)/learn/search/page.tsx
  - src/components/lms/search/search-results.tsx
```

## Description

Search (Blueprint E) per screen contract. URL-driven query state.

## Plan

_(Filled during Planning Mode)_

## Verification

_(reviews/LJP-010.md)_
