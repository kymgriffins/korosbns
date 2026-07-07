# Component Contract — Course Card

## Component Name

`CourseCard`

## Purpose

Represent a **course in discovery contexts** — grid browsing or continue/resume.

## Used On

- Home (continue + recommended)
- Catalogue
- Progress

## Variants

| Variant | Layout |
|---------|--------|
| Grid | Image top, metadata below |
| Continue | Horizontal split, progress + Resume |

## States

Default · Hover

## Interactions

| Action | Result |
|--------|--------|
| Tap card | → Course Detail OR resume lesson (continue variant links to course) |

## Props / Data

```ts
course: LmsCourse
variant?: "grid" | "continue"
```

## Accessibility

- Entire card is one link
- Continue variant: "Continue [course title]"

## Motion

Hover: translate -0.5px + shadow, scale 1.02.

## Dependencies

- `ProgressBar` (continue variant)

## Design Tokens

- `LMS_RADIUS.card`
- `aspect-[16/10]` image

## Navigation Laws

1 — continue variant supports 1-tap resume path (when wired to lesson)

## Implementation Path

`src/components/lms/course-card.tsx`

## Do Not

- Multiple CTAs inside card
- Show full module list on card
