# Visual Polish Sprint v1.1
## Design System Validation Execution Specification (final design sprint before Phase A delivery)

```yaml
id: VPS-001
date: 2026-07-08
status: active
scope: shared_learn_components
goal: raise_rx001_compliance
mode: pixel_level_implementation_contract
phase_a_design_sprints_remaining: 0
resume_feature_delivery_after: sprint_pass
platform_changes: 0
interaction_patterns_added: 0
navigation_changes: 0
runtime_changes: 0
component_philosophy: unchanged
```

> This sprint does not add new product patterns.  
> It upgrades shared component craftsmanship so CAP-005/006/007 inherit quality automatically.  
> This is the last design sprint in Phase A. After pass, Phase A is composition-only.

---

## Objective

Raise Budget Ndio Story Learn from "well-designed SaaS" to "editorial learning experience" by refining:

- presentation
- composition
- hierarchy
- rhythm
- civic warmth

No constitution or runtime changes allowed.

---

## Success Criteria

If a screenshot is shown beside RX-001 with logos removed, it should still feel like the same family.

---

## Sprint Tracks (deterministic)

### Sprint 1 — Editorial Layout System (P0)

```yaml
max_width: 1280
content_padding:
  desktop: 48
  tablet: 32
  mobile: 20
vertical_rhythm:
  hero_to_section: 64
  section_to_section: 64
  heading_to_content: 24
  card_internal: 24
  micro: [8, 16]
```

Builder must not invent spacing values.

### Sprint 2 — Hero System (P0)

```yaml
desktop:
  height: 420
  layout: "60/40"
  radius: xl
  image_priority: high
tablet:
  height: 360
  stack: false
mobile:
  height: 300
  stack: vertical
  sticky_cta: true
```

Hero must answer only:
1. What am I learning?
2. Why should I care?
3. What do I do next?

### Sprint 3 — Typography (P0)

Reading order is fixed:
`Display -> H1 -> Section -> Card title -> Body -> Metadata`

Metadata never competes with titles.

### Sprint 4 — Card Hierarchy (P0)

```yaml
weights:
  JourneyHero: 100
  ContinueCard: 90
  JourneyCard: 70
  AchievementCard: 60
  MetaCard: 40
```

### Sprint 5 — Contrast System (P0)

Use semantic layers, not ad hoc values:

```yaml
canvas: learn.background
surface: learn.surface
surface_elevated: learn.surface.elevated
surface_interactive: learn.surface.hover
border: learn.border.subtle
```

### Sprint 6 — Imagery + Journey Cards (P0)

Imagery rules:

| Component | Rule |
|-----------|------|
| Hero | Cinematic 16:9, focal-aware |
| JourneyCard | Consistent crop ratio |
| ContinueCard | Same image language as Hero |
| AchievementCard | Iconography only |

JourneyCard information order:
`image -> difficulty -> time -> title -> description -> progress -> continue`

### Sprint 7 — Motion Primitives (P0)

Only these primitives:
- Fade
- Scale
- Slide
- Accordion

No bespoke animation types.

### Sprint 8 — Component Polish Matrix (P0)

| Component | Required improvements |
|-----------|------------------------|
| JourneyHero | Height, hierarchy, spacing, crop, CTA, responsive |
| ContinueCard | Breathing room, progress integration, CTA emphasis |
| JourneyCard | Metadata alignment, image rhythm, hover refinement |
| AchievementCard | Compact layout, celebratory tone, icon spacing |
| SectionHeader | Editorial spacing, subtitle rhythm |
| ProgressBar | Shared token usage, integrated accent |
| Badge | Typography and padding consistency |

### Sprint 9 — Civic Warmth Copy (P1)

Microcopy refinement for tone (example direction):

- "Recommended" -> "Continue exploring"
- "Recently viewed" -> "Continue where you left off"
- "Achievements" -> "Milestones"

### Sprint 10 — Pixel Discipline Merge Blocker (P0)

Reject any introduced one-off values like:

```css
padding:22px;
margin-top:37px;
font-size:15px;
border-radius:19px;
```

All values must resolve to approved tokens.

---

## Critic Gate (required)

All updated components must pass:

- RX-001
- FT1, FT2, FT3, FT4, FT5
- Civic Warmth
- Editorial Rhythm
- Pixel Discipline
- Experience Drift = 0
- platform_changes = 0

---

## Builder Rule

> Do not invent. Refine.

Every change must answer yes to at least one:

- improves visual hierarchy
- improves readability
- improves rhythm
- strengthens BNS Learn identity
- increases Phase A reuse

If none apply, do not ship the change.

---

## Deliverables (evidence, not claims)

```yaml
JourneyHero:
  before_after: required
  spacing_audit: pass
  typography_audit: pass
  token_audit: pass
  family_test: pass
ContinueCard:
  before_after: required
  rhythm_audit: pass
  hierarchy_audit: pass
JourneyCard:
  imagery_audit: pass
  metadata_audit: pass
  hover_audit: pass
```

VC-001 evidence package is mandatory:

- screenshot set (desktop/tablet/mobile)
- before/after captures for changed shared components
- score matrix (>=90)
- CQI updates
- visual drift report (<=5)

---

## Definition of Done

- All shared components refined per matrix.
- No new interaction patterns introduced.
- All spacing/type/radius/motion values resolve to tokens.
- CAP-005 inherits refined components without bespoke styling.
- Critic signoff:
  - RX-001: PASS
  - Family Test FT1-FT5: PASS
  - Editorial Rhythm: PASS
  - Civic Warmth: PASS
  - Pixel Discipline: PASS
  - Platform Changes: 0

After this sprint, visual language is frozen for Phase A; remaining work is composition and implementation.

