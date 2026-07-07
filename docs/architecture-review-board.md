# Architecture Review Board
## Pre-merge checklist for LMS changes

Before any pull request touching `/learn` or `src/components/lms` is accepted, the author (human or AI) must answer every question below.

**Any unsatisfactory answer → revise before merge.**

---

## Architecture review

| # | Question | Pass criteria |
|---|----------|---------------|
| A1 | Does this screen introduce a **new navigation pattern**? | No — or blueprint updated first |
| A2 | Does it violate any **navigation law**? | No — cite laws if edge case |
| A3 | Does it introduce a **new spacing rule**? | No — use `lms-design-tokens` |
| A4 | Does it create a **new color token**? | No — or tokens file updated with justification |
| A5 | Does it **duplicate** an existing component? | No — reuse or extend variant |
| A6 | Could an **existing component** be reused? | Yes — list component used |
| A7 | Does this screen **increase cognitive load**? | No — progressive disclosure applied |
| A8 | Is there **more than one primary CTA** per viewport? | No |
| A9 | Is any information **progressively disclosable** but currently always visible? | Moved to collapsed/accordion |
| A10 | Does the screen match its **layout blueprint**? | Yes — cite blueprint letter |

---

## Contract review

| # | Question | Pass criteria |
|---|----------|---------------|
| C1 | Does a **screen contract** exist for this route? | Yes — `docs/screen-contracts/` |
| C2 | Does every new UI block map to a **component contract**? | Yes |
| C3 | Were **entry/exit points** defined before build? | Yes |
| C4 | Are **empty, loading, error** states specified? | Yes — or N/A documented |

---

## UX reasoning (hard questions)

| # | Question | Required answer format |
|---|----------|------------------------|
| W1 | **Why** does this screen have this CTA? | One sentence tied to user goal |
| W2 | **Why** is this information positioned here? | Reference information hierarchy |
| W3 | **How** does the learner leave without losing progress? | Cite Law 11 |
| W4 | **What** is the one thing the learner should do next? | Single verb |
| W5 | **Why** is the module list above/below the lesson? | Cite IA tier rules |

---

## Visual acceptance (after architecture passes)

| # | Question | Pass |
|---|----------|------|
| V1 | All 70 UI questionnaire answers Yes? | |
| V2 | Section 15 final acceptance all Yes? | |
| V3 | `design-review-checklist.md` all pass? | |
| V4 | `lms-ui-audit.md` updated? | |

---

## Submission template

```md
## Architecture Review — [Screen/Feature name]

### Blueprint
Course Detail — Blueprint B

### Navigation laws
Complies with Laws 1, 2, 4, 5, 13

### W1 — Why this CTA?
[answer]

### Components reused
- ModuleCard
- CourseHero

### New components
None

### A1–A10
[all pass]

### Visual audit
Deferred / Pass — link to lms-ui-audit.md
```

---

## Escalation

If a feature **cannot** comply without a new law or blueprint:

1. Propose amendment in PR description
2. Update `navigation-laws.md` or `layout-blueprints.md`
3. Re-run full board review

**Do not ship first and document later.**
