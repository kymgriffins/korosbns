# Screen Contract — Profile

## Screen Name

Profile (`/learn/profile`)

## Purpose

Learner **identity and stats** hub — gateway to account settings, not learning itself.

## Primary User Goal

View learning statistics and access settings.

## Secondary Goal

Navigate to certificates, bookmarks (v2).

## Entry Points

- Bottom nav **Profile**
- Top nav profile icon

## Exit Points

- Settings links → `/learn/account/*`
- Certificates → Progress
- Bottom nav → other hubs

## Primary CTA

None at page level — links are supporting.

**Why (W1):** Profile is identity, not action. Learning happens on Home/Continue.

## Supporting CTA

**Certificates**, **Bookmarks**, **Settings** — outline buttons.

## Information Hierarchy

1. Avatar + name
2. Stats grid (4 metrics)
3. Action links list

## Navigation

- Blueprint **A**
- Laws: 2, 3, 15

## Layout Blueprint

**A — Hub**

## Components

- `BitmojiAvatar`
- Stat cards
- Link buttons
- `LmsShell`

## Responsive Behaviour

Stats 2×2 mobile; 4-col desktop.

## Loading State

Avatar + stat skeletons.

## Empty State

Anonymous: prompt sign in (link to auth).

## Error State

Stats fail: show profile without stats.

## Animation

Minimal.

## Accessibility

Stats have text labels. Settings links descriptive.

## Keyboard Navigation

Avatar → stats → link list.

## Expected Completion Time

15–30 seconds.

## Navigation Laws

2, 3, 15 (account routes outside shell)
