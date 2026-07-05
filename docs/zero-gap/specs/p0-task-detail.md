# Page Spec: Task detail (`/admin/dashboard/task/[id]`)

Parent PRD: [task-workspace](../prd/task-workspace.md) · Status: `QA'd`

## Purpose
Edit a weekly note, checklist roster, and attachments.

## Primary action
Save changes.

## States
| State | Behavior |
|-------|----------|
| Loading | Skeleton; mobile chrome skeleton |
| Empty (404) | Centered message + back to board |
| Populated | Mobile: editor first; lg: brief left |
| Error | Toast on load failure |

## Responsive
- sm: TaskDetailMobileChrome sticky; form `layout=workspace`
- lg: brief sidebar sticky; desktop export header

## Sign-off
- [x] Mobile-first order
- [x] Workspace form layout
- [x] v0.3.0
