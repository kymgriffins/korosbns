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
