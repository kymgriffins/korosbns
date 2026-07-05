# Page Spec: Task board (`/admin/dashboard/task`)

Parent PRD: [task-workspace](../prd/task-workspace.md) · Status: `QA'd`

## Purpose
Browse and open weekly task notes.

## Primary action
Open a task to edit.

## States
| State | Behavior |
|-------|----------|
| Loading | Skeleton via AsyncListShell |
| Empty | EmptyStateShell + link to new task |
| Error | Alert + retry |
| Populated | Board / list / tiles per toolbar |

## Component map
TaskToolbar, AsyncListShell, EmptyStateShell, TaskListView (shadcn Table + tanstack)

## Responsive
sm: list default; md+: toolbar inline; board scrolls horizontally on mobile

## Sign-off
- [x] All states implemented
- [x] Ready for ship (v0.3.0)
