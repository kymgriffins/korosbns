# Navigation Laws
## LMS — Immutable architectural constraints

These are **not** styling rules. They define how learners move through the system.

Any screen or component that violates a law **fails architecture review** — regardless of visual polish.

---

## LAW 1 — Two-tap lesson reach

> The learner must never be more than **two taps** away from their **current in-progress lesson** from any hub screen.

**Why:** Returning learners are the primary audience. Friction kills streaks.

**Enforcement:**
- Home shows **Continue Learning** as first element
- Progress shows per-course resume
- Bottom nav always one tap from hub to hub

**Violations:** Home without continue card; Progress without resume links.

---

## LAW 2 — Desktop navigation is top-aligned

> Desktop navigation is always **sticky top**. Never left-aligned. Never a permanent sidebar.

**Why:** Sidebar implies "application chrome" over content. Content-first requires horizontal space for video.

**Enforcement:** `LmsTopNav` only. No `Sidebar` in `/learn/*`.

---

## LAW 3 — Mobile navigation is bottom-aligned

> Mobile hub screens use a **persistent bottom bar** with **exactly five** destinations.

**Why:** Thumb reachability. Five is the cognitive maximum for persistent nav.

**Destinations:** Home · Learn (Catalogue) · Progress · Achievements · Profile

**Violations:** Sixth tab; hamburger replacing bottom nav on hubs.

---

## LAW 4 — Modules expand in place

> Modules **never navigate away** to show their lesson list on the course page. They **expand in place**.

**Why:** Progressive disclosure. The course page is the curriculum map — not a directory of separate pages.

**Enforcement:** `ModuleCard` accordion on Course Detail. Module Overview page is optional deep link only.

**Violations:** Course page linking straight to all lessons without collapse; sidebar module tree.

---

## LAW 5 — One module open at a time

> Only **one module accordion** may be open at a time on the course page.

**Why:** Prevents curriculum wall. Focuses attention on current chapter.

**Enforcement:** Accordion group pattern — opening one closes others.

---

## LAW 6 — Lessons live at dedicated routes

> Lessons have shareable URLs but **enter through Continue or explicit lesson tap** — never auto-redirect through unrelated screens.

**Why:** Deep links for sharing; predictable back behaviour.

---

## LAW 7 — Video never opens a new page

> Video playback never navigates to `/videos`, `/watch`, or external chrome.

**Why:** Context (breadcrumb, progress) must remain visible. Trivia depends on same page instance.

---

## LAW 8 — Trivia overlays the lesson

> Trivia **never replaces** the lesson. It **overlays** it (bottom sheet).

**Why:** Learner must feel paused, not redirected. Answer → resume same video context.

**Violations:** `/quiz` route; full-page trivia; dismiss without answer.

---

## LAW 9 — Continue is the forward action

> **Continue** is the universal primary forward action in the lesson flow.

**Why:** One question per screen: "What next?" — always the same verb.

**Variants:** "Next lesson" only when Continue semantics mean crossing lesson boundary.

---

## LAW 10 — Continue is visible when earned

> Continue becomes **sticky and visible** only after required interactions (video part + trivia if present) for the current step.

**Why:** Prevents skipping; gives clear affordance when ready.

---

## LAW 11 — Back never loses progress

> Back navigation (breadcrumb, browser back, Previous) **never discards** completed trivia, reflection draft, or watched progress.

**Why:** Trust. Learners experiment with navigation without penalty.

**Enforcement:** Client state persisted to sessionStorage minimum (v2: server).

---

## LAW 12 — Lesson hides hub chrome

> On the lesson screen, **bottom navigation is hidden**. Top navigation remains minimal.

**Why:** Immersive content. Hub nav competes with Continue.

---

## LAW 13 — One primary CTA per viewport

> Each viewport shows **exactly one primary CTA**.

**Why:** Cognitive load. Secondary actions use ghost/outline.

**Violations:** Lesson footer with Next + Mark complete + Discussion as equal buttons.

---

## LAW 14 — Search is utility, not home

> Search is reachable from top nav but is **not** a bottom nav destination.

**Why:** Five slots are reserved for habit loops. Search is intentional, not habitual.

---

## LAW 15 — Account is outside the learning shell

> `/learn/account/*` does not render inside `LmsShell`.

**Why:** Account is identity management, not learning. Different mental model.

---

## LAW 16 — Flow depth maximum

> Maximum navigation depth in learning flow: **4 levels** (Course → Module → Lesson → Part).

**Why:** Deeper nesting requires sidebar or breadcrumbs spanning half the screen.

---

## Quick reference

| Law | One line |
|-----|----------|
| 1 | ≤2 taps to lesson from hub |
| 2 | Top nav desktop, no sidebar |
| 3 | Bottom nav mobile, 5 items |
| 4 | Modules expand in place |
| 5 | One module open |
| 6 | Lessons have URLs, intentional entry |
| 7 | Video stays on lesson page |
| 8 | Trivia overlays |
| 9 | Continue = forward |
| 10 | Continue visible when ready |
| 11 | Back preserves progress |
| 12 | Lesson hides bottom nav |
| 13 | One primary CTA |
| 14 | Search in top nav only |
| 15 | Account outside shell |
| 16 | Max depth 4 |
