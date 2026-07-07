# Screen Contract — Home

## Screen Name

Learn Home (`/learn`)

## Purpose

Re-orient returning learners and surface the **fastest path back into learning**. Home is not a dashboard — it is a launchpad.

## Primary User Goal

Resume the current course in one tap.

## Secondary Goal

Discover a new course or check streak/achievements.

## Entry Points

- Bottom nav **Home**
- Logo from `LmsTopNav`
- Direct URL `/learn`
- Post-auth redirect

## Exit Points

- Continue card → **Lesson** (resume)
- Course card → **Course Detail**
- Catalogue link → **Catalogue**
- Achievements teaser → **Achievements**
- Bottom nav → any hub

## Primary CTA

**Resume** on Continue Learning card.

**Why (W1):** Returning learners are the primary audience (Journey B). The product optimises time-to-video, not browsing.

## Supporting CTA

**Browse all courses** (outline) — for learners without in-progress enrollment.

## Information Hierarchy

1. Continue Learning card (if enrolled)
2. Daily goal / streak (motivation, low visual weight)
3. Recently viewed courses
4. Recommendations
5. Recent achievements teaser

## Navigation

- **Blueprint A** — Hub
- Bottom nav visible (mobile)
- Top nav visible (desktop)
- Laws: 1, 2, 3, 13

## Layout Blueprint

**A — Hub**

## Components

- `CourseCard` (continue + grid variants)
- `AchievementBadge` (teaser)
- `ProgressBar` (on continue card)
- `LmsShell`

## Responsive Behaviour

- Mobile: single column, continue card full width
- Desktop: continue card 60/40 image split; recommendations 2-col grid

## Loading State

Skeleton for continue card + 2 course card placeholders.

## Empty State

No enrollment: hide continue card; show welcome copy + **Browse catalogue** as primary.

## Error State

Failed progress fetch: show catalogue CTA; toast error.

## Animation

Page enter: fade 200ms. Card hover: scale 1.02.

## Accessibility

Continue card is a single link with descriptive label including course title.

## Keyboard Navigation

Tab: skip link → continue → section headings → cards.

## Expected Completion Time

5–15 seconds (orient + tap continue).

## Navigation Laws

1, 2, 3, 13, 14

## Architecture Review

| Check | Status |
|-------|--------|
| A1 New nav pattern? | No |
| A8 One primary CTA? | Yes — Resume OR Browse when empty |
| A10 Blueprint A? | Yes |
