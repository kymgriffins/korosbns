# Autonomous Verification
## 9 layers — ALL must PASS to continue

Run in order. Stop on first FAIL. Fix → re-run from failed layer.

---

## Layer 1 — Compilation

```bash
pnpm exec tsc --noEmit
```

| Pass | Fail action |
|------|-------------|
| Exit 0 | — |
| Errors | Fix types before any other layer |

---

## Layer 2 — Lint

```bash
# Read lints for changed files in IDE
# Or project lint script if configured
```

| Pass | Fail action |
|------|-------------|
| No new errors in changed files | Fix |

---

## Layer 3 — Tests

```bash
pnpm test
# Scoped: pnpm test src/components/lms src/data/lms
```

| Pass | Fail action |
|------|-------------|
| All tests pass | Add/fix per testing-strategy.md |

---

## Layer 4 — Accessibility

Checklist from `docs/ljp-spec/accessibility-contract.md`:

- [ ] Keyboard walkthrough documented
- [ ] Focus order = visual order
- [ ] Trivia: focus trap, no escape dismiss
- [ ] Touch targets ≥ 44px
- [ ] `prefers-reduced-motion` honored

| Pass | Fail action |
|------|-------------|
| All checked | Accessibility Mode fixes |

---

## Layer 5 — Performance

Vs `docs/ljp-spec/performance-budget.md`:

- [ ] No full-page `"use client"` without justification
- [ ] Images use `next/image` + sizes
- [ ] No new heavy imports in server pages
- [ ] Spot-check Lighthouse mobile (manual until CI)

---

## Layer 6 — Design

`docs/lms-spec/design-review-checklist.md` — all sections (incl. §9 RX-001).

`docs/lms-spec/visual-acceptance.yaml` — Critic VAS-001.

`docs/lms-spec/reference-experience-rx-001.md` — family test.

Plus:

- [ ] Zero `anti-patterns.md` matches
- [ ] Cognitive load budget not exceeded
- [ ] Primary emotion achieved
- [ ] RX-001 Family Test FT1–FT5 all pass (FT4: remove if would improve)
- [ ] Critic Gate 5 (C1–C5) — hostile reject attempt; all pass
- [ ] Experience Drift block pass (noise, ≤2 actions, focus <3s, civic warmth, learner_feel)
- [ ] Necessity test: no kept “merely different” components
- [ ] Marketplace LMS patterns absent (not Moodle / generic LMS / Coursera clone)
- [ ] Civic Warmth where user-facing copy appears
- [ ] OSS rule: no new interaction without ADR
- [ ] Phase A before Phase B per `ui-completion-roadmap.md`
- [ ] Pixel Discipline — all values from tokens or SIC (no invented px)
- [ ] CAP-004: `sic-cap-004-course-detail.md` satisfaction matrix when touching Course Detail

---

## Layer 7 — Architecture

`docs/architecture-review-board.md` A1–A10, C1–C4, W1–W5.

Plus:

- [ ] Navigation laws cited — zero violations
- [ ] Layout blueprint letter matches
- [ ] Screen + component contracts satisfied

---

## Layer 8 — Questionnaire

`docs/ui-acceptance-questionnaire.md` — 70/70 Yes for visual-complete items.

Draft scaffold items: mark N/A with reason.

---

## Layer 9 — Definition of Done

`docs/ljp-spec/definition-of-done.md` — every checkbox for scoped item.

---

## Report template

```yaml
verification:
  item: LJP-001
  date: 2026-07-07
  layers:
    compilation: PASS
    lint: PASS
    tests: PASS
    accessibility: PASS
    performance: PASS
    design: PASS
    architecture: PASS
    questionnaire: PASS | N/A (shell only)
    definition_of_done: PASS
  overall: PASS | FAIL
  failed_layer: null | 6
  required_action: null | "Fix CTA color"
```

Save to `reviews/[item-id].md`.

---

## Orchestrator rule

```
overall != PASS → workflow step verify.all FAIL → no commit → no next backlog item
```
