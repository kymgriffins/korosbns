# Layout Blueprints
## Canonical screen structures — LMS

Every screen **must** derive from one blueprint. Agents may not invent new layout regions without updating this document.

All blueprints assume:

- Max content width: **1280px**, centered
- 8pt spacing grid
- No left sidebar at any breakpoint

---

## Blueprint A — Hub

**Used by:** Home, Catalogue, Progress, Achievements, Profile

```
┌──────────────────────────────────────────────┐
│  TOP NAV (desktop)                    [sticky]│
├──────────────────────────────────────────────┤
│                                              │
│  PAGE HEADER                                 │
│    Eyebrow (optional)                        │
│    Title                                     │
│    Lead text (optional)                      │
│                                              │
│  PRIMARY CONTENT                             │
│    Cards / lists / metrics                   │
│                                              │
│  SECONDARY CONTENT (optional)                │
│    Recommendations, recent                   │
│                                              │
├──────────────────────────────────────────────┤
│  BOTTOM NAV (mobile)                  [fixed] │
└──────────────────────────────────────────────┘
```

**Mobile:** Single column. Bottom nav visible.  
**Desktop:** Same column, wider cards (2-col grid where specified).

---

## Blueprint B — Course Detail

**Used by:** `/learn/courses/[slug]`

```
┌──────────────────────────────────────────────┐
│  TOP NAV                              [sticky]│
├──────────────────────────────────────────────┤
│  BREADCRUMB                                  │
│    Learn › Course title                      │
│                                              │
│  HERO ROW (desktop: 60/40 split)             │
│  ┌────────────────────┬───────────────────┐  │
│  │  HERO IMAGE        │  Title            │  │
│  │  (60%)             │  Subtitle         │  │
│  │                    │  Icon metadata    │  │
│  │                    │  Progress bar     │  │
│  │                    │  [Primary CTA]    │  │
│  │                    │  [Secondary CTA]  │  │
│  └────────────────────┴───────────────────┘  │
│                                              │
│  DESCRIPTION (prose width)                   │
│                                              │
│  REQUIREMENTS (collapsible, optional)        │
│                                              │
│  MODULES (accordion, all collapsed default)  │
│    ▼ Module 1                                │
│    ▶ Module 2                                │
│    ▶ Module 3 (locked)                       │
│                                              │
│  REVIEWS (v2, collapsed)                     │
│                                              │
├──────────────────────────────────────────────┤
│  BOTTOM NAV (mobile)                         │
└──────────────────────────────────────────────┘
```

**Why hero split:** Image dominance without pushing CTA below fold on desktop.  
**Why modules below hero:** Learner decides to enroll before seeing full curriculum.

---

## Blueprint C — Module Overview

**Used by:** `/learn/courses/.../modules/[slug]` (optional deep link)

```
┌──────────────────────────────────────────────┐
│  TOP NAV                              [sticky]│
├──────────────────────────────────────────────┤
│  BREADCRUMB                                  │
│    Course › Module                           │
│                                              │
│  MODULE HERO                                 │
│    Module number · Status badge              │
│    Title                                     │
│    Duration · Lesson count                   │
│    Progress bar                              │
│    [Start module]                            │
│                                              │
│  OBJECTIVES                                  │
│    Bullet list                               │
│                                              │
│  LESSONS                                     │
│    Expanded module card OR lesson list       │
│                                              │
├──────────────────────────────────────────────┤
│  BOTTOM NAV (mobile)                         │
└──────────────────────────────────────────────┘
```

**Why separate page exists:** Shareable module link, objectives-first for facilitators. Course page accordion remains canonical for learners.

---

## Blueprint D — Lesson (immersive)

**Used by:** `/learn/courses/.../lessons/[slug]`

```
┌──────────────────────────────────────────────┐
│  TOP NAV (minimal)                    [sticky]│
├──────────────────────────────────────────────┤
│  BREADCRUMB / BACK                           │
│    ← Module title                            │
│                                              │
│  LESSON HEADER                               │
│    Course · Module · Lesson n                │
│    Title · Duration · Progress               │
│                                              │
│  VIDEO (full content width, max 1100px)      │
│  ┌────────────────────────────────────────┐  │
│  │           VIDEO PLAYER                 │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  PART SELECTOR (3–4 parts)                   │
│                                              │
│  TRANSCRIPT (collapsed)                      │
│                                              │
│  ─── TRIVIA SHEET (overlay, not in flow) ─── │
│                                              │
│  REFLECTION (after parts complete)           │
│                                              │
│  RESOURCES (collapsed)                       │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  [Continue]                     [sticky] │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  SECONDARY ROW (ghost actions, one row)      │
│    Previous · Mark complete · Discussion     │
│                                              │
└──────────────────────────────────────────────┘
  (no bottom nav on mobile)
```

**Why sticky Continue:** Law 9–10. Learner always knows forward action.  
**Why secondary row demoted:** Law 13 — one primary CTA.

---

## Blueprint E — Utility (Search)

**Used by:** `/learn/search`

```
┌──────────────────────────────────────────────┐
│  TOP NAV                              [sticky]│
├──────────────────────────────────────────────┤
│  SEARCH INPUT (autofocus)                    │
│                                              │
│  RESULTS GROUPED                             │
│    Course | Module | Lesson                  │
│                                              │
├──────────────────────────────────────────────┤
│  BOTTOM NAV (mobile)                         │
└──────────────────────────────────────────────┘
```

---

## Blueprint F — Account (adjacent)

**Used by:** `/learn/account/*`

```
┌──────────────────────────────────────────────┐
│  MARKETING / DASHBOARD CHROME                │
│  (NOT LmsShell)                              │
├──────────────────────────────────────────────┤
│  Account form content                        │
└──────────────────────────────────────────────┘
```

---

## Responsive rules (all blueprints)

| Breakpoint | Behaviour |
|------------|-----------|
| `< lg` | Single column; bottom nav on hubs |
| `≥ lg` | Top nav; max-width container; 2-col grids where specified |
| Lesson | Video 100% width mobile; centered max 1100px desktop |

---

## Blueprint → screen map

| Screen | Blueprint |
|--------|-----------|
| Home | A |
| Catalogue | A |
| Progress | A |
| Achievements | A |
| Profile | A |
| Course Detail | B |
| Module Overview | C |
| Lesson | D |
| Search | E |
| Account | F |

---

## Desktop vs mobile principle

> Mobile is the **source layout**. Desktop **adds horizontal space** — never a new navigation region.

Forbidden desktop additions:

- Left sidebar
- Right sidebar table of contents
- Second persistent nav row
