# Component Contract — LMS Shell (Navigation Chrome)

## Component Name

`LmsShell` · `LmsTopNav` · `LmsBottomNav`

## Purpose

Provide **hub navigation** without dominating content — top (desktop) + bottom (mobile).

## Used On

All hub and flow screens except Lesson (bottom hidden) and Account (shell excluded).

## Variants

| Mode | When |
|------|------|
| Hub | Bottom nav visible |
| Immersive | Lesson — bottom nav hidden (Law 12) |
| Account bypass | Layout skips shell |

## States

Default · Active nav item

## Interactions

| Action | Result |
|--------|--------|
| Bottom nav tap | Hub route |
| Top nav link | Hub / search / profile |
| Logo | Home |

## Props / Data

```ts
immersive?: boolean  // LmsShell
```

## Accessibility

- `nav` landmarks with `aria-label`
- `aria-current="page"` on active item
- 5 bottom items max (Law 3)

## Motion

Bottom nav enter: `navBottomEnter` variant.

## Dependencies

- `learn-nav.ts` href helpers
- `MobileBottomNav` primitive

## Design Tokens

- `--mobile-nav-height`
- Sticky top `z-50`

## Navigation Laws

2, 3, 12, 14, 15

## Implementation Path

- `src/components/lms/lms-shell.tsx`
- `src/components/lms/lms-nav.tsx`

## Do Not

- Sidebar
- Sixth bottom nav item
- Bottom nav on lesson page
- Render shell on `/learn/account/*`
