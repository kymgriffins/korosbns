# CAP-004 Screen Implementation Contract
## Course Detail — UI Reference Implementation

```yaml
id: SIC-CAP-004
capability: CAP-course-detail
spec_id: LJP-004
alias: CAP-004
version: 1.0.0
date: 2026-07-08
status: frozen_for_build
layer: product_continuous
platform_changes: 0
guiding_objective: >
  Build the definitive Course Detail screen that becomes the visual
  and interaction reference for Budget Ndio Story Learn.
parent_contracts:
  - docs/screen-contracts/course-detail.md
  - docs/layout-blueprints.md#blueprint-b
  - docs/lms-spec/reference-experience-rx-001.md
  - docs/lms-spec/visual-acceptance.yaml
  - docs/lms-spec/ui-completion-roadmap.md
token_source: src/constants/lms-design-tokens.ts
pixel_discipline: required
```

> **Builder rule:** Do not ask “How should this look?”  
> Ask **“What does SIC-CAP-004 specify?”**  
> Every spacing, radius, type size, color, shadow, breakpoint, motion, and layout value must resolve to a **token or this contract**. Invented CSS values are an instant fail.

---

## 0. Role of this screen

| | |
|--|--|
| **Product role** | Flagship / reference implementation |
| **What it proves** | RX-001 visual + interaction language for the entire product |
| **What Lesson proves** | Runtime |
| **What Course Detail proves** | Product |
| **Inheritance rule** | Every future Phase A screen must look at home **beside** this one — reuse its components, spacing, type, and layout patterns; do not invent parallel ones |

Emotion: **Confidence** · Journey stage: **Decide** · Cognitive load: **3** · Max decisions: **2** (Start/Continue · leave)

---

## 1. Pixel Discipline (product rule for UI execution)

Applies to CAP-004 and every subsequent Learn UI PR.

**Allowed only:**

| Concern | Permitted values |
|---------|------------------|
| Spacing | `4 · 8 · 16 · 24 · 32 · 48 · 64 · 80` (`LMS_SPACING` / `LMS_SPACING_SCALE`) |
| Radius | Input `14` · Button `16` · Card `24` · Dialog `28` |
| Type | Display `48` · H1 `40` · H2 `32` · H3 `24` · Body `16` · Caption `14` · Meta `12` |
| Motion | Hover `120` · Accordion `220` · Bottom sheet `300` · Route `250` (ms) |
| Container | Content `1280` · Prose `65ch` · Lesson content `1100` |
| Shadow | **One** elevation only (`shadow-sm`) |
| Color | Page `#FAFAFA` · Surface white · Primary text/CTA black · Secondary gray · Accent green **only** for progress / success / civic impact |

**Forbidden examples (instant Critic fail):**

```css
padding: 22px;
border-radius: 19px;
margin-top: 37px;
font-size: 15px;
```

If a needed value is missing from tokens, **extend the token file in the same PR** with a named token — never inline a one-off.

---

## 2. Screen anatomy (deliverables)

```
Course Detail (/learn/courses/[courseSlug])

├── Breadcrumb
├── JourneyHero (60/40)
│   ├── Media
│   ├── JourneyMeta
│   ├── ProgressBadge / ProgressBar
│   └── Primary CTA (in-hero, desktop + tablet)
├── Journey Overview (description)
├── Learning Outcomes
├── Module Accordion
├── Sticky CTA (mobile only — when hero CTA out of view)
├── Loading Skeleton
├── Empty / not applicable (use Error)
├── Error State (404)
├── Motion
└── Accessibility
```

**Out of scope for CAP-004 (do not add):**

- Price / cart / mentors / rating stars / “bestseller” chrome  
- Community rating  
- Desktop sidebar  
- Reviews section (v2 — stays deferred)  
- Secondary “Save for later” (v2)  
- Requirements as always-visible list competing with outcomes — **requirements move behind progressive disclosure** or stay a short collapsed block (see §8)

---

## 3. Layout & responsive (exact)

### Breakpoints (Tailwind; do not invent midpoints)

| Name | Range | Behavior |
|------|-------|----------|
| **Mobile** | `< 768px` (`default` → `< md`) | Stacked hero (media above info). Sticky CTA bar above bottom nav. Bottom nav visible. |
| **Tablet** | `768px – 1023px` (`md`–`lg`) | Stacked hero (same as mobile) OR optional softer stack; **no** 60/40 until `lg`. Sticky CTA above bottom nav until `lg`. |
| **Desktop** | `≥ 1024px` (`lg+`) | 60/40 hero row. CTA **in hero only** (not sticky). Top nav; **never** sidebar. |

