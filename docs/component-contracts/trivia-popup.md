# Component Contract — Trivia Popup

## Component Name

`TriviaPopup` (`TriviaSheet`)

## Purpose

**One question** checkpoint that overlays the lesson — pause, answer, resume.

## Used On

- Lesson (overlay only)

## Variants

| Type | Input |
|------|-------|
| multiple_choice | Option buttons |
| true_false | True / False |
| fill_blank | Text input |

## States

| State | UI |
|-------|-----|
| Question | Options enabled |
| Answered correct | Green feedback + explanation |
| Answered incorrect | Red feedback + explanation |
| Closed | After Continue in sheet |

## Interactions

| Action | Result |
|--------|--------|
| Select answer | Highlight |
| Check answer | Immediate feedback |
| Continue (post-answer) | Close sheet, enable lesson Continue |
| Tap overlay | **Disabled** — must answer (Law 8) |

## Props / Data

```ts
trivia: LmsTrivia
open: boolean
onClose: () => void
onAnswered?: (correct: boolean) => void
```

## Accessibility

- Focus trap while open
- `aria-modal="true"`
- Escape **disabled** until answered

## Motion

Spring from bottom, 200ms. Backdrop fade 150ms.

## Dependencies

- `VideoPlayer` triggers on part end
- `ContinueButton` on lesson page

## Design Tokens

- `LMS_MOTION.spring`
- Sheet `rounded-t-3xl`

## Navigation Laws

8 — overlay only, answer required

## Implementation Path

`src/components/lms/trivia-sheet.tsx`

## Do Not

- Navigate to quiz page
- Multiple questions per sheet
- Dismiss via overlay click or Escape before answer
- Full-page replacement
