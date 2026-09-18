# Adding a New Palette

## Quick Start (~10 minutes)

### 1. Create the CSS file

Create `src/styles/palettes/{structure}-{palette}.css`:

```css
/* Brutalist Coral — Warm coral accent */
html[data-theme-preset="brutalist-coral"],
[data-theme-preset="brutalist-coral"] {
  --background: #fff5f5;
  --foreground: #000000;
  --primary: #ff6b6b;
  --primary-foreground: #ffffff;
  /* ... all colour variables ... */
}

html.dark[data-theme-preset="brutalist-coral"],
[data-theme-mode="dark"][data-theme-preset="brutalist-coral"],
.dark[data-theme-preset="brutalist-coral"] {
  /* ... dark mode overrides ... */
}
```

### 2. Register in `src/lib/theme-registry.ts`

Add the palette ID to the structure's `palettes` array:

```ts
brutalist: {
  palettes: ["orange", "teal", "monochrome", "neon", "coral"], // add "coral"
},
```

Add swatch data:

```ts
"brutalist-coral": { bg: "#fff5f5", primary: "#ff6b6b", border: "#000000", label: "Coral" },
```

### 3. Import in `src/styles/globals.css`

```css
@import "./palettes/brutalist-coral.css";
```

### 4. Done

The theme toggle automatically picks up the new palette. No component changes needed.

---

## What Each Layer Does

| Layer | File | Controls |
|-------|------|----------|
| **Base tokens** | `tokens.css` | Default CSS variables |
| **Structure** | `presets.css` | Typography, border-radius, shadows, layout overrides |
| **Palette** | `palettes/*.css` | Colour overrides scoped to composite key |
| **Dark mode** | Inside palette file | Dark variant colours |

## Architecture

```
Composite key: "brutalist-coral"
                ↓
        resolveTheme("brutalist-coral")
                ↓
    { structure: "brutalist", palette: "coral" }
                ↓
    ┌───────────┴───────────┐
    │ Structure (JSX)       │ Palette (CSS)
    │ Page shells branch    │ Colour variables override
    │ on structure ID       │ via data-theme-preset
    └───────────────────────┘
```

## Adding a New Structure

1. Add to `STRUCTURES` in `theme-registry.ts`
2. Add structural CSS in `presets.css`
3. Add JSX branches to page shells (article-shell, project-shell, etc.) and marketing landings when the structure owns a distinct homepage (`theme-newsroom-layouts.tsx`)
4. All existing palettes auto-work with the new structure

Current structures: `sovereign`, `editorial`, `cinematic`, `brutalist`, `ark`.

## Files Modified

| File | Change |
|------|--------|
| `src/lib/theme-registry.ts` | Structure + palette definitions |
| `src/styles/palettes/*.css` | Per-palette colour overrides |
| `src/styles/presets.css` | Structural-only (typography, radius, shadows) |
| `src/styles/globals.css` | Imports all palette files |
| `src/hooks/use-theme-preset.ts` | Composite key support |
| `src/layouts/page-shells/types.ts` | Uses `resolveTheme()` |
| `src/components/marketing/theme-toggle.tsx` | Grouped structure/palette picker |
| `src/components/marketing/premium-landing-client.tsx` | Uses `useThemeStructure()` |
