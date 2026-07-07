# Screen Contract — Lesson

## Screen Name

Lesson (`/learn/courses/[courseSlug]/modules/[moduleSlug]/lessons/[lessonSlug]`)

## Purpose

**Primary learning surface.** Deliver video, checkpoint trivia, reflection, and forward motion in one immersive flow.

## Primary User Goal

Complete the lesson (all parts + required interactions).

## Secondary Goal

Access transcript, resources, or previous lesson.

## Entry Points

- Continue card (Home / Progress)
- Course Detail → lesson link
- Module Overview → lesson link
- Search result (type: lesson)
- Shared lesson URL

## Exit Points

- **Continue** → next part / next lesson / module complete
- Previous (ghost) → prior lesson
- Breadcrumb → **Module Overview** or **Course Detail**

## Primary CTA

**Continue** (sticky when current step requirements met).

**Why (W1):** Universal forward verb (Law 9). Learner never asks "what next?"

## Supporting CTA

**Previous lesson** (ghost), **Mark complete**, **Discussion** — demoted row below sticky Continue (Law 13).

## Information Hierarchy

1. Back / breadcrumb context
2. Lesson header (metadata, progress)
3. **Video** (largest element)
4. Part selector
5. Transcript (collapsed)
6. Reflection (after parts)
7. Resources (collapsed)
8. Sticky Continue
9. Secondary actions row

**Why no module tree here (W5):** Lesson is Level 4 — curriculum compresses to breadcrumb. Full module list would compete with video.

## Navigation

- Blueprint **D** — immersive
- **Bottom nav hidden** (Law 12)
- Top nav minimal
- Laws: 7, 8, 9, 10, 11, 12, 13

## Layout Blueprint

**D — Lesson**

## Components

- `LessonHeader` (or `LessonHero`)
- `VideoPlayer`
- `TriviaPopup` (overlay)
- `ReflectionCard`
- `ResourceSection`
- `ContinueButton` (sticky)
- `LessonFooter` (secondary only)

## Responsive Behaviour

- Mobile: full-width video; sticky Continue above safe area
- Desktop: video max 1100px centered

## Loading State

Video skeleton + header skeleton.

## Empty State

N/A — 404 if lesson missing.

## Error State

Video load fail: retry + message. 404 lesson.

## Animation

Trivia sheet: spring from bottom 200ms. Continue appear: fade 150ms.

## Accessibility

Video keyboard controls. Trivia focus trap. Continue `aria-disabled` until ready.

## Keyboard Navigation

Back link → video (native controls) → part buttons → Continue.

## Expected Completion Time

Lesson duration (6–18 min typical).

## Navigation Laws

7, 8, 9, 10, 11, 12, 13

## Architecture Review

| W1 | Continue is forward — trivia/reflection gate before enabled |
| A8 | One primary — sticky Continue only |
| A12 | Bottom nav hidden |
