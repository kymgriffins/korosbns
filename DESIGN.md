---
name: Budget Ndio Story
description: Turning Kenya's budget into clear, bold civic narratives.
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
    fontSize: "clamp(2rem, 6vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
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
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
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
  card-default:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  input-default:
    backgroundColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    borderColor: "{colors.border}"
---

# Design System: Budget Ndio Story

## 1. Overview

**Creative North Star: "The Civic Studio"**

Budget Ndio Story is a workshop for fiscal democracy — where complex budget documents become clear, shareable, and actionable. Every page feels like walking into a well-lit studio: data is on the walls, tools are within reach, and the space invites participation.

This system is **flat by default**, relying on spacing, color, and typographic weight for hierarchy. Surfaces are clean; shadows appear only on interaction. Bold typography and generous whitespace give the budget data room to breathe.

**What this system explicitly rejects:** No government-portal blues and crests. No Western-NGO beige and stock photography. No SaaS teal-purple gradients or glassmorphism. No hero-metric templates (big number + small label).

**Key Characteristics:**
- Numbers are the hero — let them breathe
- Flat surfaces, interaction-driven elevation
- Generous whitespace and rhythm
- Typography as the primary expressive tool
- Bold color used intentionally, not decoratively
- Kenyan identity carried through data and voice, not flags

## 2. Colors

The palette is anchored by a bold, credible blue — not the muted navy of government sites, but a clear signal blue that communicates both trust and energy. Neutrals are clean and cool.

