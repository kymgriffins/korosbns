# Specification Dry Run — LJP-001 Learning Shell

```yaml
type: dry_run
item: LJP-001
date: 2026-07-07
code_generated: false
scheduler:
  dry_run: true
  result: PASS_WITH_APPROVAL_GATE
aggregate_confidence: 91
risk: critical
human_approval_required: true
spec_ambiguity: none_blocking
```

---

## 1. Specifications loaded

| ID | Path | Status |
|----|------|--------|
| experience | `docs/lms-spec/experience-principles.md` | ✓ |
| design_dna | `docs/lms-spec/design-dna.md` | ✓ |
| anti_patterns | `docs/lms-spec/anti-patterns.md` | ✓ |
| navigation_laws | `docs/navigation-laws.md` | ✓ |
| engineering | `docs/ljp-spec/engineering-principles.md` | ✓ |
| frontend_arch | `docs/ljp-spec/frontend-architecture.md` | ✓ |
| motion | `docs/ljp-spec/motion-guidelines.md` | ✓ |
| a11y | `docs/ljp-spec/accessibility-contract.md` | ✓ |
| performance | `docs/ljp-spec/performance-budget.md` | ✓ |
| error_handling | `docs/ljp-spec/error-handling.md` | ✓ |
| definition_of_done | `docs/ljp-spec/definition-of-done.md` | ✓ |
| lms_shell_contract | `docs/component-contracts/lms-shell.md` | ✓ |
| roadmap | `docs/ljp-spec/implementation-roadmap.md` Phase B | ✓ |
| memory | `agent/memory/implemented.md` | ✓ |
| manifest | `agent/manifest.md` | ✓ |

**Screen contract:** N/A (infrastructure item)

---

## 2. Dependencies resolved

```yaml
depends_on: []
blocked_by: []
graph_node: LearningShell
critical_path: true
dependencies: complete  # no upstream items
```

All downstream items (LJP-002–010) blocked until LJP-001 `completed: true`.

---

## 3. Reusable components (memory)

| Component | Path | Status | Action | Confidence |
|-----------|------|--------|--------|------------|
| LmsShell | `lms-shell.tsx` | draft | **Refactor** → LearningShell composer | 94% |
| LmsTopNav / LmsBottomNav | `lms-nav.tsx` | draft | **Split** to `shell/lms-top-nav.tsx`, `shell/lms-bottom-nav.tsx` | 92% |
| MobileBottomNav | `ui/mobile-bottom-nav.tsx` | released | **Reuse** — do not fork | 96% |
| learn-nav helpers | `lib/learn-nav.ts` | released | **Reuse** | 98% |
| resolveShellMode | `shell/types.ts` | draft | **Wire** into layout | 92% |
| LmsPage | `lms-page.tsx` | draft | **Move** to `shell/lms-page.tsx` | 90% |
| LmsProviders | `providers/lms-providers.tsx` | draft | **Complete** — MotionConfig + reduced motion | 86% |
| LmsErrorBoundary | `providers/lms-error-boundary.tsx` | draft | **Complete** per error-handling.md | 88% |
| lms.css | `styles/lms.css` | draft | **Extend** — ensure nav tokens | 87% |

**Create (not in codebase):**

| Component | Confidence | Reason |
|-----------|------------|--------|
| LmsToastLayer | 85% | Roadmap item 7 — Sonner scoped to learn |
| LmsDialogLayer | 82% | Roadmap item 8 — v2 portal stub acceptable |
| LmsBottomSheetLayer | 88% | Trivia host portal — required by roadmap |

**Rejected decisions:**

| Action | Confidence | Reason |
|--------|------------|--------|
| Create LessonSidebar | 8% | Violates Navigation Laws — **blocked** |
| New parallel shell | 12% | memory has draft — refactor only |

---

## 4. Implementation plan (Planner output)

### Scope

Complete Phase B shell. **No** lesson/course/home content changes.

### Build sequence

```
1. LmsProviders       — Motion + reduced-motion provider
2. LmsErrorBoundary   — wrap learn layout children
3. shell/learning-shell.tsx  — compose layers from SHELL_LAYERS_BY_MODE
4. shell/lms-top-nav.tsx   — extract from lms-nav.tsx
5. shell/lms-bottom-nav.tsx — extract from lms-nav.tsx
6. shell/lms-page.tsx      — move/refine LmsPage
7. shell/lms-toast-layer.tsx
8. shell/lms-dialog-layer.tsx (stub portal)
9. shell/lms-bottom-sheet-layer.tsx (portal target)
10. learn/layout.tsx  — LmsProviders → ErrorBoundary → resolveShellMode → LearningShell
11. lms.css           — --mobile-nav-height, learn-scoped tokens
12. Deprecate imports from old lms-shell.tsx / lms-nav.tsx paths (re-export or delete)
```

### File map

| Action | Path |
|--------|------|
| Modify | `src/app/(marketing)/learn/layout.tsx` |
| Refactor | `src/components/lms/lms-shell.tsx` → `shell/learning-shell.tsx` |
| Split | `src/components/lms/lms-nav.tsx` → `shell/lms-top-nav.tsx`, `shell/lms-bottom-nav.tsx` |
| Move | `src/components/lms/lms-page.tsx` → `shell/lms-page.tsx` |
| Complete | `src/components/lms/providers/lms-providers.tsx` |
| Complete | `src/components/lms/providers/lms-error-boundary.tsx` |
| Create | `src/components/lms/shell/lms-toast-layer.tsx` |
| Create | `src/components/lms/shell/lms-dialog-layer.tsx` |
| Create | `src/components/lms/shell/lms-bottom-sheet-layer.tsx` |
| Modify | `src/styles/lms.css` |
| Test | `src/components/lms/shell/__tests__/resolve-shell-mode.test.ts` |

