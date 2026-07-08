# Retrospective: CAP-course-detail — LJP-004

```yaml
capability: CAP-course-detail
spec_id: LJP-004
date: 2026-07-08
owners: [Historian, Librarian]
required_before: capability_complete
platform_changes: 0
constitution_exceptions: 0
promoted_to: reference_composition
reference: docs/lms-spec/reference-composition-cap-004.md
```

---

## What surprised us?

- Closing CAP-004 against a frozen SIC removed “taste” debates — Builder asked only what the contract specified.
- Sticky mobile CTA + bottom nav clearance needed an explicit compose of the lesson ContinueButton pattern, not a new interaction.
- Repo-wide `tsc` noise (`.next/types` monorepo) is environmental — not a constitution signal.

---

## Specification gaps?

| Gap | Severity | Librarian action |
|-----|----------|------------------|
| Progress fill accent lived on theme `Progress` (primary), not civic success green | low | Product: ProgressBar owns indicator accent — see decision below |
| Optional meta (citizens/certificate) needed typed fields on `LmsCourse` | low | Product types extended — no ADR |
| Reuse declaration not required on first flagship | medium | Added REF-COMP-004 + required YAML for CAP-005→007 |

---

## Engineering gaps?

- Full-repo lint script absent (`pnpm lint` N/A) — verification used scoped typecheck + vitest + `pnpm build`.
- Unrelated dirty working tree remains; isolate before CAP-005 implementation commits.

---

## Tests missing?

- Helper unit tests present (`cap-004-helpers`). Browser sticky/safe-area still human walkthrough.
- No component DOM tests for IntersectionObserver sticky — acceptable for v1; e2e optional later.

---

## Contract updates?

```yaml
proposed_bumps: []
adr_required: []
knowledge_updates:
  - docs/lms-spec/reference-composition-cap-004.md
  - docs/lms-spec/sic-cap-005-home.md
  - phase_a_quality KPI
```

---

## Anti-pattern additions?

- Designing Phase A screens independently of REF-COMP-004.
- Introducing a second Progress visual language beside ProgressBar.

---

## Future optimizations?

- Optional visual regression snapshot of Course Detail as golden master.
- Extract DifficultyBadge as named export if CAP-005/006 duplicate badge wiring.

---

## ProgressBar accent — decision

```yaml
decision: progress_bar_owns_success_fill
rationale: >
  SIC requires accent green only for meaningful progress.
  Do not recolor global shadcn Progress (admin/marketing).
  ProgressBar (Learn) sets indicator to LMS success token.
platform_changes: 0
```

---

## Outcomes

```yaml
spec_amendments: none_constitutional
runtime_learnings:
  - CAP-004 validated platform (platform_changes: 0)
  - Flagship UI → Reference Composition promotion
promotion_impact: validates_product_delivery_under_freeze
phase_a_next: CAP-005 composed inheritance
```
