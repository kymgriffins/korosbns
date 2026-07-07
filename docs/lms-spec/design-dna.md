# Design DNA
## Learning Journey Platform — Budget Ndio Story

This document defines **personality** — not pixels. When an AI agent invents a new screen, it must feel like it belongs to this family.

**Do not cite hex codes here.** Tokens live in `src/constants/lms-design-tokens.ts`. This is the soul.

---

## 1. Reference fusion

If these products had a child focused on **civic education**:

```
Apple's restraint
  + Coursera's course clarity
  + Linear's navigation confidence
  + Duolingo's progression momentum
  + Notion's calm whitespace
  = Budget Ndio Story Learn
```

**Not:** Moodle. Canvas. Blackboard. SAP Litmos. Enterprise HR training portals.

---

## 2. Personality

### We are

| Trait | Meaning |
|-------|---------|
| **Minimal** | Every element earns its place |
| **Calm** | No urgency manipulation, no notification anxiety |
| **Confident** | Clear hierarchy — the interface knows what you should do |
| **Premium** | Generous space, refined typography, no cheap UI |
| **Educational** | Respect the learner's intelligence |
| **Intentional** | Nothing decorative, everything purposeful |

### We are never

| Anti-trait | Symptom |
|------------|---------|
| **Corporate** | Gray tables, "Compliance Training" vibes |
| **Busy** | Competing widgets, notification badges everywhere |
| **Enterprise** | Role selectors, admin breadcrumbs, data grids |
| **Gamified chaos** | Confetti on every click, XP popups, leaderboard pressure |
| **Dashboard heavy** | 6-metric grids before content |
| **Bootstrap looking** | Default blue buttons, cramped cards, generic alerts |
| **Material clutter** | FABs, ripple everything, elevated rainbow cards |

---

## 3. Visual grammar

The reference design language has a **grammar** — rules for how elements relate. Not just a layout.

### Cards

```
Few, not many
Large, not cramped
Breathing room between them
Rounded (12–20px)
Soft shadow or border — almost floating
Never saturated background fills
Never nested cards inside cards
```

### Typography

```
Large titles — learner always knows where they are
Small metadata — duration, module number, difficulty
Wide spacing between sections
Generous line-height on body (1.6+)
Strong hierarchy — size and weight, not color alone
Max three weights per screen
```

### Color

```
Mostly white or near-white (#FAFAFA)
Mostly black or near-black for text and primary CTA
Accent used sparingly — one moment per screen maximum
No rainbow UI
No colored card backgrounds
No saturated section backgrounds
No bright blue as default CTA
```

### Imagery

```
Course hero is the largest visual on course pages
Video is the largest visual on lesson pages
Images support content — never decorative stock
Rounded corners on images matching card radius
```

### Motion

```
Everything feels alive
Nothing feels "animated"
Motion communicates state change — expand, overlay, complete
Never decoration — no bouncing logos, no parallax for show
150–250ms for UI; spring for sheets
Hover: subtle lift (1.02)
Press: subtle compress (0.98)
```

### Space

```
Whitespace is a feature, not waste
8-point grid — 8, 16, 24, 32, 48, 64
Content breathes — max 1280px centered
Prose narrow — 65–75 characters for reading
```

---

## 4. Brand recognition test

Apply to every screen before merge:

### Visual regression questions

**Q1.** Could this screenshot be confused with another product (Coursera, Udemy, Moodle, Notion template)?

→ If **yes** → **Fail.** Identify which element causes confusion.

**Q2.** Would someone recognize the design language **without seeing the logo**?

→ Must be **yes** to pass.

**Q3.** If you showed this to someone who saw the reference mockup, would they say "same family"?

→ Must be **yes** to pass.

**Q4.** Does removing the logo leave a generic Bootstrap/Tailwind template?

→ If **yes** → **Fail.** Increase intentionality.

### What makes us recognizable

- Black primary CTA on white
- No sidebar, ever
- Expandable module journey cards (not curriculum tables)
- Bottom sheet trivia (not quiz pages)
- Sticky Continue on lessons
- Extreme whitespace
- Typography-first hierarchy

---

## 5. Product naming (internal)

| Use | Don't use |
|-----|-----------|
| Learning Journey Platform | LMS (in specs and PRs) |
| Learn experience | Learning hub |
| Course | Course container / learning path |
| Lesson | Learning unit / content item |
| Continue | Next, Submit, Proceed (in primary CTA) |
| Module | Chapter / section (in UI copy) |

**URLs remain `/learn/*`** for stability. Internal specs use **Learning Journey Platform**.

---

## 6. Decision filter

When unsure, ask:

1. Would **Apple** remove something from this page? → Remove it.
2. Would **Linear** simplify this navigation? → Simplify.
3. Would **Duolingo** make progression clearer? → Clarify Continue.
4. Would **Notion** add more whitespace? → Add it.

---

## 7. DNA → implementation map

| DNA rule | Enforced by |
|----------|-------------|
| Personality | `experience-principles.md` |
| Visual grammar | `ai-design-constitution.md` + tokens |
| Never traits | `anti-patterns.md` |
| Recognition | `design-review-checklist.md` |
| Motion | `component-contracts/*` |