### Known gaps to fix during build

1. **Layout does not pass `immersive`** — `layout.tsx` wraps all non-account routes in `<LmsShell>` without `resolveShellMode`; lesson routes will show bottom nav (Law 12 violation).
2. **Desktop nav active state uses `primary` blue** — should align with learn token scope in `lms.css`.
3. **Duplicate desktop links** — "Courses" and "Discover" both point to catalogue; verify against `screen-inventory` / IA (minor — flag for Critic).
4. **LmsDialogLayer v2** — stub acceptable for shell Done; full dialog system not blocking.

---

## 5. Mock architecture review (Guardian)

| Check | Result | Notes |
|-------|--------|-------|
| Navigation Law 2 (no sidebar) | PASS | No sidebar proposed |
| Navigation Law 3 (5 bottom items) | PASS | 5 items in LmsBottomNav |
| Navigation Law 12 (lesson immersive) | **FAIL (current)** → PASS after plan | Fix layout wiring |
| Navigation Law 14 (account bypass) | PASS | isAccount / account mode preserved |
| Navigation Law 15 | PASS | Top + bottom pattern maintained |
| lms-shell contract | PASS (after plan) | Variants hub/immersive/account |
| Anti-patterns | PASS | No sidebar, no sixth nav item |
| ARB file placement | PASS | shell/ folder per frontend-architecture |
| E9 use client justification | PASS | Shell is client boundary — documented |

**Architecture mock:** PASS contingent on layout immersive wiring.

---

## 6. Mock Definition of Done (Verifier)

### Applicable sections for shell-only item

| Section | Mock result | Notes |
|---------|-------------|-------|
| 1 Experience | N/A partial | Emotion "Orientation" — chrome only |
| 2 Design | PASS (shell) | No questionnaire — visual feature N/A |
| 3 Engineering | PASS (planned) | Tests for resolveShellMode; tsc + test |
| 4 Process | PENDING | lms-ui-audit update after implementation |
| 5 Product identity | PASS | Shell does not add chrome to flow screens |

### Shell-specific Done criteria (roadmap)

| Criterion | Mock |
|-----------|------|
| Hub route empty shell + nav | PASS (planned) |
| Lesson bottom nav hidden | PASS (planned — layout fix) |
| Account excluded | PASS (existing + account mode) |
| Performance budget shell-only | PASS (planned — verify) |
| a11y landmarks + focus | PASS (planned — nav aria-labels exist) |

**DoD mock:** PASS at `ready` stage after implementation; not `released` until commit.

---

## 7. Human approval gates

| Gate | Triggered | Question |
|------|-----------|----------|
| Q-H1 (new reusable component) | **NO** | Toast/sheet layers are shell infrastructure per roadmap — not new Stage-2 feature components |
| Q-SPEC-CONFLICT | **NO** | No spec conflicts detected |
| Q-H3 (new motion) | **NO** | Uses `navBottomEnter` from existing motion-guidelines |
| Q-H4 (reuse vs create) | **NO** | Clear refactor path — 94% confidence |
| **Item approval gate** | **YES** | `approval_required: true` on LJP-001 |
| **Risk gate** | **YES** | Risk `critical` — touches shell, nav, layout, theme |

### Required human decision

```md
LJP-001 Learning Shell — Dry run complete.

Risk: CRITICAL (shell + navigation + layout root)
Confidence: 91%
Spec ambiguity: None blocking

Approve implementation plan?
YES / NO / REVISE
```

---

## 8. Risk & confidence summary

```yaml
risk:
  level: critical
  score: 165
  needs_approval: true
  touches:
    - learn/layout.tsx
    - lms-shell.tsx
    - lms-nav.tsx
    - shell/*
    - lms.css

confidence:
  aggregate: 91
  lowest_decision: 78  # desktop nav color alignment
  blocked_decisions: 0

change_impact:
  routes_affected: all /learn/*
  downstream_blocked: LJP-002 through LJP-010
  safe_to_proceed: true
```

---

## 9. Execution sequence (post-approval)

```yaml
sequence:
  1: { responsibility: Builder, action: implement plan steps 1-12 }
  2: { responsibility: Verifier, action: layer 3 tests }
  3: { responsibility: Guardian, action: layer 4 a11y + layer 7 architecture }
  4: { responsibility: Optimizer, action: layer 5 performance spot-check }
  5: { responsibility: Critic, action: adversarial design review }
  6: { responsibility: Reviewer, action: layers 6-9 + review doc }
  7: { responsibility: Historian, action: memory + state.yaml completed }
  8: { responsibility: Reporter, action: human summary }
  9: { release_stage: ready → released, action: commit feat(lms) }

parallel_after_complete:
  - LJP-002  # critical path
  - LJP-004, LJP-006, LJP-008, LJP-009, LJP-010  # parallel wave
```

---

## 10. Spec maturity verdict

```yaml
verdict: MATURE_ENOUGH
ambiguous_assumptions: 0
invented_requirements: 0
blocking_gaps: 0
notes:
  - Desktop nav duplicate links should be confirmed against IA during build (low risk)
  - LmsDialogLayer stub scope acceptable per roadmap v2 note
recommendation: APPROVE plan → begin Builder on LJP-001
```

---

## Question checkpoint (dry run)

### Before
- Q-B1: No requirement drift — PASS
- Q-B2: Component contract complete — PASS
- Q-B3: Reuse plan documented — PASS
- Q-B4: No spec amendments required — PASS
- Q-B5: No domain logic in this item — PASS
- Q-B6: Dependencies done — PASS (none)
- Q-B7: Mode = dry_run/planning — PASS

### Human
- **Item approval gate: WAITING**
