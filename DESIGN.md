---
name: BudgetNdio Learning Hub
description: Financial education with personality — playful, engaging, and boldly clear.
colors:
  primary: "#0055FF"
  primary-hover: "#0044CC"
  background: "#FFFFFF"
  foreground: "#000000"
  muted-bg: "#F5F5F5"
  muted-fg: "#6B6B6B"
  surface: "#FFFFFF"
  border: "rgba(0,0,0,0.08)"
  accent-warm: "#FF6B35"
  success: "#10B981"
  warning: "#F59E0B"
  destructive: "#E74653"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 3vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1rem, 2vw, 1.125rem)"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "#FFFFFF"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  card-default:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  card-hover:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  input-default:
    backgroundColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    borderColor: "{colors.border}"
  input-focus:
    borderColor: "{colors.primary}"
---

# Design System: BudgetNdio Learning Hub

## 1. Overview

**Creative North Star: "The Knowledge Studio"**

The Learning Hub is a workshop for financial skills — a place where complex concepts are made tangible through clear writing, satisfying interaction, and bold visual energy. Every screen feels like walking into a well-organized studio: tools are where you expect them, progress is visible at a glance, and the space itself makes you want to learn.

This system is **flat by default**, relying on spacing, color, and typographic weight rather than shadows or gradients to create hierarchy. Borders are subtle (0.08 opacity), corners are generous (10px default radius), and the primary accent (Surge Blue) is used sparingly — its rarity is its power.

**What this system explicitly rejects:** No gamification gimmicks (streak anxiety, cartoon mascots, sound effects). No LMS sterility (dense tables, academic greys, cluttered dashboards). No SaaS clichés (hero metrics, gradient text, side-stripe borders).

**Key Characteristics:**
- Bold color used intentionally, not decoratively
- Flat surfaces with interaction-driven elevation
- Generous whitespace and breathing room
- Typography as the primary expressive tool
- Motion that explains, not entertains
- Cards are a container of last resort — prefer content-first layouts

## 2. Colors

The palette is anchored by **Surge Blue**, a high-energy primary that communicates confidence without aggression. Neutrals lean cool and clean — no warm-tinted creams or beiges. Accent colors are reserved for specific semantic roles.

