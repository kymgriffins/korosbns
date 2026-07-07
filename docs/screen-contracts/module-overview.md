# Screen Contract — Module Overview

## Screen Name

Module Overview (`/learn/courses/[courseSlug]/modules/[moduleSlug]`)

## Purpose

**Optional deep link** for module-first context (objectives, facilitator sharing). Canonical curriculum remains Course Detail accordion.

## Primary User Goal

Understand module objectives and start or resume a lesson in this module.

## Secondary Goal

See lesson list with durations before committing.

## Entry Points

- Shared module URL
- Future: notification deep link
- Course page → module title (if linked)

## Exit Points

- **Start module** → first lesson
- Lesson row → **Lesson**
- Breadcrumb → **Course Detail**

## Primary CTA

**Start module** (or **Resume** if in progress).

**Why (W1):** Module page answers "what will I learn in this chapter?" before playback.

## Supporting CTA

Back to course (breadcrumb).

## Information Hierarchy

1. Breadcrumb (Course › Module)
2. Module hero (number, status, title, duration, progress)
3. Objectives list
4. Lesson list (expanded)

## Navigation

- Blueprint **C**
- Bottom nav visible
- Laws: 6, 13

## Layout Blueprint

**C — Module Overview**

## Components

- `ModuleCard` (forced open) OR `LessonCard` list
- `ProgressBar`
- `LmsShell`

## Responsive Behaviour

Single column all breakpoints.

## Loading State

Hero + lesson list skeleton.

## Empty State

Locked module: show unlock requirement; disable start CTA.

## Error State

404 unknown module.

## Animation

Minimal — page fade 200ms.

## Accessibility

Locked state announced. Start CTA disabled when locked.

## Keyboard Navigation

Breadcrumb → CTA → lesson links.

## Expected Completion Time

30–60 seconds orienting.

## Navigation Laws

6, 13

## Note

**Why this page exists alongside accordion:** Shareable URL for educators. Most learners use Course Detail accordion only (Law 4).
