# Component Contract — Continue Button

## Component Name

`ContinueButton`

## Purpose

**Universal forward action** — one verb, sticky when earned, gates lesson progression.

## Used On

- Lesson (primary, sticky)
- Trivia sheet (post-answer, secondary context)

## Variants

| Label | When |
|-------|------|
| Continue | Next part within lesson |
| Next lesson | Crossing lesson boundary |
| Complete module | Last lesson in module (v2) |

## States

| State | UI |
|-------|-----|
| Hidden | Requirements not met |
| Disabled | Visible but not ready (rare) |
| Active | Sticky bottom, primary black CTA |
| Loading | Submitting progress (v2) |

## Interactions

| Action | Result |
|--------|--------|
| Tap | Advance part / navigate next lesson |

## Props / Data

```ts
href?: string
onClick?: () => void
visible: boolean
label?: string
```

## Accessibility

- `min-h-11` touch target
- Sticky region `role="region"` `aria-label="Lesson actions"`

## Motion

Appear: fade + slide up 150ms when becoming visible.

## Dependencies

- Video part completion
- Trivia completion (if any for current part)

## Design Tokens

- `LMS_COLORS.cta`
- `LMS_MOTION.activeScale`
- Sticky above safe area on mobile

## Navigation Laws

9, 10, 13

## Implementation Path

`src/components/lms/continue-button.tsx` (to extract)

## Do Not

- Compete with other primary buttons in same viewport
- Show before required interactions complete
- Use blue primary color
