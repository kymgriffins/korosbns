# Component Contract — Achievement Badge

## Component Name

`AchievementBadge` (`AchievementCard`)

## Purpose

Display **one milestone** — unlocked or locked — with icon, title, description.

## Used On

- Achievements page
- Home teaser
- Lesson complete inline (v2)

## Variants

| Variant | Style |
|---------|-------|
| Unlocked | Primary border tint, full opacity |
| Locked | Muted, reduced opacity |

## States

Locked · Unlocked

## Interactions

| Action | Result |
|--------|--------|
| Tap (v2) | Detail modal |

## Props / Data

```ts
achievement: LmsAchievement
```

## Accessibility

- Status text "Unlocked" / "Locked" — not icon alone
- Emoji has `aria-hidden` with text label

## Motion

Unlock animation (v2): scale 1.02 once.

## Dependencies

None

## Design Tokens

- `LMS_RADIUS.card`
- `p-5` padding

## Navigation Laws

None

## Implementation Path

`src/components/lms/achievement-card.tsx`

## Do Not

- Gamification points leaderboard on this component
- More than 2 accent colors per card
