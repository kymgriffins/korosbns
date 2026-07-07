# Component Contract — Reflection Card

## Component Name

`ReflectionCard`

## Purpose

Capture **one lightweight reflection** after video parts — confidence or one-sentence takeaway.

## Used On

- Lesson (after video parts, before resources)

## Variants

| Variant | Input |
|---------|-------|
| Text | Textarea, one sentence |
| Confidence | Emoji scale 😀 😐 😕 |

## States

Empty · Filled · Saved (v2)

## Interactions

| Action | Result |
|--------|--------|
| Type / select | Local state |
| Save | Persist draft (v2 API) |

## Props / Data

```ts
prompt: string
```

## Accessibility

- Textarea labelled with prompt
- Emoji buttons have `aria-label`

## Motion

None

## Dependencies

- Shown after parts complete, before Continue to next lesson

## Design Tokens

- `LMS_RADIUS.card`
- `max-w-prose` for prompt text

## Navigation Laws

11 — draft preserved on back (v2)

## Implementation Path

`src/components/lms/reflection-card.tsx`

## Do Not

- Block Continue indefinitely (reflection optional v1)
- Multi-question survey
