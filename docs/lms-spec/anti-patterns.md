# Anti-Patterns
## Learning Journey Platform — Instant-fail catalog

If an AI implementation includes **any** item below, it **fails review immediately** — no debate, no "we'll fix later."

Cross-reference: `design-dna.md` · `experience-principles.md` · `navigation-laws.md`

---

## Navigation & structure

```
❌ Permanent left sidebar (any breakpoint)
❌ Right sidebar table of contents
❌ Dashboard grids as home page
❌ Tab-based hub routing (?tab=modules)
❌ Deep nesting (> 4 levels in flow)
❌ Breadcrumb longer than 3 items
❌ Hamburger menu replacing bottom nav on hubs
❌ Sixth item in bottom navigation
❌ Lesson opens in modal (breaks URL)
❌ Trivia on separate /quiz route
❌ Video on separate /videos route
```

---

## Layout & density

```
❌ Four-column layouts
❌ Tiny cards (more than 6 visible above fold)
❌ Nested accordions (accordion inside accordion)
❌ Full-width paragraphs (no prose constraint)
❌ Walls of text (> 4 lines above fold on flow screens)
❌ Long forms on learning screens
❌ Bootstrap tables for curriculum
❌ Data grids / spreadsheet views
❌ Split-screen with equal-weight panels
❌ Edge-to-edge content on desktop (no max-width)
❌ Content width > 1280px
```

---

## Actions & decisions

```
❌ Multiple primary CTAs per viewport
❌ Competing CTAs side by side (Enroll + Preview + Share)
❌ Multiple floating action buttons (FABs)
❌ "Mark complete" as primary beside "Continue"
❌ Dismiss trivia without answering
❌ Skip video without explicit Continue
❌ Auto-advance to next lesson without user action
❌ Confirmation dialogs for reversible actions
```

---

## Visual style

```
❌ Bright blue primary buttons everywhere
❌ Colored card backgrounds (blue card, green card)
❌ Saturated section backgrounds
❌ Rainbow UI (multi-color badges as decoration)
❌ Random icons without semantic purpose
❌ Heavy shadows (shadow-lg on every card)
❌ Material Design FAB / ripple patterns
❌ Gradient backgrounds on content areas
❌ Stock photo hero with no course relevance
❌ Uneven spacing (mixed 12px, 18px, 23px gaps)
❌ Magic numbers not from token scale
```

---

## Typography

```
❌ More than 3 font weights on one screen
❌ Color as primary hierarchy (blue titles, green subtitles)
❌ All-caps body text
❌ Tiny metadata (< 12px) for essential information
❌ Centered long-form paragraphs
```

---

## Motion

```
❌ Animation > 250ms for UI transitions
❌ Bouncing elements
❌ Parallax scroll effects
❌ Confetti on every interaction
❌ Loading spinners on every card
❌ Animate every list item on page load
❌ Decoration-only motion
```

---

## Cognitive load

```
❌ More than 2 decisions on lesson viewport
❌ Complexity jump > 1 level between adjacent journey steps
❌ Analytics charts on home page
❌ Forum / documents / videos as peer hub tabs
❌ Notification bell with badge on learn shell
❌ "What's new" banners above continue card
❌ Feature discovery tooltips on first visit
```

---

## Enterprise LMS patterns (never)

```
❌ "My Courses" table with sortable columns
❌ Course catalog as spreadsheet
❌ Admin preview banner on learner UI
❌ Role switcher (Learner / Instructor / Admin)
❌ Grade book
❌ Assignment submission forms
❌ Discussion forum as primary nav destination
❌ SCORM player chrome
❌ Completion certificate as full-page interrupt mid-lesson
```

---

## Component-specific

```
❌ Module list as permanent visible sidebar
❌ Curriculum tree always expanded
❌ Video playlist in left column
❌ Transcript always visible (must be collapsed)
❌ Notes panel beside video on desktop
❌ Quiz with 10 questions inline
❌ Star rating required before continue
❌ Progress as percentage only (no fraction)
```

---

## AI generation failures (common)

```
❌ "Welcome back, [name]!" + 6 widgets
❌ Stats row: Courses | Hours | Points | Rank
❌ Sidebar: Home, Courses, Calendar, Messages, Settings
❌ Card grid of 12 equal courses with no hierarchy
❌ Lesson page with header, sidebar, video, comments, footer all equal weight
❌ shadcn default blue Button as primary everywhere
❌ Adding Search to bottom nav "for convenience"
❌ Creating new component when contract exists
```

---

## Review protocol

When reviewing code or screenshots:

1. Scan this list top to bottom
2. Any match → **Fail** → cite line item
3. Fix by **removing** or **simplifying** — not by restyling
4. Re-scan until zero matches

---

## Escape hatch

If a feature **requires** an anti-pattern:

1. Document why in PR
2. Propose amendment to this file with mitigation
3. Architecture review board approval required

**Default: the anti-pattern stays forbidden.**