### Container

| Token | Value |
|-------|-------|
| Page max width | `1280` (`LMS_LAYOUT.maxWidth`) |
| Horizontal page pad | Mobile `16` · Tablet/Desktop `24`–`32` (only scale values) |
| Section vertical gap | `32` between major blocks · `48` before Modules |
| Prose / overview width | `65ch` (`.ljp-prose` / `max-w-prose`) |

---

## 4. Hero (`JourneyHero`)

### Composition

| Side | Ratio | Contents |
|------|-------|----------|
| Media | **60%** | Journey image |
| Info | **40%** | Meta badges → H1 → subtitle → JourneyMeta row → Progress → Primary CTA |

Desktop grid: `lg:grid-cols-[3fr_2fr]` (equivalent 60/40).  
**Do not** put Description or Learning Outcomes inside the hero.

### Media

| Question | Spec |
|----------|------|
| Corner radius | Card large **24** (`LMS_RADIUS.cardLg` / outer hero shell `rounded-3xl`) |
| Aspect — mobile/tablet | `16 / 10` |
| Height — desktop | `min-height: 280px` (allowed named constant `heroDesktopMinHeight: 280` — add to tokens if missing); fill column height |
| Object fit | `cover` |
| Sizes attr | `(max-width: 1024px) 100vw, 60vw` |
| Alt | Decorative `alt=""` when title is adjacent in info; descriptive alt only if image carries meaning beyond title |
| Fallback | Surface `#FFFFFF` + centered muted category initial (Meta `12` / Caption `14`) — no stock LMS illustration chrome |

### Typography (info column)

| Element | Size | Weight / tone |
|---------|------|----------------|
| H1 (journey title) | Mobile `32` (H2) · Desktop `40` (H1) | Semibold / tight tracking |
| Subtitle | `16` Body · secondary gray | Regular |
| Description in hero | **Forbidden** — overview lives below | — |
| Meta row | `12` Meta · secondary | Icon `16` + gap `8` |
| Badges | Caption `14` | One category + one difficulty max in badge row |

### Spacing (info column)

| | |
|--|--|
| Pad mobile | `24` |
| Pad desktop | `32` |
| Stack gap | `16` between logical groups; `24` before CTA |
| Max line length (subtitle) | ≤ **60ch** |

### Progress in hero

- `ProgressBar` using completed/total lessons from catalog helpers + runtime.  
- Accent green **only** on the filled track (meaningful progress).  
- Label: Caption `14` — “{n} of {total} lessons” (or equivalent calm copy).

---

## 5. Journey Metadata (fields — decided)

Replace price / marketplace meta. **Include in v1:**

| Field | Source | Display | Required |
|-------|--------|---------|----------|
| **Estimated Time** | `course.durationMinutes` | “{n} min” or “~{h}h {m}m” if ≥ 60 | Yes |
| **Difficulty** | `course.difficulty` | Beginner / Intermediate / Advanced | Yes |
| **Citizens Completed** | `course.citizensCompleted?: number` | “{n} citizens completed” — **hide row if null/undefined** | Optional data |
| **Certificate** | `course.awardsCertificate?: boolean` | “Certificate available” — show only if `true` | Optional |
| **Category** | `course.category` | Single badge above title (not duplicated as meta icon row) | Yes |

**Explicitly excluded from CAP-004:**

| Field | Decision |
|-------|----------|
| Community Rating | **Reject** — marketplace pattern (RX-001) |
| Language | **Omit** until multi-locale product need |
| Updated | **Omit** from hero (noise at decide moment) |
| Instructor | **Omit** from hero (civic journeys > personality marketplace); may appear in Overview footer later if needed |
| Price | **Never** |

Add optional typed fields on `LmsCourse` in the CAP-004 PR when wiring Citizens / Certificate — data may be stubbed; UI must hide empty optional meta.

---

## 6. Primary CTA

### Copy (runtime-owned via `resolveContinueLesson`)

| State | Label | Notes |
|-------|-------|-------|
| Not started | **Start Journey** | |
| In progress | **Continue Learning** | |
| All complete | **Review** | Soft — not a second enroll |

