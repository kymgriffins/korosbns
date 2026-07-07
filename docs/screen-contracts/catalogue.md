# Screen Contract — Course Catalogue

## Screen Name

Course Catalogue (`/learn/catalogue`)

## Purpose

Let learners **discover and compare** all available courses without overwhelming detail.

## Primary User Goal

Find a relevant course and open its detail page.

## Secondary Goal

Filter by category, difficulty, or search query.

## Entry Points

- Bottom nav **Learn**
- Top nav **Courses** / **Discover**
- Home → Browse all courses
- Direct URL

## Exit Points

- Course card → **Course Detail**
- Bottom nav → other hubs

## Primary CTA

Implicit: tap a **course card** (card is the CTA).

**Why (W1):** Discovery screen — the card tap is the commitment to evaluate one course.

## Supporting CTA

None at page level. Filters are tertiary controls.

## Information Hierarchy

1. Page title + lead
2. Search input
3. Category filters
4. Difficulty filters
5. Course grid

## Navigation

- Blueprint **A**
- Laws: 2, 3, 13, 14

## Layout Blueprint

**A — Hub**

## Components

- `CourseCard` (grid)
- Search input (shadcn `Input`)
- Filter chips
- `LmsShell`, `LmsPage`

## Responsive Behaviour

- Mobile: 1-col cards
- Desktop: 2-col grid

## Loading State

6 skeleton cards.

## Empty State

No matches: "No courses match" + clear filters link.

## Error State

Catalogue fetch fail: inline error + retry.

## Animation

Filter chip toggle 150ms. Card hover 1.02.

## Accessibility

Search labelled. Filter chips as toggle buttons with `aria-pressed`.

## Keyboard Navigation

Search → filters → course cards in DOM order.

## Expected Completion Time

30–90 seconds browsing.

## Navigation Laws

2, 3, 13, 14