### Primary
- **Surge Blue** (#0055FF): Primary actions, active navigation, key interactive elements. Used at full saturation only — never dimmed, never gradient. Appears on ≤15% of any given screen.

### Neutral
- **Background** (#FFFFFF): Default surface, cards, and page background.
- **Muted Background** (#F5F5F5): Secondary surfaces, sidebar backgrounds, code blocks.
- **Foreground** (#000000): Primary body text and headings.
- **Muted Foreground** (#6B6B6B): Secondary text, metadata, placeholders.
- **Border** (rgba(0,0,0,0.08)): All dividers, input strokes, card outlines.

### Semantic
- **Accent Warm** (#FF6B35): Progress indicators, achievements, "you're on a roll" moments. The playful counterpoint to Surge Blue.
- **Success** (#10B981): Completion states, correct answers, module done.
- **Warning** (#F59E0B): Streak warnings, expiring content, caution.
- **Destructive** (#E74653): Errors, destructive actions, incorrect answers.

### Named Rules
**The Surge Rule.** Primary blue covers ≤15% of any screen. It is for actions and wayfinding only. If a design needs more color weight, pull from the neutral ramp, not from Surge Blue.
**The No-Warm-Bg Rule.** Backgrounds are cool or neutral. No cream, beige, sand, or parchment tones. Warmth is carried by Accent Warm in small, intentional doses.

## 3. Typography

**Display Font:** Geist (system-ui, sans-serif fallback)
**Body Font:** Geist (single-family system)
**Label Font:** Geist (mono-weight for data, code, and labels)

**Character:** A single geometric sans-serif (Geist) used across all roles, differentiated by weight and size rather than by font swapping. This gives the system a clean, modern voice without the "AI default" feel of Inter or the tiredness of Roboto. The weight range (400–700) provides enough contrast for clear hierarchy.

### Hierarchy
- **Display** (Bold 700, clamp(1.75rem, 4vw, 2.5rem), 1.2): Hero headings on dashboard and module landing. `text-wrap: balance`. Max 3 per page.
- **Headline** (Semibold 600, clamp(1.25rem, 3vw, 1.75rem), 1.3): Section headings within pages.
- **Title** (Semibold 600, clamp(1rem, 2vw, 1.125rem), 1.4): Card titles, module names, list item headings.
- **Body** (Regular 400, 0.9375rem, 1.65): Article content, descriptions, paragraphs. Cap line length at 70ch.
- **Label** (Medium 500, 0.8125rem, 1.4, 0.01em letter-spacing): Button text, form labels, timestamps, metadata.

### Named Rules
**The Weight-Is-Hierarchy Rule.** Never use color, size, or decoration to establish hierarchy when a weight change will do. The typographic scale (400 → 500 → 600 → 700) is the primary hierarchy tool.

## 4. Elevation

The system is **flat by default**. Surfaces sit on the same plane; hierarchy is established through spacing, color, and typography, not through shadows.

Shadows appear **only as interactive responses**: a card lifts on hover, a dropdown appears above content, a modal sits above a scrim. At rest, nothing casts a shadow.

When a shadow is called for, use a single level:
- **Hover lift** (`0 4px 12px rgba(0,0,0,0.1)`): Cards elevate on hover.
- **Floating UI** (`0 8px 24px rgba(0,0,0,0.12)`): Dropdowns, popovers, tooltips.
- **Modal** (`0 16px 48px rgba(0,0,0,0.2)`): Dialogs and drawers.

### Named Rules
**The Flat-By-Default Rule.** No surface casts a shadow at rest. Elevation is a state, not a style.

## 5. Components

### Buttons
- **Shape:** Generous rounded corners (10px). Pill-like but not circular.
- **Primary:** Surge Blue background, white text, 12px 24px padding. Hover darkens to #0044CC. Focus ring uses Surge Blue at 0.5 opacity.
- **Ghost:** Transparent background, foreground text. Hover gains a subtle background (`rgba(0,0,0,0.05)`). For secondary actions and toolbar items.
- **Outline:** Border-only (border color), transparent background. Hover fills with background color.
- **All buttons** use `transition: background 0.2s, transform 0.15s; transform: translateY(-1px)` on hover.

### Cards / Containers
- **Corner Style:** Large radius (16px). Content feels wrapped, not cut off.
- **Background:** White surface with 1px border (`rgba(0,0,0,0.08)`) — no shadow at rest.
- **Hover:** Shadow lift (`0 4px 12px rgba(0,0,0,0.1)`).
- **Padding:** 24px default. Tighter variant (16px) for card grids.
- **Nested cards are prohibited.** If a card needs internal grouping, use background tints or dividers.

### Inputs / Fields
- **Style:** Full border stroke at 0.08 opacity, 10px radius. Background matches page bg.
- **Focus:** Border shifts to Surge Blue, ring glow at 0.3 opacity.
- **Error:** Border shifts to Destructive (#E74653).
- **Placeholder:** Muted Foreground (#6B6B6B) at full opacity — no reduced-opacity placeholders.

### Navigation (Sidebar)
- **Style:** Clean list with 10px radius hover state. Active item uses Surge Blue text with a subtle background tint.
- **Typography:** Title weight (500/0.875rem) for top-level, Label weight for sub-items.
- **Mobile:** Bottom navigation bar with icon + label. Active state uses Surge Blue.

### Signature Component: Progress Bar
- **Track:** 6px height, rounded-full, Muted Background.
- **Fill:** Accent Warm (#FF6B35) gradient-free solid fill.
- **Label:** Small text right-aligned showing percentage.
- **Transition:** Width animates with `ease-out-quart` over 0.6s.

### Signature Component: Module Card
- **Layout:** Image or gradient thumbnail top (160px height), content bottom.
- **Content:** Title (Title weight), description (Body, 2-line clamp), bottom row: difficulty badge + estimated time + progress dot.
- **Hover:** Card lifts, thumbnail zooms 1.02x.

## 6. Do's and Don'ts

### Do:
- **Do** use Surge Blue for exactly one primary action per viewport.
- **Do** use generous whitespace — 48px+ between major sections, 24px between grouped items.
- **Do** use `text-wrap: balance` on headings to prevent rag orphans.
- **Do** animate progress and state changes with `ease-out-quart` (0.6s for progress, 0.2s for interactions).
- **Do** show completion and progress using Accent Warm (#FF6B35) — it's the "you did it" color.
- **Do** respect reduced motion with instant transitions and no entrance animations.
- **Do** cap body text at 70ch for comfortable reading.

### Don't:
- **Don't** use gradient text (`background-clip: text` with gradient) anywhere.
- **Don't** use side-stripe borders (border-left/right >1px as color accent) on cards or list items.
- **Don't** use glassmorphism or backdrop-blur as a decorative default.
- **Don't** use bounce or elastic easing — ever. Stick to `ease-out` and `ease-out-quart`.
- **Don't** use cards nested inside cards. Use background tints or dividers instead.
- **Don't** use pure black text on colored backgrounds. Use a darker shade of the background's hue.
- **Don't** use tiny uppercase tracked eyebrow labels above every section. One deliberate kicker is voice; every-section eyebrows are AI scaffolding.
- **Don't** hide content behind animations. Every element must be visible at rest; animation enhances, never gates.
- **Don't** gamify with streaks, cartoon mascots, or sound effects. Progress is celebrated quietly — a smooth fill, a checkmark, a warm accent.
- **Don't** rebuild the hero-metric template (big number, small label, stats row) on dashboard screens.
