# DESIGN.md
## Budget Niyo — Digital Experience System

---

# Brand Vision

Budget Niyo is not a startup.

It is not a SaaS dashboard.
It is not a nonprofit template.
It is not a corporate civic platform.

Budget Ndio is a movement-documentation platform.

The digital experience must feel:
- cinematic
- intelligent
- trustworthy
- activist-driven
- editorial
- emotionally grounded
- modern African
- globally premium

The experience should communicate:

> “Public participation is powerful, human, and unavoidable.”

Users should feel:
- informed
- emotionally connected
- calm
- inspired
- empowered

Never playful.
Never noisy.
Never over-designed.

---

# Design Philosophy

## Core Principle

The interface should disappear.

Content, storytelling, and civic emotion should dominate.

Every component must support:
- clarity
- emotional pacing
- narrative flow
- credibility

Avoid “UI for UI’s sake.”

---

# Emotional Direction

The product should feel like a blend of:

- Apple keynote storytelling
- Stripe editorial systems
- A24 documentary pacing
- Notion simplicity
- Modern investigative journalism

NOT:
- generic NGO websites
- startup templates
- dribbble experiments
- flashy fintech dashboards
- over-animated landing pages

---

# Global Experience Rules

## Rule 1 — Story First

Every page must read like a narrative.

Users should move through sections emotionally, not mechanically.

The page should have:
- tension
- release
- breathing room
- impact moments
- transitions

Sections should not feel isolated.

---

## Rule 2 — Motion Must Be Invisible

Motion should support focus.

Users should FEEL fluidity.
They should not NOTICE animation.

Good motion feels inevitable.

---

## Rule 3 — Fewer Components

Avoid excessive:
- cards
- pills
- badges
- containers
- floating panels
- decorative gradients

Use typography and spacing before introducing UI.

---

## Rule 4 — Large Typography Wins

Typography is the primary design element.

Images support typography.
UI supports typography.
Motion supports typography.

Never let small UI elements dominate large ideas.

---

## Rule 5 — Restraint Creates Luxury

The interface should never try too hard.

Premium design comes from:
- confidence
- spacing
- rhythm
- consistency
- simplicity

Not decoration.

---

# Motion System

## Motion Philosophy

Motion should feel:
- soft
- cinematic
- intelligent
- calm
- continuous

Never:
- bouncy
- aggressive
- gimmicky
- chaotic
- “framer-motion-template” style

---

# Motion Specifications

## Easing

ONLY use:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

Alternative:

```css
ease-out
```

Never use:
- bounce
- elastic
- exaggerated spring physics

---

## Durations

| Interaction | Duration |
|---|---|
| Micro hover | 200–300ms |
| Section reveal | 700–1000ms |
| Hero transitions | 1200–2400ms |
| Parallax | scroll-linked |
| Page transitions | 900–1400ms |

---

## Motion Distance

Maximum movement:

```css
translateY(24px)
```

Preferred:

```css
translateY(8px – 16px)
```

Scale:

```css
0.96 → 1
```

Avoid dramatic movement.

---

## Stagger Rules

Children animate:

```txt
60ms – 100ms apart
```

Never random staggering.

---

## Scroll Behavior

Scrolling should feel:
- layered
- atmospheric
- editorial

Use:
- sticky transitions
- overlapping sections
- fade reveals
- soft parallax
- cinematic image scaling

Avoid:
- excessive scroll hijacking
- abrupt snapping
- over-engineered timelines

---

# Layout System

## Layout Philosophy

The layout should feel:
- spacious
- asymmetric
- editorial
- cinematic

NOT:
- dashboard-like
- boxed-in
- overly grid-rigid

---

# Spacing System

ONLY use the following spacing scale:

```txt
4
8
12
16
24
40
64
96
144
```

Never introduce random spacing values.

Spacing consistency is critical.

---

# Section Rhythm

The page must alternate between:

- dense sections
- breathing sections
- emotional sections
- informational sections

Never stack multiple dense sections back-to-back.

---

# Grid System

Desktop:
- 12-column grid

Tablet:
- 6-column grid

Mobile:
- fluid stacked layout

Prefer asymmetry over rigid symmetry.

---

# Typography System

## Typography Philosophy

Typography is the interface.

Every heading should feel intentional.

The typography should communicate:
- seriousness
- intelligence
- confidence
- clarity

---

# Font Direction

Primary style:
- modern grotesk
- neutral
- highly legible

Suggested:
- Inter
- Suisse Intl
- Geist
- SF Pro

---

# Heading Rules

Headlines should:
- be large
- bold
- tight
- visually dominant

Recommended:

```css
line-height: 0.95 – 1.05;
letter-spacing: -0.04em;
font-weight: 700–900;
```

---

# Body Copy

Body text should:
- breathe
- remain narrow
- prioritize readability

Recommended:

```css
max-width: 65ch;
line-height: 1.6 – 1.8;
```

---

# Label Styling

Eyebrow labels should be:
- uppercase
- subtle
- minimal
- well-spaced

Recommended:

```css
font-size: 11px – 13px;
letter-spacing: 0.12em;
text-transform: uppercase;
```

---

