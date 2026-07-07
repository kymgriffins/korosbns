# Component Contract — Module Card

## Component Name

`ModuleCard`

## Purpose

Represent one **module as a journey step** — collapsed by default, expands to reveal lessons **in place**.

## Used On

- Course Detail (`screen-contracts/course-detail.md`)
- Module Overview (`screen-contracts/module-overview.md`) — forced open variant

## Variants

| Variant | Status |
|---------|--------|
| Completed | Green check, all lessons done |
| In progress | Primary accent |
| Available | Neutral |
| Locked | Disabled, unlock copy |
| Forced open | Module overview page |

## States

Collapsed · Expanded · Locked (disabled)

## Interactions

| Action | Result |
|--------|--------|
| Tap header | Toggle expand (if not locked) |
| Open one | **Close others** (accordion group) |
| Tap lesson | Navigate to lesson route |

## Props / Data

```ts
courseSlug: string
module: LmsModule
defaultOpen?: boolean
```

## Accessibility

- `Collapsible` with `aria-expanded`
- Locked: `aria-disabled` on trigger
- Lesson links in expanded panel

## Motion

Height animation 200ms spring (Law 5 context).

## Dependencies

- `LessonCard` rows inside content
- Accordion group context (parent)

## Design Tokens

- `LMS_RADIUS.card`
- `LMS_MOTION.durationMs`

## Navigation Laws

4 — expand in place  
5 — one open at a time

## Implementation Path

`src/components/lms/module-card.tsx`

## Do Not

- Navigate to module page on header tap (on course page)
- Default all modules open
- Allow multiple expanded on course page
