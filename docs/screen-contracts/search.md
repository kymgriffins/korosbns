# Screen Contract — Search

## Screen Name

Search (`/learn/search`)

## Purpose

**Utility** to find courses, modules, and lessons by keyword — intentional, not habitual.

## Primary User Goal

Find specific content and jump to it.

## Secondary Goal

N/A

## Entry Points

- Top nav search icon
- Direct URL `/learn/search`

## Exit Points

- Result tap → Course | Module | Lesson route
- Bottom nav (mobile)

## Primary CTA

Implicit: tap a **search result**.

**Why (W1):** Search is means to an end — result is the CTA.

## Supporting CTA

None

## Information Hierarchy

1. Search input (autofocus)
2. Grouped results (course / module / lesson)
3. Empty message

## Navigation

- Blueprint **E**
- Laws: 14 (not in bottom nav)

## Layout Blueprint

**E — Utility**

## Components

- Search input
- Result list items
- `LmsShell`

## Responsive Behaviour

Single column.

## Loading State

Debounce 300ms; spinner in input.

## Empty State

No query: placeholder hint. No results: "No results for …"

## Error State

Search fail: toast + retry.

## Animation

Results fade in 150ms.

## Accessibility

`role="search"`. Results as list with headings per group.

## Keyboard Navigation

Input → results. Enter on result navigates.

## Expected Completion Time

10–30 seconds.

## Navigation Laws

14
