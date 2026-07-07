# LMS UI Audit
## Branch: `learnreformed`
## Status: **BLOCKED** — Architecture alignment required before visual fixes

---

## Audit phases

| Phase | Document | Status |
|-------|----------|--------|
| 0. Experience | `lms-spec/experience-principles.md`, `design-dna.md` | ✅ Spec complete |
| 0.5. Constraints | `anti-patterns.md`, `design-review-checklist.md` | ✅ Spec complete |
| 1. Architecture | Screen + Component contracts, Navigation Laws | ✅ Spec complete |
| 3.5. Engineering | `ljp-spec/*` | ✅ Spec complete |
| 2. Contract compliance | Implementation vs contracts | ❌ FAIL |
| 3. Visual + engineering verify | Questionnaire + DoD + tests | ❌ Not started |

**Do not commit implementation until Definition of Done passes for scoped feature.**

---

## Phase 2 — Contract compliance failures

### Screen-level

| Screen | Contract | Gap |
|--------|----------|-----|
| Course Detail | `course-detail.md` | No breadcrumb; hero not 60/40; modules default open |
| Lesson | `lesson.md` | Bottom nav visible; no sticky Continue; footer violates Law 13 |
| Home | `home.md` | Continue links to course not lesson (Law 1) |

### Component-level

| Component | Contract | Gap |
|-----------|----------|-----|
| Module Card | `module-card.md` | No accordion group (Law 5) |
| Trivia Popup | `trivia-popup.md` | Overlay dismiss allowed (Law 8) |
| Continue Button | `continue-button.md` | Not implemented |
| Course Hero | `course-hero.md` | Not extracted; wrong layout |
| Lesson Footer | — | Multiple competing actions |

### Navigation laws violated (implementation)

| Law | Violation |
|-----|-----------|
| 1 | Continue may require >2 taps |
| 5 | Multiple modules can stay open |
| 8 | Trivia dismissible without answer |
| 10 | Continue not gated / not sticky |
| 12 | Lesson shows bottom nav |
| 13 | Lesson footer has multiple primary-weight actions |

---

## Phase 3 — Visual acceptance (deferred)

See prior questionnaire answers in git history. Visual audit runs **after** Phase 2 remediation.

Key visual gaps (non-blocking until architecture passes):

- Primary CTA blue vs black
- Prose width
- Typography tokens

---

## Remediation order (architecture-driven)

1. Align **Lesson** screen to Blueprint D + `lesson.md` contract
2. Align **Course Detail** to Blueprint B + `course-detail.md`
3. Implement missing components per `component-inventory.md`
4. Re-run Architecture Review Board per screen
5. Run UI Questionnaire (Phase 3)

---

## Sign-off checklist

- [ ] All 9 screen contracts satisfied
- [ ] All component contracts for used components satisfied
- [ ] Navigation Laws 1–16 — zero violations
- [ ] Architecture Review Board — all pass
- [ ] UI Questionnaire — all 70 Yes
- [ ] Section 15 final acceptance — all Yes

**Merge blocked until all checked.**
