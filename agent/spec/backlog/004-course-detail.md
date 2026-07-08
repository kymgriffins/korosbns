# LJP-004 — Course Detail (Blueprint B)

```yaml
id: LJP-004
alias: CAP-004
title: Course detail — UI reference implementation
priority: P0
status: in_progress
approval_required: true
blueprint: B
ui_role: reference_implementation
estimated_complexity: 8/10
sic: docs/lms-spec/sic-cap-004-course-detail.md
pixel_discipline: required

dependencies:
  - LJP-001

contracts:
  screen: course_detail
  sic: sic-cap-004
  components:
    - journey_hero
    - journey_meta
    - module_accordion
    - learning_outcome
    - primary_button

emotion: Confidence
cognitive_load_budget: course tier

acceptance:
  - sic_cap_004_matrix
  - definition_of_done
  - design_review_checklist
  - critic_c1_c5
  - visual_acceptance
  - architecture_review_board

verification_layers: all

files_expected:
  - src/app/(marketing)/learn/courses/[courseSlug]/page.tsx
  - src/components/lms/course/course-hero.tsx
  - src/components/lms/course/module-accordion.tsx
  - src/components/lms/course/journey-meta.tsx
  - src/components/lms/course/learning-outcomes.tsx
  - src/components/lms/course/course-detail-skeleton.tsx
```

## Description

**UI reference implementation** for Budget Ndio Story Learn. Lesson proves runtime; Course Detail proves the product.

Build only against [`sic-cap-004-course-detail.md`](../../../docs/lms-spec/sic-cap-004-course-detail.md).

## Plan

1. SIC frozen (done).
2. Close §17 gaps: hero cleanup · outcomes · sticky CTA · collapsed requirements · auto-expand · skeleton · optional meta fields.
3. Tests + Critic + ledger → `complete`.
4. Phase A screens must reuse these patterns (inheritance rule).

## Verification

_(agent/reviews/LJP-004.md — not started)_
