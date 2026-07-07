# Component Contract — Progress Ring / Bar

## Component Name

`ProgressBar` (linear); `ProgressRing` (v2 optional)

## Purpose

Show **milestone progress** as completed/total — never percentage alone without context.

## Used On

- Home continue card
- Course Hero
- Course Detail
- Module Overview
- Lesson header
- Progress page

## Variants

| Variant | Display |
|---------|---------|
| Bar | `6 / 10 Lessons` + fill |
| Compact | Bar only |
| Ring (v2) | Circular for profile |

## States

0% · partial · 100%

## Interactions

Read-only. No click unless wrapped in link card.

## Props / Data

```ts
completed: number
total: number
label?: string
```

## Accessibility

- `role="progressbar"` `aria-valuenow` `aria-valuemin` `aria-valuemax`
- Label includes fraction text

## Motion

Fill transition 300ms.

## Dependencies

None

## Design Tokens

- Height `h-2`
- Fill: foreground black, not blue

## Navigation Laws

None

## Implementation Path

`src/components/lms/progress-bar.tsx`

## Do Not

- Show percentage without fraction label
- Use as only progress indicator on Progress page (pair with milestones)
