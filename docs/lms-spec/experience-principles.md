# Experience Principles
## Learning Journey Platform — Budget Ndio Story

**Product identity:** We build a **Learning Journey Platform** — not an LMS. An LMS implies dashboards, admin chrome, and course management. This product is a **guided learning experience** where the lesson is the product.

This document specifies **how the product should feel** — not what it contains.

Read before any screen contract, component contract, or implementation.

---

## 1. Emotional progression

Every screen must evoke **one primary emotion**. Secondary emotions are allowed only if they support the primary.

```
Arrive (Home / Catalogue)
        Curiosity
              "What can I learn that matters to me?"
              ↓
Course Detail
        Confidence
              "I understand what this is and whether it's for me."
              ↓
Lesson
        Focus
              "Nothing else exists except this video."
              ↓
Trivia
        Challenge
              "One quick check — can I apply what I just saw?"
              ↓
Correct answer
        Reward
              "I got it." (brief, not gamified chaos)
              ↓
Reflection
        Integration
              "This connects to my life."
              ↓
Module complete
        Achievement
              "I finished a chapter."
              ↓
Course complete
        Pride
              "I did something meaningful for my community."
```

### Screen → emotion map

| Screen | Primary emotion | Must not feel like |
|--------|-----------------|-------------------|
| Home | **Momentum** (return) / Curiosity (new) | Dashboard |
| Catalogue | Curiosity | Marketplace clutter |
| Course Detail | Confidence | Sales landing page |
| Module Overview | Orientation | Syllabus PDF |
| Lesson | Focus | Video portal |
| Trivia | Challenge | Exam |
| Progress | Accomplishment | Analytics dashboard |
| Achievements | Pride | Mobile game |
| Profile | Ownership | Admin settings |
| Search | Intent | Google results page |

**Rule:** If a screen evokes more than one competing emotion, simplify until one wins.

---

## 2. Cognitive load budget

Every screen declares a **load budget** before implementation. Exceeding the budget fails review.

### Universal ceilings

| Dimension | Hub screens | Flow screens (Course, Lesson) |
|-----------|-------------|-------------------------------|
| Decisions visible | ≤ 3 | ≤ 2 |
| Primary CTAs | 1 | 1 |
| Cards visible without scroll | ≤ 6 | ≤ 4 |
| Lines of body text (above fold) | ≤ 4 | ≤ 2 |
| Scroll depth to primary action | ≤ 1.5 viewports | ≤ 1 viewport |
| Interaction depth (clicks to action) | ≤ 2 | ≤ 1 |

### Per-screen budgets

#### Home

```
Decisions:     Resume OR Browse (max 2)
Primary CTA:   1 (Resume if enrolled)
Cards:         1 continue + 4 visible max in recommendations
Text:          2 lines above fold
Scroll:        Continue card in first viewport
Depth:         1 tap to lesson
```

#### Course Detail

```
Decisions:     Enroll OR leave (max 2)
Primary CTA:   1 (Enroll / Resume)
Cards:         Hero + collapsed modules only
Text:          Prose block ≤ 3 short paragraphs
Scroll:        CTA visible without scrolling on desktop
Depth:         2 taps to first lesson (enroll + lesson)
```

#### Lesson

```
Decisions:     1. Play  2. Continue (max 2)
Primary CTA:   1 (Continue — sticky when earned)
Cards:         Video + part selector only (always visible)
Text:          Summary ≤ 2 lines above video
Scroll:        Video in first viewport
Depth:         0 taps to play (controls visible)
```

**No third competing action** on the lesson viewport. Previous, Mark complete, Discussion live in a **demoted ghost row** below the sticky Continue — never beside it.

#### Trivia (overlay)

```
Decisions:     1 (answer)
Primary CTA:   1 (Check answer → Continue)
Cards:         0
Text:          1 question only
Duration:      < 30 seconds
```

#### Progress

```
Decisions:     Resume per course (max 1 per card)
Primary CTA:   0 at page level (cards are links)
Cards:         Metrics (2) + course rows
Text:          Minimal
```

---

## 3. Progressive complexity

Complexity must **never jump**. Learners ascend gradually through the journey.

| Journey stage | Screen | Complexity (1–10) | What increases |
|---------------|--------|-------------------|----------------|
| 1 — Orient | Home | 1 | One path forward |
| 2 — Discover | Catalogue | 2 | Filters (optional) |
| 3 — Decide | Course Detail | 3 | Hero + collapsed modules |
| 4 — Focus | Lesson (watch) | 2 | Video only |
| 5 — Challenge | Trivia | 4 | One question overlay |
| 6 — Integrate | Reflection | 3 | One prompt |
| 7 — Navigate | Module complete | 5 | Next chapter choice |
| 8 — Measure | Progress | 6 | Multiple courses |
| 9 — Identity | Profile | 7 | Stats + settings links |

**Rule:** Never expose complexity level N+2 on the same screen as level N.

Examples:
- ❌ Lesson page with full curriculum sidebar (complexity 8 on a level-2 screen)
- ❌ Home with analytics widgets + forum + documents (complexity 9 on level 1)
- ✅ Course page with collapsed modules (level 3, reveals level 4 on expand)

---

## 4. Attention model

```
FOCUS   → Lesson video, trivia question
GUIDE   → Continue button, breadcrumb
CONTEXT → Course title, module name, progress fraction
HIDDEN  → Everything else until requested
```

Information moves **down** the stack as the learner deepens — never up.

---

## 5. Time-to-value

| Moment | Target |
|--------|--------|
| Returning learner → video playing | < 5 seconds |
| New learner → first video playing | < 60 seconds |
| Trivia interaction | < 30 seconds |
| Decision on course page | < 90 seconds |

If a screen cannot meet its time-to-value target, remove elements until it can.

---

## 6. Experience anti-goals

The platform must never feel:

- **Overwhelming** — too many choices
- **Infantilizing** — gamified chaos, streaks screaming for attention
- **Corporate** — enterprise training portal
- **Abandoned** — empty states without guidance
- **Trapped** — no clear exit or back without penalty

---

## 7. Relationship to other specs

| Document | Role |
|----------|------|
| `design-dna.md` | Personality and visual grammar |
| `anti-patterns.md` | Instant-fail patterns |
| `navigation-laws.md` | Movement constraints |
| `screen-contracts/*` | Per-screen emotional + load budget |
| `design-review-checklist.md` | PR gate |

**Implementation is blocked until the target screen's emotion and cognitive load are declared in its screen contract.**
