# Component Contract — Video Player

## Component Name

`VideoPlayer` (`VideoExperience`)

## Purpose

Deliver one **video part** at a time within the lesson — never as a standalone page.

## Used On

- Lesson (`screen-contracts/lesson.md`)

## Variants

| Variant | When |
|---------|------|
| Default | Active part playing |
| Completed | Part watched (checkmark on selector) |
| Loading | Buffering |
| Disabled | Locked part (v2) |

## States

| State | UI |
|-------|-----|
| Playing | Native controls active |
| Paused | Native controls |
| Ended | Triggers trivia if configured |
| Error | Retry message overlay |

## Interactions

| Action | Result |
|--------|--------|
| Play / Pause | Native video controls |
| Part ends | `onPartEnd(partId)` → trivia |
| Select part | Swap active video + transcript |
| Fullscreen | Native (if supported) |

## Props / Data

```ts
parts: LmsVideoPart[]  // 3–4 per lesson
onPartEnd?: (partId: string) => void
```

## Accessibility

- `<video controls>` with `playsInline`
- Part buttons: `aria-current` on active part
- Keyboard: focus part selector after video

## Motion

Part switch: crossfade 200ms (optional). Selector highlight 150ms.

## Dependencies

- `TriviaPopup` (on end)
- `ContinueButton` (gates next part)

## Design Tokens

- `LMS_LAYOUT.lessonMaxWidthClass`
- `LMS_RADIUS.card`

## Navigation Laws

7 — never new page  
8 — trivia triggered from here

## Implementation Path

`src/components/lms/video-experience.tsx`

## Do Not

- Navigate to `/videos`
- Auto-play next part without user Continue
- Show all parts' videos simultaneously
