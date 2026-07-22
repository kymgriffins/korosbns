# LJP-009 — Profile

```yaml
id: LJP-009
title: Profile
priority: P2
status: pending
approval_required: true
blueprint: A
estimated_complexity: 4/10

dependencies:
  - LJP-001

contracts:
  screen: profile
  components: []

emotion: Identity
cognitive_load_budget: settings tier

acceptance:
  - definition_of_done
  - ui_questionnaire
  - design_review_checklist
  - architecture_review_board

verification_layers: all

files_expected:
  - src/app/(marketing)/learn/profile/page.tsx
  - src/components/lms/profile/profile-header.tsx
```

## Description

Learner profile per screen contract. Account auth routes remain separate under `/learn/account/*`.

## Plan

_(Filled during Planning Mode)_

## Verification

_(reviews/LJP-009.md)_
