# LJP-005 — Home Continue (compose from REF-COMP-004)

```yaml
id: LJP-005
alias: CAP-005
title: Home continue — composed inheritance
priority: P0
status: in_progress
approval_required: true
blueprint: A
ui_role: composed_from_reference
estimated_complexity: 5/10
sic: docs/lms-spec/sic-cap-005-home.md
reference_composition: docs/lms-spec/reference-composition-cap-004.md
pixel_discipline: required
platform_changes: 0

dependencies:
  - LJP-003
  - LJP-004

contracts:
  screen: home
  sic: sic-cap-005
  components:
    - continue_card
    - journey_card
    - progress_bar
    - primary_button

emotion: Momentum
cognitive_load_budget: home tier

acceptance:
  - sic_cap_005
  - reference_composition_yaml
  - reuse_budget_ge_80
  - critic_c1_c5
  - phase_a_quality_kpi

verification_layers: all

files_expected:
  - src/app/(marketing)/learn/page.tsx
  - src/components/lms/home/continue-card.tsx
```

## Implementation rule

> The Home screen must feel like it was built from the Course Detail screen—not designed independently.

## Reference composition

```yaml
reference_composition:
  source: REF-COMP-004
  reuses:
    - ContentContainer
    - SectionHeader
    - PrimaryButton
    - ProgressBadge
    - DifficultyBadge
    - JourneyMeta
  introduces:
    - ContinueCard
    - JourneyCard
  new_patterns: none
  new_design_tokens: 0
  platform_changes: 0
```

## Plan

1. Align ContinueCard to PrimaryButton + ProgressBar (REF-COMP-004) — remove primary-purple text accents.
2. Compose Home page per SIC-CAP-005 — one Continue · ≤3 JourneyCards · light achievements.
3. Critic + reuse budget evidence → ledger complete.

## Verification

_(agent/reviews/LJP-005.md — not started)_