Accessible name: include journey title — e.g. `Start Journey: {title}`.

### Desktop / Tablet (≥ md info column; sticky only &lt; lg)

| | Spec |
|--|------|
| Location | End of hero info column |
| Width | Full width of info column on mobile; `auto` min width on `sm+` inside column · touch target ≥ `44` |
| Height | `min-h-11` (44) |
| Radius | Button **16** (`rounded-xl`) |
| Color | Black primary (`ljp-btn-primary`) — **not** accent green |
| Sticky | **No** on `lg+` |

### Mobile sticky CTA

| | Spec |
|--|------|
| When | `position: sticky/fixed` bar when hero primary CTA is **not** intersecting viewport |
| Placement | Above bottom nav; `pb = 16 + env(safe-area-inset-bottom)` · clear `--mobile-nav-height` |
| Width | Full bleed content pad `16` |
| Same label / href as hero CTA | Yes — single action, two placements |
| Disabled | Opacity `60%` · `aria-disabled` · no navigation |
| Loading | Button label → “Opening…” · spinner optional Meta size · no layout jump |
| Completed (`Review`) | Same black primary (not green) |

Secondary CTA: **none** in CAP-004.

---

## 7. Learning Outcomes

| Question | Spec |
|----------|------|
| Maximum | **4** outcomes displayed |
| Source | Prefer `course.learningOutcomes?: string[]`; else first 4 unique module `objectives` |
| Icons | Single check / civic mark · muted or success green **only** if completed journey; otherwise secondary gray |
| Layout | Vertical list · gap `8` · no card chrome around each row |
| Desktop | Within prose width under Overview |
| Mobile | Full content width · same list |
| Section title | H3 `24` — “What you’ll learn” (Civic Warmth ok) |
| If empty | **Hide entire section** (Empty State = absent section, not a box saying “none”) |

---

## 8. Journey Overview

| | Spec |
|--|------|
| Section title | H3 `24` — “About this journey” (prefer “journey” over “course” in user-facing copy where easy) |
| Body | `16` · secondary · `65ch` · ≤ **3 short paragraphs** |
| Requirements | Collapsed by default (`<details>` or accordion-of-one) · Caption header “Requirements” · not a competing primary block |
| Spacing above Modules | `48` |

---

## 9. Module Accordion

| Question | Spec |
|----------|------|
| Single open? | **Yes** — Law 5 (`type="single"` collapsible) |
| Default | **All collapsed** |
| Auto-expand current? | **Yes** — if exactly one module has `in_progress`, open it; else all collapsed |
| Icons | Status icon right (Completed / In progress / Available / Locked) |
| Progress | Header shows lesson count + duration; optional “{done}/{total}” Caption when any lesson complete |
| Locked | Trigger `disabled` · opacity `70%` · Lock icon · no expand |
| Completed | Check icon · success green on icon only |
| Hover | Background / border quiet shift · **120ms** |
| Motion | Height / content · **220ms** (`LMS_MOTION.accordionMs`); honor `prefers-reduced-motion` |
| Card radius | **24** |
| Lesson rows | Radius **16** · pad `16` vertical · hover `120ms` |
| Header tap | Expand only — **never** navigate to Module Overview |
| Lesson tap | → Lesson route if unlocked |

---

## 10. Breadcrumb

```
Learn › {Journey title}
```

- Caption/Meta `14`/`12` · secondary  
- `Learn` → Home (`LmsRoutes.home`)  
- Current page plain text (not a link)  
- Gap `8` · separator `›`  
- Margin below breadcrumb → hero: `24`

---

## 11. Loading / Empty / Error

| State | Spec |
|-------|------|
| **Loading** | Hero shell skeleton (60/40 blocks) + **3** module card skeletons · radii match · shimmer calm · no spinner-of-death full page if streamable |
| **Empty** | N/A for known routes — missing optional sections simply omit |
| **Error** | Unknown slug → `notFound()` 404 · calm Learn-branded not-found (existing app pattern) · one link back to Catalogue/Home |

---

## 12. Motion summary

| Interaction | Duration |
|-------------|----------|
| CTA / lesson row hover | `120ms` |
| Accordion open/close | `220ms` |
| Sticky CTA appear/dismiss | `250ms` route-class ease (or `220` if shared accordion token — pick **250** for enter/exit bar) |
| Page route | `250ms` |
| Decorative motion | **Forbidden** |

