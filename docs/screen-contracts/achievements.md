# Screen Contract — Achievements

## Screen Name

Achievements (`/learn/achievements`)

## Purpose

**Recognize milestones** — motivation layer, not gamification dashboard.

## Primary User Goal

See what badges are unlocked and what remains.

## Secondary Goal

Understand how to unlock locked achievements.

## Entry Points

- Bottom nav **Achievements**
- Home achievements teaser

## Exit Points

- Bottom nav → other hubs
- (v2) Tap badge → detail modal

## Primary CTA

None — browse screen. No forced action.

**Why (W1):** Recognition is optional. Learner exits via hub nav when satisfied.

## Supporting CTA

N/A

## Information Hierarchy

1. Summary (X of Y unlocked)
2. Unlocked achievements
3. Locked achievements

## Navigation

- Blueprint **A**
- Laws: 2, 3

## Layout Blueprint

**A — Hub**

## Components

- `AchievementBadge`
- `LmsShell`

## Responsive Behaviour

2-col grid desktop; 1-col mobile.

## Loading State

4 badge skeletons.

## Empty State

No achievements defined: friendly copy.

## Error State

Fetch fail + retry.

## Animation

Unlock celebration (v2): confetti on lesson complete, not on this page load.

## Accessibility

Locked/unlocked text labels, not color alone.

## Keyboard Navigation

Grid of cards tabbable.

## Expected Completion Time

20–40 seconds browsing.

## Navigation Laws

2, 3
