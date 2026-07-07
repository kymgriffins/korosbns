# Component Contract — Course Hero

## Component Name

`CourseHero`

## Purpose

Present **enrollment decision** information — image dominance, metadata, single primary action.

## Used On

- Course Detail (`screen-contracts/course-detail.md`)

## Variants

| Variant | When |
|---------|------|
| Not enrolled | "Enroll & start learning" |
| In progress | "Resume" + progress bar |
| Completed | "Review" + certificate link (v2) |

## States

Default · Loading skeleton

## Interactions

| Action | Result |
|--------|--------|
| Primary CTA | → first/resume lesson |
| Secondary CTA (v2) | Bookmark |

## Props / Data

```ts
course: LmsCourse
completedLessons: number
totalLessons: number
startHref: string
```

## Accessibility

- Hero image decorative (`alt=""`) or descriptive if meaningful
- CTA includes course title in accessible name
- Metadata icons paired with text

## Motion

None on hero. CTA hover scale 1.02.

## Dependencies

- `ProgressBar`
- `Breadcrumb` (parent page)

## Design Tokens

- `LMS_LAYOUT.maxWidthClass`
- `LMS_COLORS.cta` (black primary)
- Hero split 60/40 desktop per Blueprint B

## Navigation Laws

6, 13

## Implementation Path

`src/components/lms/course-hero.tsx` (to extract from course page)

## Do Not

- Full-width banner only (must be 60/40 on desktop)
- Multiple primary buttons
- Show expanded modules inside hero