# Color System

## Color Philosophy

The interface should rely on:
- depth
- atmosphere
- contrast

Not bright colors.

---

# Primary Palette

## Base

```txt
#050505
#0D0D0D
#111111
#F5F5F3
#FFFFFF
```

## Accent

Use blue sparingly.

Suggested:

```txt
#2563EB
#3B82F6
```

Blue should highlight meaning.
Not decorate.

---

# Surface Rules

Avoid:
- heavy shadows
- glassmorphism
- colorful gradients
- excessive blur

Preferred depth techniques:
- layered opacity
- subtle borders
- tonal separation
- cinematic overlays

---

# Imagery Direction

## Photography Philosophy

Images should feel:
- human
- documentary
- grounded
- emotionally honest

Avoid:
- stock photos
- corporate smiling
- staged imagery
- artificial lighting

---

# Portrait System

Portraits should:
- feel iconic
- use dramatic crops
- prioritize facial emotion
- use intentional negative space

Avoid LinkedIn-style presentation.

---

# Image Treatment

Preferred:
- monochrome
- soft grain
- muted contrast
- cinematic lighting

Optional:
- subtle blue tint overlays

---

# Component Principles

## Buttons

Buttons should feel:
- calm
- minimal
- precise

Avoid:
- giant rounded pills
- excessive shadows
- glowing effects

Recommended:

```css
border-radius: 999px;
padding: 12px 20px;
```

Hover:
- subtle opacity shift
- slight background transition

Never bounce.

---

# Cards

Cards should be used sparingly.

Too many cards create:
- startup energy
- SaaS aesthetics
- visual fatigue

If possible:
- remove card
- use spacing instead

---

# Navigation

Navigation should:
- disappear visually
- remain elegant
- feel lightweight

Use:
- transparent navbar over hero
- blur only when scrolling
- subtle transitions

Avoid:
- oversized navbars
- boxed navs
- loud interactions

---

# Hero System

## Hero Philosophy

The hero is the emotional anchor.

It must:
- establish credibility
- create emotional gravity
- communicate urgency
- feel cinematic

---

# Hero Structure

Preferred layout:

Left:
- large statement
- minimal supporting text
- single CTA

Right:
- documentary visual

Never overcrowd.

---

# Hero Motion

On load:

Background:
- scale 1.08 → 1
- slow reveal

Headline:
- staggered line reveal
- fade upward

CTA:
- delayed fade

Navbar:
- independent fade

---

# Scroll Storytelling

Pages should feel connected.

Preferred techniques:
- overlapping sections
- sticky content
- narrative scrolling
- image progression
- typography transitions

Avoid:
- isolated blocks
- abrupt transitions
- endless card stacks

---

# Team Section Direction

The team section must feel:
- human
- prestigious
- cinematic
- intelligent

NOT:
- employee directory
- LinkedIn profiles

---

# Team Layout

Preferred:
- alternating asymmetry
- oversized portraits
- editorial spacing
- large typography

Each person should feel important.

---

# CTA Sections

CTA sections should feel emotional.

Use:
- massive typography
- minimal copy
- dark immersive surfaces
- restrained motion

Example:

> EVERY SHILLING HAS A STORY.

---

# Footer Philosophy

The footer is not the end.

It should feel like:
- continuation
- atmosphere
- quiet resolution

Use:
- giant faded typography
- subtle gradients
- layered depth
- elegant spacing

---

# Mobile Experience

## Mobile Philosophy

Mobile is primary.

The experience should feel:
- cinematic
- fluid
- lightweight
- premium

Never:
- cramped
- over-animated
- dense

---

# Mobile Motion

Reduce:
- parallax intensity
- animation frequency
- simultaneous transitions

Maintain:
- smoothness
- narrative flow
- emotional pacing

---

# Performance Rules

Performance is part of design.

A laggy premium interface is not premium.

---

# Performance Standards

Target:

- 90+ Lighthouse
- smooth 60fps scrolling
- minimal layout shift
- optimized imagery

Avoid:
- unnecessary JS
- oversized animation libraries
- excessive blur layers
- unoptimized videos

---

# AI Agent Rules

## NEVER ALLOW

The AI agent must NEVER:

- add random gradients
- invent new spacing values
- introduce new animation curves
- overuse glassmorphism
- add unnecessary shadows
- over-round elements
- animate everything simultaneously
- use generic Framer presets
- introduce colorful UI elements
- add floating icons unnecessarily
- create inconsistent paddings
- create visual noise

---

# ALWAYS PRIORITIZE

The AI agent must ALWAYS prioritize:

- typography
- spacing
- rhythm
- cinematic pacing
- emotional clarity
- simplicity
- consistency
- restraint

---

# Quality Benchmark

Every section should pass this test:

> “Would this feel natural in an Apple keynote?”

And:

> “Would this still feel premium if all animations were removed?”

If the answer is no:
- simplify
- remove elements
- reduce decoration
- improve hierarchy

---

# Final Principle

Budget Niyo is documenting civic participation.

The interface should respect that responsibility.

The design must feel:
- serious
- human
- timeless
- intentional
- emotionally intelligent

Not trendy.

Timeless.

