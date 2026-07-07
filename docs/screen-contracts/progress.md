# Screen Contract — Progress

## Screen Name

Progress (`/learn/progress`)

## Purpose

Show **milestone-based** learning progress across courses — not a analytics dashboard.

## Primary User Goal

See how far along each course is and resume quickly.

## Secondary Goal

Check streak and certificate count.

## Entry Points

- Bottom nav **Progress**
- Profile → Certificates link

## Exit Points

- Course continue card → Lesson or Course Detail
- Bottom nav → other hubs

## Primary CTA

**Resume** on per-course continue card.

**Why (W1):** Same as Home — progress screen exists to re-enter the loop, not to analyze data.

## Supporting CTA

None at page level.

## Information Hierarchy

1. Overall progress bar
2. Streak + certificates metrics
3. Per-course progress + continue cards

## Navigation

- Blueprint **A**
- Laws: 1, 2, 3, 13

## Layout Blueprint

**A — Hub**

## Components

- `ProgressBar`
- `CourseCard` (continue)
- Metric cards
- `LmsShell`

## Responsive Behaviour

Metrics 2-col mobile; course cards full width.

## Loading State

Progress skeleton + 2 course skeletons.

## Empty State

No enrollments: "Start your first course" + Catalogue link.

## Error State

Progress API fail: show cached data or empty with retry.

## Animation

Progress bar fill 300ms on load.

## Accessibility

Progress bars have `aria-valuenow`.

## Keyboard Navigation

Metrics (read-only) → course cards.

## Expected Completion Time

15–30 seconds.

## Navigation Laws

1, 2, 3, 13
