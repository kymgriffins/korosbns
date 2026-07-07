# Component Contract — Resource Card / Section

## Component Name

`ResourceSection`

## Purpose

Provide **downloadable and external resources** collapsed by default — never interrupt video flow.

## Used On

- Lesson (`screen-contracts/lesson.md`)

## Variants

| Kind | Icon |
|------|------|
| pdf | FileText |
| link | Link2 |
| template | FileText |

## States

Collapsed (default) · Expanded

## Interactions

| Action | Result |
|--------|--------|
| Expand `<details>` | Show resource list |
| Tap resource | Open/download href |

## Props / Data

```ts
resources: LmsResource[]
```

## Accessibility

- Native `<details>` / `<summary>`
- External links `rel="noopener"`

## Motion

None (native details toggle).

## Dependencies

None

## Design Tokens

- `LMS_RADIUS.card`
- Collapsed by default per Law progressive disclosure

## Navigation Laws

None

## Implementation Path

`src/components/lms/resources-section.tsx`

## Do Not

- Auto-expand on lesson load
- Inline PDF viewer (v2 separate)
