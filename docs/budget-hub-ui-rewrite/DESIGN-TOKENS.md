# Budget Hub Design Tokens

Presentation-layer tokens only. Does not amend platform constitution (`platform_changes: 0`).

## CSS Variables (`src/styles/budget-hub.css`)

| Token | Value | Use |
|-------|-------|-----|
| `--bh-canvas` | `hsl(40 20% 98%)` / dark: `hsl(220 15% 7%)` | Page background |
| `--bh-surface` | `hsl(0 0% 100%)` / dark: `hsl(220 12% 10%)` | Cards, nav |
| `--bh-ink` | `hsl(0 0% 7%)` | Primary text |
| `--bh-ink-muted` | `hsl(0 0% 45%)` | Secondary text |
| `--bh-accent` | `hsl(0 0% 7%)` | Primary CTA (Learn law: black CTA) |
| `--bh-accent-warm` | `#FF6B35` | Civic warmth accent (eyebrows, badges) |
| `--bh-border` | `hsl(0 0% 0% / 0.08)` | Dividers |
| `--bh-radius-sm` | `8px` | Pills, inputs |
| `--bh-radius-md` | `12px` | Cards, images |
| `--bh-radius-lg` | `16px` | Hero image |
| `--bh-shadow-hover` | `0 12px 40px -12px rgb(0 0 0 / 0.12)` | Card hover |
| `--bh-section-y` | `clamp(3rem, 6vw, 5rem)` | Section rhythm |
| `--bh-content-max` | `70rem` | Editorial column |
| `--bh-prose` | `42rem` | Article reading measure |

## Typography Scale

| Role | Classes |
|------|---------|
| Display | `text-4xl md:text-5xl font-semibold tracking-tight` |
| Section heading | `text-2xl md:text-3xl font-semibold tracking-tight` |
| Card title | `text-xl font-semibold` |
| Body editorial | `text-[17px] leading-[1.7]` |
| Eyebrow | `text-xs font-medium uppercase tracking-widest text-[var(--bh-accent-warm)]` |
| Metadata | `text-sm text-muted-foreground` |

## Spacing Rhythm

- Page padding: `px-4 sm:px-6 lg:px-8`
- Section gap: `gap-[var(--bh-section-y)]`
- Card grid: `gap-6 md:gap-8`
- Inline clusters: `gap-2` (pills) · `gap-4` (metadata)
