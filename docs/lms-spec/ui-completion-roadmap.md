# UI Completion Roadmap — RX-001
## Product delivery program (not a constitution amendment)

```yaml
id: UI-COMPLETION-RX001
status: active
layer: product_continuous
version: 1.0.0
date: 2026-07-08
platform_changes: 0
guiding_question: Can we faithfully realize RX-001 across every screen?
```

> Platform is frozen. **UI execution is the product.**  
> Scope is finite. Acceptance is measurable. No new interaction patterns.

---

## Goal

Ship a production-quality Learn UI that satisfies **all** of:

- RX-001 Reference Experience  
- Experience Principles  
- Design DNA (+ Civic Warmth)  
- Visual Acceptance Specification (VAS-001)  
- Platform Constitution  

…**without** introducing new interaction patterns (`platform_changes: 0`).

Final recognition test — the learner must **not** think Moodle / generic LMS / Coursera clone. They must recognize **Budget Ndio Story Learn**: calm, editorial, mobile-first, civic.

---

## Phase A — Core Experience (highest priority)

These five screens define the product. Nothing else is world-class until they are.

| Order | Capability | Screen | Role | Status |
|------:|------------|--------|------|--------|
| 0 | CAP-003 | Lesson Experience | Foundation — polish only | Foundation ✅ |
| 1 | CAP-004 | Course Detail | Flagship RX-001 composition | 🔜 in progress |
| 2 | CAP-005 | Home / Continue | Resume in ≤5 seconds | 🔜 in progress |
| 3 | CAP-006 | Catalogue | Discovery — horizontal filters | 🔜 planned |
| 4 | CAP-007 | Progress | Editorial cards — not BI | 🔜 planned |

### Screen compositions (RX-001)

**Home** — Resume within 5 seconds. One dominant Continue card. No analytics widgets. Recommended journeys + light achievements/activity. Editorial spacing.

**Catalogue** — Header · Search · Category chips (horizontal — like Linear, **never sidebar**) · Featured journey · Journey cards. Inspired by RX-001 grid calm.

**Course Detail** — Flagship / **UI reference implementation**. Breadcrumb · 60/40 Hero · Journey description · Module accordion. Meta = time · difficulty · citizens completed · outcomes — **not price**. CTA = **Start Journey** / **Continue Learning**.

Binding contract (Builder must not invent visuals): [`sic-cap-004-course-detail.md`](./sic-cap-004-course-detail.md).

**Lesson** — Architected. Polish only. Video → Trivia → Reflection → Continue. Nothing else.

**Progress** — Cards, not charts: Overall · Current journey · Completed · Achievements · Certificates. Editorial, not a BI dashboard.

---

## Phase B — Secondary

Achievements · Profile · Search · Settings · Certificates · Bookmarks · Resources  

Only after Phase A feels world-class under RX-001 / VAS / Family Test.

---

## Navigation (constitution-bound)

### Mobile bottom (hub) — five items, Law 3

Target labels for RX-001 product clarity (remap within existing five slots — not a sixth pattern):

| Slot | Target | Current implementation note |
|------|--------|-----------------------------|
| 1 | Home | ✅ |
| 2 | Catalogue | Today labeled “Learn” → catalogue href |
| 3 | Continue | Today Progress/Achievements middle — **align in Phase A** without new mode |
| 4 | Progress | ✅ |
| 5 | Profile | Achievements today #4 — achievements remain hub section / Phase B |

Always visible **except immersive lesson** (bottom nav hidden).

### Desktop top — RX-001 horizontal

Logo · Catalogue · Learn (home resume) · Progress · Achievements · Search · Profile  

**Never** a desktop sidebar.

---

## Pixel Discipline (product rule — UI execution)

Every spacing, radius, font size, color, shadow, breakpoint, animation, and layout decision must come from a defined token or Screen Implementation Contract.

The Builder must **never** invent values such as `padding: 22px`, `border-radius: 19px`, `font-size: 15px`.