### Primary
- **Signal Blue** (#0055FF): Primary actions, navigation, key data highlights. Used at full saturation — never dimmed, never gradient. Covers ≤15% of any given screen.

### Neutral
- **Background** (#FFFFFF): Default surfaces.
- **Muted Background** (#F5F5F5): Secondary surfaces, code blocks.
- **Foreground** (#000000): Body text and headings.
- **Muted Foreground** (#6B6B6B): Secondary text, metadata.
- **Border** (rgba(0,0,0,0.08)): All dividers and borders.

### Semantic
- **Accent Warm** (#FF6B35): Progress, achievements, highlights.
- **Success** (#10B981): Completion states.
- **Warning** (#F59E0B): Alerts, cautions.
- **Destructive** (#E74653): Errors, destructive actions.

### Named Rules
**The Signal Rule.** Primary blue covers ≤15% of any screen. It is for wayfinding and data emphasis only. If a design needs more weight, pull from neutral or semantic, never from the primary.
**The No-Warm-Bg Rule.** Backgrounds are cool or neutral. Warmth is carried by Accent Warm in small, intentional doses.

## 3. Typography

**Display Font:** Geist (system-ui, sans-serif fallback)
**Body Font:** Geist (single-family system)

**Character:** A single geometric sans-serif used across all roles, differentiated by weight and size. Clean, modern, and credible — without the AI-default feel of Inter or Roboto.

### Hierarchy
- **Display** (Bold 700, clamp(2rem, 6vw, 4rem), 1.1): Hero headings, landing page titles. `text-wrap: balance`. Max 1 per viewport.
- **Headline** (Semibold 600, clamp(1.25rem, 3vw, 1.75rem), 1.3): Section headings.
- **Title** (Semibold 600, clamp(1rem, 2vw, 1.125rem), 1.4): Card titles, module names.
- **Body** (Regular 400, 1rem, 1.65): Article content, descriptions. Cap at 70ch.
- **Label** (Medium 500, 0.875rem, 1.4): Button text, form labels, metadata.

### Named Rules
**The Weight-Is-Hierarchy Rule.** Never use color or decoration for hierarchy when a weight change will do. The 400-700 weight range is the primary tool.

## 4. Elevation

Flat by default. Surfaces sit on the same plane; hierarchy comes from spacing, color, and typography.

Shadows appear only as interactive responses:
- **Hover lift** (`0 4px 12px rgba(0,0,0,0.1)`): Cards on hover.
- **Floating UI** (`0 8px 24px rgba(0,0,0,0.12)`): Dropdowns, popovers.
- **Modal** (`0 16px 48px rgba(0,0,0,0.2)`): Dialogs.

### Named Rules
**The Flat-By-Default Rule.** No surface casts a shadow at rest. Elevation is a state, not a style.

## 5. Components

### Buttons
- **Shape:** 10px radius. Pill-like but not circular.
- **Primary:** Signal Blue bg, white text, 12px 24px padding. Hover darkens to #0044CC. Focus ring at 0.5 opacity.
- **Ghost:** Transparent bg, foreground text. Hover gets `rgba(0,0,0,0.05)` background.
- **Outline:** Border-only, transparent bg. Hover fills.

### Cards
- **Corner Style:** 16px radius.
- **Background:** White + 1px border — no shadow at rest.
- **Hover:** Shadow lift.
- **Padding:** 24px default.
- **Nested cards are prohibited.** Use bg tints or dividers.

### Inputs
- **Style:** Full border stroke at 0.08 opacity, 10px radius. Bg matches page.
- **Focus:** Border shifts to Signal Blue, 0.3 opacity ring.
- **Error:** Border shifts to Destructive.

### Navigation
- **Clean list**, 10px radius hover. Active uses primary text with subtle bg tint.
- **Mobile:** Bottom nav with icon + label.

### Signature: Data Stat
- **Layout:** Large number (Display weight, primary or foreground color), small label (Label weight, muted), optional change indicator.
- **Background:** Clean card or inline. No icon background fills, no gradient.

## 6. Do's and Don'ts

### Do:
- **Do** let numbers lead — large, bold, tabular. They are the content.
- **Do** use generous whitespace between data points.
- **Do** use `text-wrap: balance` on headings.
- **Do** animate state changes with `ease-out-quart`.
- **Do** respect reduced motion with instant transitions.
- **Do** cap body text at 70ch for readability.

### Don't:
- **Don't** use gradient text (`background-clip: text`) anywhere.
- **Don't** use purple/violet gradients or cyan-on-dark palettes.
- **Don't** use side-stripe borders (border-left/right >1px as accent).
- **Don't** use glassmorphism or backdrop-blur decoratively.
- **Don't** use bounce or elastic easing.
- **Don't** use cards nested inside cards.
- **Don't** use tiny uppercase tracked eyebrow labels on every section.
- **Don't** use pure black text on colored backgrounds.
- **Don't** hide content behind animations.
- **Don't** use the hero-metric template (big number, small label, gradient).
- **Don't** use Montserrat, Inter, or Roboto as primary fonts.

## 7. Component-Specific Overrides

These are intentional deviations from the core tokens for specific visual contexts. They are documented here so they remain deliberate choices, not drift.

### Motif System (Layer 3 — Theme Presets)

Motif is a **preset slot**, not a code component. Each preset picks one motif from an allowlist of 3–4 options. The constraint:

- **Two presets cannot share both motif AND color family.** If Preset A uses "gradient-wash" motif with blue family, no other preset can use "gradient-wash" with blue.
- Motif selection is code-only (PR required). Editors choose from existing presets.
- The allowlist of motifs is defined in `src/lib/presets.ts` (to be created in Step 3).

### Day/Night Switch (`day-night-switch.tsx`)
A thematic toggle with a sky-atmosphere metaphor. Colors represent sky, sun, and ambient light at different times of day — not general UI tokens.

| Token | Value | Role |
|-------|-------|------|
| `#83d8ff` | sky-blue | Day sky gradient start |
| `#749ed7` / `#749dd6` | muted-blue | Day sky gradient end / horizon |
| `#ffcf96` | warm-peach | Sun element |
| `#e8cda5` | sand | Ground / horizon line |
| `#ffe5b5` | light-gold | Sun glow |

| Radius | Value | Role |
|--------|-------|------|
| `84px` | pill | Outer switch track |
| `50px` | pill | Inner knob / sun-moon element |

### Retro TV Card (`retro-tv-card.tsx`)
A decorative component emulating a vintage CRT television. The palette is drawn from retro amber/orange displays and period-correct plastics — not general UI tokens.

| Token | Value | Role |
|-------|-------|------|
| `#f27405` | amber-glow | CRT screen glow |
| `#a85103` | dark-amber | CRT ambient / deep glow |
| `#d36604` | burnt-orange | Accent / active state |
| `#e69635` | warm-gold | Text highlight, button active |
| `#1d0e01` | near-black | Deep shadow / power-off state |
| `#7f5934` | bronze | Chassis accent, speaker grille |
| `#b49577` | beige | Chassis highlight, button face |
| `#513721` | dark-brown | Chassis shadow |
| `#171717` | off-black | Frame / bezel |
| `#353535` / `#4d4d4d` | dark-gray | Inner shadow, vent detail |
| `#979797` | mid-gray | Knob detail, secondary text |
| `#252525` | dark-charcoal | Stand / base |

| Radius | Value | Role |
|--------|-------|------|
| `50px` | pill | CRT screen corner, knob shape |
| `25px` | rounded | Button / control element |
| `15px` | soft | Inner element rounding |
| `5px` | micro | Detail / vent element |

**Font note.** Geist is the intentional brand font (see Typography §3). The `overused-font` signal for Geist is noted; it remains the chosen single-family system for this project.

### Learn Quiz Immersive Mode (`learn.tsx` lines ~760–770)
A fullscreen dark overlay for quiz-taking. The dark background (`#2a2d37`, `#16171d`) and glow colors (derived from brand primary and semantic tokens) create a focused, cinematic quiz environment separate from the main UI.

| Color | Value | Role |
|-------|-------|------|
| `#2a2d37` | surface | Quiz card background |
| `#16171d` | base | Quiz page background |
| `rgba(56, 189, 248, 0.22)` | info-glow | Info accent glow |
| `rgba(14, 116, 144, 0.12)` | info-subtle | Info subtle fill |
| `#fbbf24` / `rgba(251, 191, 36, …)` | amber | Warning / highlight state |
| `#d97706` / `rgba(217, 119, 6, …)` | dark-amber | Warning deep state |

### Button Ripple Effect (`components.css`)
The `.button__bg` pseudo-element uses `border-radius: 100px` to create a fully round ripple origin. This is a motion utility, not a surface token.

### Chart Palette (`apps/budgethub/src/components/reports/`)
The report chart palette is a separate color system for data visualization, where distinct hues are needed for series differentiation. These HSL values are managed via CSS variables in the budgethub app theme.

| Hue | Usage |
|-----|-------|
| `hsl(221 83% 53%)` | Primary data series (blue) |
| `hsl(142 76% 36%)` | Success data series (green) |
| `hsl(47 95% 48%)` | Warning data series (amber) |
| `hsl(346 77% 50%)` | Destructive data series (red) |
| `hsl(173 80% 40%)` | Teal data series |
| `hsl(12 76% 61%)` | Orange data series |
| `hsl(24 95% 53%)` | Deep orange data series |
| `hsl(0 0% 60%)` | Muted / disabled data series (gray) |
