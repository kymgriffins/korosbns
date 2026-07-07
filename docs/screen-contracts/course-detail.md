# Screen Contract — Course Detail

## Screen Name

Course Detail (`/learn/courses/[courseSlug]`)

## Purpose

Help learner **decide to enroll** and provide the **curriculum map** without leaving the page.

## Primary User Goal

Start or resume learning this course.

## Secondary Goal

Understand scope (modules, duration, requirements).

## Entry Points

- Catalogue / Home course card
- Search result (type: course)
- Progress → course row
- Shared URL

## Exit Points

- Primary CTA → **Lesson** (first or resume)
- Module expand → lesson link → **Lesson**
- Breadcrumb → Home / Catalogue
- Module title link → **Module Overview** (optional deep link)

## Primary CTA

**Enroll & start learning** OR **Resume** if in progress.

**Why (W1):** Enrollment is the commitment gate. Video only after intent is clear.

## Supporting CTA

**Save for later** (v2, outline) — bookmark without enrolling.

## Information Hierarchy

1. Breadcrumb
2. Hero (image + metadata + progress + CTA) — 60/40 desktop
3. Description (prose width)
4. Requirements (collapsed)
5. Modules accordion (all collapsed default)
6. Reviews (v2, collapsed)

**Why modules below hero (W5):** Learner decides *whether* to enroll before seeing full lesson list. Modules are progressive disclosure, not the first thing seen.

## Navigation

- Blueprint **B**
- Bottom nav on mobile
- Laws: 4, 5, 6, 13, 16

## Layout Blueprint

**B — Course Detail**

## Components

- `CourseHero`
- `ModuleCard` (accordion group — one open)
- `LessonCard` (inside expanded module)
- `ProgressBar`
- `LmsShell`

## Responsive Behaviour

- Mobile: hero stacks image above metadata
- Desktop: 60/40 hero row

## Loading State

Hero skeleton + 3 module card skeletons.

## Empty State

N/A — 404 if course not found.

## Error State

404 page for unknown slug.

## Animation

Module expand: height 200ms spring. Accordion: close others on open (Law 5).

## Accessibility

Accordion `aria-expanded`. Hero CTA descriptive.

## Keyboard Navigation

Breadcrumb → hero CTA → module triggers → lesson links.

## Expected Completion Time

60–120 seconds to decide + enroll.

## Navigation Laws

4, 5, 6, 13, 16

## Architecture Review

| W5 | Modules below hero — enrollment before curriculum depth |
| A4 | Modules expand in place — Law 4 |
| A5 | One module open — Law 5 |
