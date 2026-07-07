# AI Design Constitution
## Learning Management System
### Non-negotiable rules for AI agents

This document works alongside the full specification stack — see `docs/lms-spec/README.md`.

**Upstream (read first):** Product Architecture · Information Architecture · User Journey · Navigation Laws · Layout Blueprints · Screen Contracts · Component Contracts

**Downstream (verify after):** UI Acceptance Questionnaire · Architecture Review Board · `lms-ui-audit.md`

**No agent may write or merge LMS UI code until:**

1. The target screen has a completed **Screen Contract**
2. Every component used has a **Component Contract**
3. **Architecture Review Board** passes (including W1–W5 reasoning questions)
4. Every UI questionnaire answer is **Yes**

---

## 1. Layout law

| Rule | Violation |
|------|-----------|
| Never introduce a permanent sidebar on desktop | FAIL |
| Never exceed content width of `1280px` | FAIL |
| Never stretch lesson content edge-to-edge on desktop | FAIL |
| Always use sticky top nav on desktop (`lg+`) | FAIL |
| Always use persistent bottom nav on mobile (max 5 items) | FAIL |
| Always center content with horizontal padding | FAIL |

---

## 2. Action law

| Rule | Violation |
|------|-----------|
| Never show more than **one primary CTA** per viewport | FAIL |
| Never show competing primary buttons side-by-side | FAIL |
| Every screen must answer: "What should I do next?" | FAIL |
| Lesson primary action is always **Continue** | FAIL |
| Secondary actions use `ghost` or `outline` variants only | FAIL |

---

## 3. Color law

| Rule | Violation |
|------|-----------|
| Primary CTA is **black** (`#111827` / `foreground`), not blue | FAIL |
| Never use more than **two accent colors** per screen | FAIL |
| Background: `#FAFAFA` or `#FFFFFF` | FAIL |
| Cards: pure white on near-white background | FAIL |
| Borders: gray 100–200, opacity ≤ 12% | FAIL |
| Success: green, sparingly | FAIL |
| Never use brand blue as the default lesson CTA | FAIL |

---

## 4. Typography law

| Rule | Violation |
|------|-----------|
| Maximum **three font weights** per page | FAIL |
| Hierarchy via size & weight, not color alone | FAIL |
| Body copy max width: **65–75 characters** (`max-w-prose` / `~42rem`) | FAIL |
| No more than one display size jump per section | FAIL |

---

## 5. Module law

| Rule | Violation |
|------|-----------|
| Modules default **collapsed** | FAIL |
| Accordion: only **one module open** at a time | FAIL |
| Lessons hidden until module expands | FAIL |
| Module expand animation: **200ms** height, Motion | FAIL |
| Progress visible on collapsed module card | FAIL |

---

## 6. Lesson law

| Rule | Violation |
|------|-----------|
| Video is the largest element on the page | FAIL |
| Transcripts **collapsed** by default (`<details>`) | FAIL |
| Notes never interrupt video flow | FAIL |
| No horizontal scroll, ever | FAIL |
| Video split into **3–4 parts** per lesson | FAIL |

---

## 7. Trivia law

| Rule | Violation |
|------|-----------|
| Trivia is a **bottom sheet**, never a new page | FAIL |
| Exactly **one question** per interruption | FAIL |
| **Immediate feedback** after answer | FAIL |
| Cannot dismiss without answering | FAIL |
| Spring animation, ≤ 250ms perceived duration | FAIL |

---

## 8. Motion law

| Rule | Violation |
|------|-----------|
| Animation duration: **150–250ms** | FAIL |
| Prefer spring transitions for sheets & accordions | FAIL |
| Hover scale: **1.02** on cards only | FAIL |
| Active/tap scale: **0.98** on buttons | FAIL |
| Never animate every element — purposeful only | FAIL |

---

## 9. Card law

| Rule | Violation |
|------|-----------|
| Border radius: **12–20px** (`rounded-xl` to `rounded-2xl`) | FAIL |
| No heavy shadows — `shadow-sm` maximum | FAIL |
| Soft borders, not hard dividers | FAIL |
| Padding: **24–32px** (`p-6` / `p-8`) | FAIL |

---

## 10. Token law

| Rule | Violation |
|------|-----------|
| All spacing from **8pt grid** (`src/constants/lms-design-tokens.ts`) | FAIL |
| No magic numbers in component files | FAIL |
| Reuse `LmsPage`, `LmsSection`, card primitives before new wrappers | FAIL |
| New components must import tokens, not inline arbitrary values | FAIL |

---

## 11. Accessibility law

| Rule | Violation |
|------|-----------|
| All interactive elements keyboard reachable | FAIL |
| Visible `:focus-visible` rings on all controls | FAIL |
| Minimum touch target **44×44px** | FAIL |
| WCAG AA contrast minimum | FAIL |

---

## 12. Agent workflow (mandatory)

Before writing code for any LMS screen:

1. Read `docs/ui-acceptance-questionnaire.md`
2. Answer all 70 questions for the target screen
3. List any **No** answers
4. Fix design until all are **Yes**
5. Only then implement or merge

Before marking a PR ready:

1. Re-run Section 15 (Final Acceptance) — all six must be **Yes**
2. Attach answers in PR description or `docs/lms-ui-audit.md`

---

## 13. Stack constraints

- **Next.js** App Router — server components for data, client for interaction
- **shadcn/ui** — primitives only; LMS chrome lives in `src/components/lms/`
- **Tailwind CSS** — tokens via `lms-*` utilities or CSS variables
- **Motion** (`motion/react`) — sheets, accordions, page enter
- **No** left sidebar under any breakpoint
- **No** copying from deleted `src/components/learn/` — rebuild from spec

---

## Reference implementation targets

```
src/constants/lms-design-tokens.ts   ← spacing, width, motion, radius
src/components/lms/                  ← all LMS UI
src/styles/lms.css                   ← scoped LMS overrides (CTA black, prose width)
docs/lms-ui-audit.md                 ← latest questionnaire answers
```