---

## 13. Accessibility

- Landmark: breadcrumb `nav[aria-label=Breadcrumb]` · hero `section` · modules region labeled  
- CTA accessible name includes journey title  
- Accordion: `aria-expanded` · locked `aria-disabled`  
- Focus order: Breadcrumb → Hero CTA → Outcomes → Module triggers → Lesson links → (Sticky CTA when present)  
- Touch targets ≥ `44`  
- Contrast: primary CTA and body text WCAG AA  
- Reduced motion: collapse accordion / sticky transitions to instant or `0.01ms` (existing `.learn-root` rule)

---

## 14. Component checklist (CAP-004 validates)

Reference names (implement or alias existing paths):

| Contract name | Current / target path | Must be reference-quality |
|---------------|----------------------|---------------------------|
| `JourneyHero` | `course/course-hero.tsx` | Yes |
| `JourneyMeta` | extract from hero | Yes |
| `PrimaryButton` | `.ljp-btn-primary` / shared button | Yes |
| `ModuleAccordion` | `course/module-accordion.tsx` | Yes |
| `SectionHeader` | `LmsSection` / extract | Yes |
| `LearningOutcome` | new list item | Yes |
| `ContentContainer` | `LmsPage` + `LMS_LAYOUT.maxWidth` | Yes |
| `Breadcrumb` | page or extract | Yes |
| `ProgressBadge` / bar | existing `ProgressBar` | Yes |
| `DifficultyBadge` | badge on difficulty | Yes |
| `LoadingSkeleton` | new or compose | Yes |
| Sticky course CTA | compose ContinueButton pattern | Yes |

Home / Catalogue / Progress **compose** these — they do not fork visual language.

---

## 15. Acceptance matrix (CAP-004 passes only if all checked)

```
□ RX-001 feel (calm, editorial, civic — not LMS)
□ VAS-001 all checks
□ FT1 Recognizable as BNS Learn without logo
□ FT2 One action dominates
□ FT3 Layout breathes
□ FT4 Removing any element would not improve (or already removed)
□ FT5 RX-001 designer would approve
□ Experience Drift (noise low · ≤2 actions · focus <3s · civic warmth)
□ Architecture Drift note updated (ledger + audit Knowledge)
□ Accessibility (§13)
□ Motion (§12) — state only
□ Responsive (§3) — exact breakpoints
□ Skeleton
□ Empty (omit sections)
□ Error (404)
□ Tests (hero CTA states · accordion single-open · continue resolve · optional meta hide)
□ Critic C1–C5 PASS
□ Pixel Discipline — no invented values
□ platform_changes: 0
```

Evidence: `agent/reviews/LJP-004.md` + ledger `CAP-course-detail` → `complete` only when matrix done.

---

## 16. Inheritance rule (after CAP-004)

When CAP-004 is `complete`:

> Would this look at home beside the Course Detail screen?

If no → revise the new screen.  
If yes by **reuse** → proceed.  
If yes only by **new pattern** → fail OSS interaction / Pixel Discipline unless ADR + Rule of Three (platform still frozen).

---

## 17. Gap vs current implementation (knowledge — build against)

| Area | Current | Contract target |
|------|---------|-----------------|
| Hero | Partial 60/40 · description in hero | Remove description from hero; overview below |
| CTA copy | Start Journey / Continue / Review | Keep — ensure a11y name |
| Sticky mobile CTA | Missing | Add |
| Learning Outcomes | Missing | Add §7 |
| Meta | Time + difficulty only | Add optional citizens + certificate; exclude rating |
| Requirements | Always open list | Collapse by default |
| Auto-expand in_progress | No | Yes |
| Skeletons | Missing | Add |
| Token radius dialog `28` | Not used here | N/A unless dialog |
| Section copy “course” | “About this course” | Prefer journey wording |

---

## Related

| Doc | Role |
|-----|------|
| `docs/screen-contracts/course-detail.md` | Behavioral screen contract — this SIC is the **visual binding** |
| `docs/lms-spec/ui-completion-roadmap.md` | Phase A program |
| `agent/runtime/capability-ledger.yaml` | CAP-course-detail acceptance |
| `src/constants/lms-design-tokens.ts` | Sole numeric source |
