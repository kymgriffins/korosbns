# Page Spec: Task new (`/admin/dashboard/task/new`)

Parent PRD: [task-workspace](../prd/task-workspace.md) · Status: `QA'd`

## Purpose
Create a weekly note with prefilled roster subtasks.

## Primary action
Create task.

## States
| State | Behavior |
|-------|----------|
| Loading users | Assignee select disabled |
| Populated | Default checklist roster on create |
| Validation | zod via useTaskForm |

## Sign-off
- [x] Roster default on create
- [x] Template buttons for Team A deliverable
