# Specification Dry Run v2 — LJP-001 learning-shell
## SDP 2.1 execution model — no code generated

```yaml
type: dry_run_v2
capability: learning-shell
spec_id: LJP-001
date: 2026-07-07
code_generated: false
execution_lock: false
runtime_stage: draft
user_decision_prior: REVISE  # execution model strengthened
verdict: READY_FOR_APPROVAL
aggregate_confidence: 91
risk: critical
```

---

## Revisions applied

| # | Revision | Status |
|---|----------|--------|
| 1 | spec/ vs runtime/ split | ✓ |
| 2 | Capability gates (13 sub-capabilities) | ✓ |
| 3 | Execution lock (locks.yaml) | ✓ |
| 4 | Contract versioning (versions.yaml) | ✓ |
| 5 | Evidence-backed reviews | ✓ |
| 6 | Critic merge-blocking mandate | ✓ |
| 7 | Learning loop / retrospective | ✓ |
| 8 | Runtime promotion draft→validated | ✓ |
| + | Dependency Analyst | ✓ |

---

## 1. Spec loaded (immutable)

From `agent/spec/backlog/001-learning-shell.md` + `spec/capabilities.yaml`  
State read from `runtime/state.yaml` only.

---

## 2. Capability gate map

`learning-shell` completes only when **all** pass with evidence:

| Sub-capability | Contract | Build action |
|----------------|----------|--------------|
| providers | lms_shell@1.0.0 | Complete LmsProviders stub |
| error_boundary | error_handling@1.0.0 | Complete LmsErrorBoundary |
| top_navigation | lms_shell@1.0.0 | Extract from lms-nav.tsx |
| bottom_navigation | lms_shell@1.0.0 | Extract; 5 items Law 3 |
| page_container | lms_shell@1.0.0 | shell/lms-page.tsx |
| learning_shell_composer | lms_shell@1.0.0 | SHELL_LAYERS_BY_MODE |
| toasts | lms_shell@1.0.0 | LmsToastLayer create |
| dialogs | lms_shell@1.0.0 | LmsDialogLayer stub |
| bottom_sheets | lms_shell@1.0.0 | Portal target for trivia |
| theme | lms_design_tokens@1.0.0 | lms.css learn scope |
| motion | motion_guidelines@1.0.0 | navBottomEnter + reduced motion |
| accessibility | accessibility_contract@1.0.0 | Landmarks, focus, aria-current |
| layout_integration | lms_shell@1.0.0 | resolveShellMode in layout |

---

## 3. Dependency Analyst — blast radius

```yaml
target: LearningShell
coupling_score: high  # foundation node
breaks_if_changed:
  routes: all /learn/* (9+ pages)
  capabilities: LJP-002 through LJP-010
  components: [LmsPage, all hub pages via layout]
  shared_primitives: [MobileBottomNav — read only]
cycles: none
refactor_before_debt:
  - Split lms-nav monolith before adding features
  - Bind contract versions on complete
recommendation: APPROVE shell refactor — do not parallel implementation
```

---

## 4. Reuse plan (unchanged from v1)

| Target | Confidence | Action |
|--------|------------|--------|
| lms-shell.tsx | 94% | Refactor → learning-shell.tsx |
| lms-nav.tsx | 92% | Split top/bottom |
| MobileBottomNav | 96% | Reuse |
| resolveShellMode | 92% | Wire to layout |
| LmsDialogLayer | 82% | Create stub |

---

## 5. Critic — pre-build adversarial review

```yaml
merge_recommendation: CONDITIONAL  # plan only; not implementation yet
weakest_decision: "Monolithic lms-nav split mid-refactor — risk of broken active states"
likely_debt: "LmsDialogLayer stub may linger past v2 if not tracked in retrospective"
future_break_risk: "Lesson immersive mode if layout_integration sub-capability skipped"
premature_abstraction: "None identified — shell layers match roadmap"
simpler_alternative: "Could defer dialog layer entirely — but capabilities.yaml requires stub"
unable_to_find_issues: false
conditions_for_approve:
  - layout_integration evidence must cite Law 12 file:line
  - each sub-capability evidence before capability complete
```

---

## 6. Mock evidence-backed architecture (Guardian)

```yaml
result: PASS
evidence:
  - "Navigation Law 3: 5 bottom items in LmsBottomNav plan"
  - "Navigation Law 12: layout_integration sub-capability wires resolveShellMode"
  - "Navigation Law 14: account bypass preserved in SHELL_LAYERS_BY_MODE.account"
  - "lms-shell@1.0.0 hub/immersive/account variants in shell/types.ts"
  - "No sidebar — anti-patterns.md AP-01 clear"
```

---

## 7. Execution lock plan

On human **YES**:

```yaml
locks.yaml:
  execution_lock.active: true
  capability: learning-shell
frozen: design_dna, navigation_laws, engineering_principles
builder_may_edit: src/ only
```

Unlock after: all sub-capabilities pass + retrospective filed.

---

## 8. Human gates

| Gate | Triggered |
|------|-----------|
| Q-H1 new component | NO |
| Q-SPEC-CONFLICT | NO |
| Risk critical | YES — approval required |
| Item approval | YES |
| Runtime commit | NO — wait for validated promotion |

---

## 9. Post-capability sequence

```
Builder (13 sub-caps, lock ON)
→ Verifier per sub-cap
→ Guardian evidence
→ Critic merge verdict
→ Reviewer evidence audit
→ Historian: memory implements[] bindings
→ Retrospective (Historian + Librarian)
→ drift scan
→ IF all pass: runtime_stage → validated → commit allowed
→ queue: lesson-domain + parallel wave
```

---

## 10. Verdict

```yaml
spec_maturity: MATURE
execution_model: SDP_2.1_READY
blocking_ambiguity: 0
invented_requirements: 0
recommendation: APPROVE LJP-001 → enable execution_lock → Builder begins
runtime_commit: DEFER until validated
```

---

## Approval

```md
LJP-001 learning-shell — Dry run v2 complete (SDP 2.1).

Risk: CRITICAL | Confidence: 91% | 13 sub-capability gates

Approve Builder start?
YES / NO / REVISE
```
