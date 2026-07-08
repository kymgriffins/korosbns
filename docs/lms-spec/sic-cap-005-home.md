# CAP-005 Screen Implementation Contract
## Home / Continue — compose from REF-COMP-004

```yaml
id: SIC-CAP-005
capability: CAP-home-continue
spec_id: LJP-005
alias: CAP-005
version: 1.0.0
date: 2026-07-08
status: frozen_for_build
layer: product_continuous
platform_changes: 0
parent_reference: docs/lms-spec/reference-composition-cap-004.md
guiding_rule: >
  The Home screen must feel like it was built from the Course Detail
  screen—not designed independently.
pixel_discipline: required
```

---

## Reference composition (mandatory)

```yaml
reference_composition:
  source: REF-COMP-004
  reuses:
    - ContentContainer   # LmsPage
    - SectionHeader      # LmsSection / h2 LMS_TYPE.h3
    - PrimaryButton      # .ljp-btn-primary
    - ProgressBadge      # ProgressBar (shared accent fill)
    - DifficultyBadge    # Badge pattern from JourneyMeta / hero
    - JourneyMeta        # optional compact meta on ContinueCard
  introduces:
    - ContinueCard       # dominant resume card (allowed ≤2)
    - JourneyCard        # catalogue/home card — only if not already productized
  new_patterns: none
  new_design_tokens: 0
  platform_changes: 0
  composition_reuse_target_pct: 80
```

**Reuse budget**

| Metric | Target |
|--------|--------|
| Existing components reused | ≥80% |
| New reusable components introduced | ≤2 |
| New interaction patterns | 0 |
| New design tokens | 0 |
| Platform changes | 0 |

If ContinueCard + JourneyCard exist, **introduces: []** — evolve in place.

---

## Purpose

> Resume learning within **5 seconds**.

Emotion: **Momentum** · Max decisions: **2** · One dominant CTA: **Continue**

---

## Composition (RX-001 / roadmap)

```
Budget Ndio Story Learn

Continue Learning
─────────────────
ContinueCard          ← one dominant
  title / meta / ProgressBar / PrimaryButton → lesson (runtime)

Recommended Journeys
─────────────────
JourneyCard × ≤3

Achievements / Recent   ← light only; no analytics widgets
```

**Forbidden:** dashboard widgets, chart strips, dual CTAs competing with Continue, sidebar.

---

## ContinueCard (introduces)

| Concern | Spec |
|---------|------|
| Source | Runtime `resolveContinueLesson` / `resolveActiveCourse` |
| CTA copy | Continue Learning · Start Journey · Review (same as CAP-004) |
| Layout | Editorial card · radius **24** · one elevation |
| Progress | Shared `ProgressBar` (success accent on fill) |
| Link | **Lesson** URL — not course (Law 1 / runtime) |
| Sticky | **No** on Home (hero continue is on-page) |

Do **not** embed JourneyHero 60/40 on Home — that is Course Detail’s flagship; Home uses ContinueCard as the resume surface.

---

## Typography / spacing

Inherit CAP-004 tokens only. Section titles `LMS_TYPE.h3`. Gaps `24`/`32`/`48`. Page `LmsPage`.

---

## Acceptance

```
□ Feels built from Course Detail (Critic + Family Test)
□ reference_composition block complete
□ reuse ≥80% · introduces ≤2 · new_patterns: none · tokens: 0 · platform_changes: 0
□ Resume ≤5s · one Continue CTA
□ VAS + Experience Drift
□ Tests: continue href → lesson; empty enrolled state omit/soft
□ Critic C1–C5 PASS
```

---

## Related

| Doc | Role |
|-----|------|
| `reference-composition-cap-004.md` | Inheritance source |
| `sic-cap-004-course-detail.md` | Pixel + component law |
| `ui-completion-roadmap.md` | Phase A order |
| `screen-contracts/home.md` | Behavioral contract |
