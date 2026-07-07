# Component Contract — Lesson Card

## Component Name

`LessonCard`

## Purpose

Single **lesson row** inside an expanded module — title, duration, tap to learn.

## Used On

- Module Card (expanded)
- Module Overview lesson list

## Variants

| Variant | When |
|---------|------|
| Default | Available |
| Active | Current lesson (v2) |
| Completed | Checkmark |

## States

Default · Completed · Locked (inherits module lock)

## Interactions

| Action | Result |
|--------|--------|
| Tap row | Navigate to `LmsRoutes.lesson(...)` |

## Props / Data

```ts
courseSlug, moduleSlug, lesson: LmsLesson
```

## Accessibility

- Full row is link or button
- Duration in accessible name

## Motion

Hover background 150ms.

## Dependencies

- Parent `ModuleCard`

## Design Tokens

- `LMS_TOUCH.minTarget`
- Padding `p-3` minimum

## Navigation Laws

6 — intentional lesson entry

## Implementation Path

`src/components/lms/lesson-card.tsx` (to extract from module-card)

## Do Not

- Embed video thumbnail (lesson page owns video)
- Show trivia status on card (too much metadata)
