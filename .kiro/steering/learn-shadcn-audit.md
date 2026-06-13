---
inclusion: manual
---

# /learn Design Audit — shadcn-admin Alignment

**Branch:** `audit/learn-design-shadcn`  
**Scope:** `src/app/(marketing)/learn/**` and `src/components/learn/**` only.  
Do NOT touch anything outside these two directories.

---

## Hard Rules (never break these)

### 1. Keep the mobile bottom nav
`<LearnMobileNav />` renders at the bottom of the shell on mobile (`md:hidden`). It must stay exactly where it is. Do not remove it, reposition it, or alter its markup. When adding padding or spacing to the main scroll area, account for the nav height so content is not obscured — use `pb-16 md:pb-0` (or equivalent) on the main scroll container.

### 2. No inline styles
**Zero** `style={{ ... }}` props anywhere in `/learn` components. No exceptions.

- CSS custom property tricks like `style={{ "--progress": `${val}%` }}` must be migrated to one of:
  - A Tailwind arbitrary value driven by a `data-*` attribute, e.g. `data-progress={val}` + CSS `[&[data-progress]]:...`
  - A small dedicated CSS class in `src/app/globals.css` or a co-located `.module.css` file
  - A `cn()` call that builds the class from a lookup map (for discrete states like 0%, 25%, 50%, 75%, 100%)
- The `gradientRing` helper in `learn-dashboard-view.tsx` that returns Tailwind class strings is fine — that is not inline style.

### 3. All styles must be scalable / editable from one place
- Do **not** scatter the same colour, spacing, or typography value across multiple files as one-off strings.
- Extract repeated visual patterns into:
  - Named CVA variants (for components with multiple visual states)
  - Named helper functions that return class strings via `cn()` (for data-driven colour maps)
  - Constants at the top of the file (for things like `STAT_CARD_CLASSES = "..."`) when only used in one file
  - Shared UI components in `src/components/learn/` when used in more than one file

---

## Reference: shadcn-admin Design System

The canonical reference lives in `c:\BudgetNdioStory\shadcn-admin\shadcn-admin-design-system.md`.

### Core principles borrowed from shadcn-admin

