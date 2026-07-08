# CAP-004 Reference Composition
## Visual + interaction reference for Phase A

```yaml
id: REF-COMP-004
capability: CAP-course-detail
spec_id: LJP-004
alias: CAP-004
version: 1.0.0
date: 2026-07-08
status: promoted
role: reference_composition
platform_changes: 0
sic: docs/lms-spec/sic-cap-004-course-detail.md
review: agent/reviews/LJP-004.md
```

> Every Phase A screen must look at home **beside** Course Detail.  
> Builder rule: **compose**, do not redesign.

---

## Canonical building blocks (reference set)

| Name | Implementation | Role |
|------|----------------|------|
| ContentContainer | `shell/lms-page.tsx` → `LmsPage` | 1280 max width |
| SectionHeader | `LmsSection` / page `h2` + `LMS_TYPE.h3` | Editorial sections |
| JourneyBreadcrumb | `course/journey-breadcrumb.tsx` | Hub trail |
| JourneyHero | `course/course-hero.tsx` | 60/40 flagship |
| JourneyMeta | `course/journey-meta.tsx` | Time · difficulty · civic meta |
| DifficultyBadge | Badge + `course.difficulty` | Meta chip |
| ProgressBadge / ProgressBar | `progress-bar.tsx` | Meaningful progress (accent green on fill) |
| PrimaryButton | `.ljp-btn-primary` | Black CTA |
| LearningOutcome | `course/learning-outcomes.tsx` | Outcome rows |
| ModuleAccordion | `course/module-accordion.tsx` | Law 5 accordion |
| LoadingSkeleton | `course/course-detail-skeleton.tsx` | Calm loading |

---

## Phase A reuse declaration (required per capability)

Every CAP-005→007 review **must** include:

```yaml
reference_composition:
  source: REF-COMP-004
  reuses: []          # from reference set + approved library
  introduces: []      # ≤2 reusable components
  new_patterns: none  # must be none
  new_design_tokens: 0
  platform_changes: 0
  composition_reuse_pct: null  # target ≥80
```

Fail if `new_patterns ≠ none` or `platform_changes ≠ 0` or inventing parallel Progressive/CTA/nav models.

Also fail if capability introduces bespoke visual redesign after `VPS-001` pass.

---

## Phase A quality KPI

```yaml
phase_a_quality:
  platform_changes: 0
  interaction_patterns_added: 0
  design_tokens_added: 0
  reusable_component_ratio: ">= 80%"
  screens_using_reference_components: "100%"
```

---

## Inheritance rule (one sentence)

> The next screen must feel like it was **built from the Course Detail screen—not designed independently.**