Missing value → add a **named token** in `lms-design-tokens.ts` in the same PR — never a one-off.

## Token freeze (implementation)

Already in `src/constants/lms-design-tokens.ts` / RX-001 — do not invent values.

| Concern | Values |
|---------|--------|
| Spacing | 8 · 16 · 24 · 32 · 48 · 64 · 80 (+4 for micro) |
| Radius | Input 14 · Button 16 · Card 24 · Dialog 28 |
| Shadow | One minimal elevation |
| Color | `#FAFAFA` / white / black primary / gray secondary · BNS green **only** for meaningful progress/success/impact |
| Type | Display 48 → H1 40 → H2 32 → H3 24 → Body 16 → Caption 14 → Meta 12 |
| Motion | Hover 120 · Accordion 220 · Sheet 300 · Route 250 — state only |

---

## Component library (compose only these)

Canonical reusable blocks. Everything else composes them — no one-off interaction inventions.

```
LearningShell · TopNavigation · BottomNavigation
JourneyHero · JourneyCard · ContinueCard
VideoPlayer · TriviaSheet · ReflectionCard / ReflectionPanel
ProgressCard · AchievementCard · CertificateCard
ModuleAccordion · LessonPart
SearchBar · FilterChip
PrimaryButton · SecondaryButton
SectionHeader · EmptyState · LoadingSkeleton
```

| Target name | Current path (if any) |
|-------------|------------------------|
| LearningShell | `shell/learning-shell.tsx` |
| TopNavigation | `shell/lms-top-nav.tsx` |
| BottomNavigation | `shell/lms-bottom-nav.tsx` |
| JourneyHero | `course/course-hero.tsx` (rename optional) |
| ContinueCard | `home/continue-card.tsx` |
| VideoPlayer | `lesson/video-player.tsx` |
| TriviaSheet | `lesson/trivia-sheet.tsx` |
| ReflectionPanel | `lesson/reflection-panel.tsx` |
| ModuleAccordion | `course/module-accordion.tsx` |
| JourneyCard | `course-card.tsx` (evolve) |
| FilterChip | **missing** — Phase A Catalogue |
| SearchBar | partial search page |
| ProgressCard / CertificateCard | **missing** — Phase A/B |

---

## Design gates (every PR)

| Gate | Must pass |
|------|-----------|
| **1 RX-001** | Same family · calm · hierarchy |
| **2 VAS** | One CTA · 8pt · no clutter (`visual-acceptance.yaml`) |
| **3 Experience** | Cognitive budget · ≤2 decisions / viewport |
| **4 Family Test** | FT1–FT5 all pass |
| **5 Critic** | Hostile review below |

### Critic (must try to reject)

1. Does this feel like RX-001 without copying it?  
2. Can a first-time citizen understand the screen in **under 30 seconds**?  
3. Exactly one dominant action?  
4. Would removing any element improve the screen?  
5. Does this preserve Budget Ndio Story Learn’s identity?

Fail any → revise. Contract-correct but cluttered = fail (Experience Drift).

---

## Execution order

```
Phase A starts with CAP-004 (flagship UI) — may proceed before Gate 1
        │
        ▼
CAP-004 SIC → build reference Course Detail → Critic + acceptance matrix
        │
        ▼
Gate 1 (lesson walkthrough) may run in parallel; three commits when validated
        │
        ▼
Phase A: CAP-005 → CAP-006 → CAP-007 reuse CAP-004 patterns (lesson polish interleaved)
        │
        ▼
Phase B secondaries
        │
        ▼
CAP-008 → CAP-010
        │
        ▼
Platform Validation Review
```

Evidence DoD per capability still required (review · tests · ledger · FT · VAS).

---

## Related

| Doc | Role |
|-----|------|
| `reference-experience-rx-001.md` | Experience constitution |
| `visual-acceptance.yaml` | Critic VAS |
| `PLATFORM.md` | Frozen platform |
| `capability-ledger.yaml` | Validation register |
| `ARCHITECTURE-AUDIT.md` | Drift / baseline |