| Principle | shadcn-admin pattern | Apply to /learn |
|-----------|---------------------|-----------------|
| **Card anatomy** | `<Card>` with `CardHeader / CardContent / CardFooter` | Replace raw `<div className="bg-card rounded-xl ring-1 ring-border/40">` |
| **Sidebar** | `SidebarProvider → Sidebar → SidebarContent → SidebarMenu → SidebarMenuItem → SidebarMenuButton` | LearnHubLayout already uses this — keep and refine |
| **Header** | Sticky, `h-16`, backdrop-blur at `offset > 10`, `Separator` between trigger and content | Mobile header in LearnAppShell should match exactly |
| **Page layout** | `<Main>` wrapper with `px-4 py-6`, optional `fixed` mode for overflow | Wrap each /learn page's content in a `<Main>`-equivalent |
| **Typography scale** | `text-2xl font-bold` for page titles, `text-sm text-muted-foreground` for subtitles | Replace `text-[10px] font-black uppercase tracking-widest` section labels |
| **Badges** | shadcn `<Badge variant="secondary/outline/default">` | Replace hand-rolled badge spans |
| **Tabs** | shadcn `<Tabs><TabsList><TabsTrigger>` | Replace raw button tab bars |
| **Select** | shadcn `<Select>` | Replace all native `<select>` elements |
| **Settings layout** | `<aside>` sticky + scrollable content | Apply to /learn/account/* pages |
| **Data rows** | `hover:bg-muted/40`, active ring `ring-1 ring-primary/15` | Normalise across all lists |
| **Focus rings** | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` | Add to ALL interactive elements |
| **Collapsible** | Radix `<Collapsible>` with `slideDown/slideUp` CSS keyframes | Replace hand-rolled chevron show/hide |
| **Skeleton** | shadcn `<Skeleton>` | Replace raw `animate-pulse` divs |
| **Separator** | shadcn `<Separator>` | Replace `<div className="h-px bg-border">` |
| **Toasts** | `sonner` | Already in use — keep |
| **Sheet** | shadcn `<Sheet side="right">` | Wrap StageDetailDrawer on desktop |

---

## Scalability Patterns to Follow

### A. Colour accent maps — use a const, not repeated inline strings
```tsx
// BAD — scattered across JSX
<div className="bg-orange-500/8 text-orange-600 border-orange-500/20">
<div className="bg-sky-500/8 text-sky-600 border-sky-500/20">

// GOOD — defined once at the top of the file or in a shared util
const ACCENT_CLASSES = {
  streak:  "bg-orange-500/10 text-orange-600 border-orange-500/20",
  xp:      "bg-amber-500/10  text-amber-600  border-amber-500/20",
  badge:   "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  stage:   "bg-blue-500/10   text-blue-600   border-blue-500/20",
  rank:    "bg-sky-500/10    text-sky-600    border-sky-500/20",
} as const;
```

### B. Progress bar — no inline style, use a data attribute
```tsx
// BAD
<div style={{ "--progress": `${pct}%` } as React.CSSProperties} className="w-[var(--progress)]" />

// GOOD — add to globals.css once:
// .progress-bar { width: calc(var(--learn-progress, 0) * 1%); }
// Then drive it with a data attribute + CSS var set via @layer utilities, OR:

// Simplest: just use Tailwind's arbitrary value with a safe capped value
// and the shadcn <Progress> component which handles this internally
<Progress value={pct} className="h-1.5" />
```

### C. CVA for components with variants
Any component that renders differently based on a status/state prop should use CVA:
```tsx
import { cva } from "class-variance-authority";

const statCardVariants = cva(
  "flex items-center gap-2 rounded-lg p-2.5 ring-1 ring-border/40 shadow-xs bg-card",
  {
    variants: {
      accent: {
        blue:    "ring-blue-500/20",
        emerald: "ring-emerald-500/20",
        amber:   "ring-amber-500/20",
        purple:  "ring-purple-500/20",
      },
    },
  }
);
```

### D. Shared small components — extract, don't repeat
If the same visual structure appears in more than one file in `src/components/learn/`, extract it to its own file:
- `learn-stat-card.tsx` — the repeated "icon + label + value" stat tile
- `learn-section-header.tsx` — the repeated "LABEL · View All" row header
- `learn-empty-state.tsx` — the repeated centred icon + message + optional action pattern
- `learn-progress-bar.tsx` — wraps shadcn `<Progress>` with the correct accessibility props

---

## Audit Checklist by File

### `src/layouts/LearnHubLayout.tsx`
- [ ] Mobile header: bring to `h-16` (currently `h-12`), add `backdrop-blur-lg` shadow at scroll > 10
- [ ] Main scroll container: add `pb-16 md:pb-0` to account for mobile bottom nav height
- [ ] Add `<Separator orientation="vertical" className="h-6" />` between `SidebarTrigger` and title text
- [ ] `SidebarGroupLabel`: normalise to `text-xs font-medium text-sidebar-foreground/70`
- [ ] Remove `py-4` from every `SidebarMenuButton` — use default `h-8 text-sm` size
- [ ] Badge count pill: use shadcn `<Badge variant="secondary">`
- [ ] Sidebar footer avatar: use `<Avatar><AvatarImage /><AvatarFallback>` from shadcn
- [ ] App card in footer: keep as custom component — extract to `learn-sidebar-promo-card.tsx`

### `src/components/learn/learn-paths-home.tsx`
- [ ] Guest card: use `<Card><CardContent>`
- [ ] Error state: use `<Alert variant="destructive"><AlertDescription>`
- [ ] Empty state: extract to shared `<LearnEmptyState>`
- [ ] No inline styles — remove any `style=` props

### `src/components/learn/learn-dashboard-view.tsx`
- [ ] Extract `ACCENT_CLASSES` map to top of file — remove scattered colour strings
- [ ] Extract `gradientRing` — already a function, keep it, but move to a `learn-utils.ts` if used elsewhere
- [ ] Stats row: use shared `<LearnStatCard>` component
- [ ] Hero card: `<Card><CardContent>`
- [ ] Leaderboard: `<Card><CardHeader><CardTitle> + <CardContent>`
- [ ] Quests: `<Card><CardHeader><CardTitle> + <CardContent>`
- [ ] XP progress: use `<Progress value={pct} />` — no inline style
- [ ] Section headers: extract to shared `<LearnSectionHeader>`

### `src/components/learn/stage-detail-drawer.tsx`
- [ ] Format tabs (Read/Watch/Quiz): shadcn `<Tabs><TabsList><TabsTrigger>`
- [ ] Curriculum step list: Radix `<Collapsible>` with `slideDown/slideUp` animation
- [ ] Header info badges: `<Badge variant="secondary">` or `<Badge variant="outline">`
- [ ] Back button: `<Button variant="ghost" size="icon" aria-label="Back">`
- [ ] Prev/Next footer buttons: `<Button variant="outline">` with icons
- [ ] Remove all `style=` props

### `src/components/learn/profile-view.tsx`
- [ ] Settings section: `<Card><CardHeader><CardTitle><CardDescription> + <Separator> + rows`
- [ ] Language selector: shadcn `<Tabs>` or `<RadioGroup>`
- [ ] Reset button: `<Button variant="destructive" className="w-full">`
- [ ] Badge collection card: `<Card><CardHeader><CardTitle> + <CardContent>`
- [ ] Activity chart: `<Card><CardHeader><CardTitle> + <CardContent>`
- [ ] Stat cards: use shared `<LearnStatCard>`
- [ ] Progress bar: `<Progress>` — no inline style
- [ ] XP progress bar: `<Progress>` with aria props — no inline style

### `src/app/(marketing)/learn/profile/page.tsx`
- [ ] Page title: `text-2xl font-bold tracking-tight`
- [ ] All cards: use `<Card>`
- [ ] Loading: use `<Skeleton>`

### `src/app/(marketing)/learn/account/page.tsx`
- [ ] Verify title/actions match shadcn-admin header pattern

### `src/app/(marketing)/learn/articles/page.tsx` and sibling tab pages
- [ ] Loading states: `<Skeleton>` not raw pulse divs

### `src/components/learn/forum-view.tsx`
- [ ] Thread list: `<Card>` per item
- [ ] Post list: `<Card>` per post
- [ ] Inputs: `<Label>` with every `<Textarea>` and `<input>`

### `src/components/learn/alerts-view.tsx`
- [ ] Alert items: shadcn `<Alert>`
- [ ] Card wrappers: `<Card><CardContent>`

### `src/components/learn/learn-modules-view.tsx`
- [ ] Stage cards: `<Card>` — keep internal layout
- [ ] Status badges: `<Badge>`

### `src/components/learn/dashboard-skeleton.tsx`
- [ ] Replace every raw pulse div with `<Skeleton>`

---

## Shared Components to Create

Create these in `src/components/learn/` before editing the larger files, so all downstream changes use them:

| File | Purpose |
|------|---------|
| `learn-stat-card.tsx` | Icon + label + value tile used in dashboard and profile |
| `learn-section-header.tsx` | Label + optional "View All" action row |
| `learn-empty-state.tsx` | Centred icon + heading + description + optional CTA |
| `learn-progress-bar.tsx` | Wraps `<Progress>` with correct aria props, no inline style |
| `learn-sidebar-promo-card.tsx` | The events/surveys promo card extracted from LearnHubLayout |

---

## Typography Rules

| Context | Before | After |
|---------|--------|-------|
| Section labels | `text-[10px] font-black uppercase tracking-widest` | `text-xs font-semibold text-muted-foreground uppercase tracking-wide` |
| Page titles | inconsistent | `text-2xl font-bold tracking-tight` |
| Card titles | `text-[10px] font-black` | `text-sm font-semibold` inside `<CardTitle>` |
| Body prose | `text-xs` | `text-sm` |
| Metadata | `text-xs text-muted-foreground` | same — keep |
| Minimum size | `text-[8px]` / `text-[9px]` | `text-xs` minimum (12px) — accessibility |

---

## Colour / Token Rules

- All colours via design tokens: `--primary`, `--muted`, `--card`, `--border`, `--sidebar-*`.
- Gamification accents (orange, emerald, amber) are allowed as accent layers on `<Card>` or icon containers — define them in `ACCENT_CLASSES` maps, not scattered.
- Glass-morphism (`bg-white/[0.04]`, `border-white/10`) only on hero gradient cards.
- No standalone coloured card backgrounds (`bg-orange-500/8` as the full card background) — use `<Card>` + coloured icon container inside.

---

## Accessibility Rules

- Icon-only or emoji-only `<button>` → must have `aria-label`.
- Every `<input>` / `<textarea>` → associated `<Label>` or `aria-label`.
- `<img>` for known assets → replace with Next.js `<Image>`. Keep `<img>` only for user avatar URLs.
- Focus rings → `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` on all interactive elements.
- Progress bars → `role="progressbar"`, `aria-valuenow`, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-label`.

---

## What NOT to change

- `LearnProvider` / `useLearn` context and all hooks.
- Gamification logic in `learn-paths-home.tsx`.
- `/learn/layout.tsx` (single-line wrapper).
- `<LearnMobileNav />` — do not touch this component at all.
- Any file outside `src/app/(marketing)/learn/` and `src/components/learn/`.
- `motion/react` animation wrappers.
- `sonner` toast calls.

---

## Commit convention for this branch

```
audit(learn): <short description>
```

Examples:
- `audit(learn): extract shared LearnStatCard and LearnSectionHeader`
- `audit(learn): replace raw card divs with shadcn Card in dashboard-view`
- `audit(learn): migrate stage-detail tabs to shadcn Tabs`
- `audit(learn): remove all inline styles, migrate progress bars to Progress component`
- `audit(learn): fix focus rings and aria-labels across all learn components`
