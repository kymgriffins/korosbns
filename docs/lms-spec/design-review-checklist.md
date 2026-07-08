# Design Review Checklist
## Learning Journey Platform — Pre-merge gate

Every pull request touching `/learn` or `src/components/lms` must answer **every question** below.

**Any fail → revise before merge.**  
**Any "Yes" to a removal question → remove it.**

Attach completed checklist to PR description or `docs/lms-ui-audit.md`.

---

## 1. Pattern & reuse

| # | Question | Pass |
|---|----------|------|
| 1.1 | Does this page introduce a **new visual pattern**? | No — or blueprint + DNA updated first |
| 1.2 | Could an **existing component** have solved this? | Yes — list component |
| 1.3 | Does this **duplicate** a component contract? | No |
| 1.4 | Does this create a **new spacing rule**? | No — tokens only |
| 1.5 | Does this create a **new color token**? | No — or justified in tokens file |

---

## 2. Design DNA

| # | Question | Pass |
|---|----------|------|
| 2.1 | Does this violate **Design DNA** personality (minimal, calm, confident)? | No |
| 2.2 | Does this feel **corporate, busy, or enterprise**? | No |
| 2.3 | Does this feel **Bootstrap or Material default**? | No |
| 2.4 | Is accent color used **more than once** per viewport? | No |

---

## 3. Cognitive load

| # | Question | Pass |
|---|----------|------|
| 3.1 | Does this **increase cognitive load** beyond screen budget? | No — cite `experience-principles.md` |
| 3.2 | Is there **more than one primary CTA** per viewport? | No |
| 3.3 | Does complexity **jump more than 1 level** in the journey? | No |
| 3.4 | Could **one section be removed entirely**? | If yes → remove it |
| 3.5 | Can **whitespace** solve this instead of another component? | If yes → use whitespace |

---

## 4. Content vs chrome

| # | Question | Pass |
|---|----------|------|
| 4.1 | Is there **more UI than content** on flow screens? | No — Fail if yes |
| 4.2 | Does the learner complete their task **faster** than before? | Yes or neutral |
| 4.3 | Would **Apple remove** something from this page? | If yes → remove it |
| 4.4 | Would **Notion add whitespace** here? | If yes → add it |

---

## 5. Navigation & architecture

| # | Question | Pass |
|---|----------|------|
| 5.1 | Does this violate any **navigation law**? | No — cite laws |
| 5.2 | Does this match the **layout blueprint**? | Yes — cite letter |
| 5.3 | Does screen **contract** exist and is it satisfied? | Yes |
| 5.4 | Does every new block have a **component contract**? | Yes |

---

## 6. Visual regression (brand identity)

| # | Question | Pass |
|---|----------|------|
| 6.1 | Could this screenshot be **confused with another product**? | No — Fail if yes |
| 6.2 | Recognizable **without the logo**? | Yes |
| 6.3 | Does the screenshot look like the **reference design language**? | Yes |
| 6.4 | Same **whitespace rhythm** as sibling screens? | Yes |
| 6.5 | Same **typography rhythm** as sibling screens? | Yes |
| 6.6 | Course/lesson hero has correct **visual dominance**? | Yes |

---

## 7. Anti-patterns

| # | Question | Pass |
|---|----------|------|
| 7.1 | Zero matches in `anti-patterns.md`? | Yes — Fail if any match |

---

## 8. Experience

| # | Question | Pass |
|---|----------|------|
| 8.1 | Screen evokes the **intended primary emotion**? | Yes — cite `experience-principles.md` |
| 8.2 | **Time-to-value** target met? | Yes |
| 8.3 | **Accessibility**: keyboard, focus, 44px targets, WCAG AA? | Yes |

---

## 9. Reference Experience RX-001

| # | Question | Pass |
|---|----------|------|
| 9.1 | **FT1** Recognizable as BNS Learn without logo? | Yes |
| 9.2 | **FT2** One action dominates? | Yes |
| 9.3 | **FT3** Layout breathes? | Yes |
| 9.4 | **FT4** Would removing an element improve it? | **No** (or removed) |
| 9.5 | **FT5** Would RX-001’s designer approve? | Yes |
| 9.6 | `visual-acceptance.yaml` + Experience Drift pass? | Yes — attach |
| 9.7 | Necessity test: any kept “merely different” component? | No |
| 9.8 | Marketplace patterns absent? | Yes |
| 9.9 | Civic Warmth / learner_feel for phase? | Yes |

### Critic (must try to reject — Gate 5)

Hostile review. Any No → revise before merge.

| # | Question | Pass |
|---|----------|------|
| C1 | Feel like RX-001 **without copying** it? | Yes |
| C2 | First-time citizen understands screen in **&lt;30s**? | Yes |
| C3 | Exactly **one** dominant action? | Yes |
| C4 | Would removing any element improve the screen? | **No** (or removed) |
| C5 | Preserves Budget Ndio Story Learn identity (not Moodle / LMS / Coursera)? | Yes |

Program: `ui-completion-roadmap.md` — Phase A screens before Phase B.

---

## 10. Acceptance questionnaire

| # | Question | Pass |
|---|----------|------|
| 10.1 | All **70 UI questionnaire** answers Yes? | Yes |
| 10.2 | Section 15 **final acceptance** all Yes? | Yes |

---

## Submission template

```md
## Design Review — [Screen / Feature]

### Reference
- RX-001 · VAS-001
- Journey phase feel: first_impression | during_learning | after_completion

### Family Test (all Yes / FT4 No-or-removed)
- FT1 … FT5

### Critic Gate 5 (all Yes / C4 No-or-removed)
- C1 … C5

### Experience Drift
- visual_noise: low
- competing_actions: ≤2
- cognitive_load: within_budget
- primary_focus: <3s
- civic_warmth: present

### Necessity
- No component kept that is merely different

### Checklist
All sections pass.
```

---

## Escalation

Unsatisfactory answer → **do not merge** → revise design → re-run full checklist.

Cosmetic polish on a failing checklist → **reject**.
