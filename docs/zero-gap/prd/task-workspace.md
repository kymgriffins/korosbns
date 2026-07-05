# PRD: Task workspace

Status: `Approved`  
Owner: Eng · Date: 2026-07-05 · Version: 0.1.0  
Parent program: [TASKPLAN.md](../TASKPLAN.md)

## 1. Problem Statement

Weekly task notes are edited across board, detail, and report views without a unified mobile-first experience or spec-driven states. Gaps (brief-before-editor on mobile, inconsistent empty/error handling, forms not on rhf+zod) were found in QA, not prevented at design time.

## 2. Target User & Job-to-be-Done

- **Primary user:** Admin / team lead managing weekly notes and sub-task rosters.
- **Job-to-be-done:** When I open a task, I want to edit checklist and metadata quickly on any device, so I can publish on time.
- **Secondary:** Auditors viewing read-only published notes.

## 3. Success Metrics

- **Primary:** P0 task routes pass Gate 5 checklist (all states).
- **Secondary:** Task detail LCP on mobile ≤ desktop parity for time-to-first-input; `goldrules:audit` P0 inline styles → 0.
- **Non-metrics:** Full admin template parity; kanban redesign.

## 4. Scope Boundaries

### In scope
- `/admin/dashboard/task`, `/task/[id]`, `/task/new`, `/task/report`, `/task-overview`
- Mobile-first detail layout, sub-task roster templates
- Layer split: `features/tasks/`, `lib/task-schema.ts`, `hooks/useTaskForm.ts`

### Out of scope
- Kanban drag-drop rewrite
- Backend API changes (unless blocking checklist states)

### Exceptions
- Task hue accent bar may use dynamic `style={{ background }}` until semantic token for per-task color exists (log in TOKEN-EXCEPTIONS).

## 5. Page Inventory

| # | Page/Screen | States required | Page Spec status |
|---|-------------|-----------------|------------------|
| 1 | Task board | loading, empty, populated, error | ☐ `specs/p0-task-board.md` |
| 2 | Task detail | loading, empty (404), populated, error, permission-denied | ☐ `specs/p0-task-detail.md` |
| 3 | Task new | loading (users), populated, validation error | ☐ `specs/p0-task-new.md` |
| 4 | Task report | loading, empty, populated, error | ☐ `specs/p0-task-report.md` |
| 5 | Task overview | loading, empty, populated, error | ☐ `specs/p0-task-overview.md` |

## 6. Dependencies

- `lib/task-api.ts`, `data/tasks.ts`
- shadcn Form, Collapsible, Tabs
- Merge: `feat/task-subtask-roster`, mobile-first detail work

## 7. Open Questions

| Question | Owner | Resolution |
|----------|-------|------------|
| Wholesale auto-tier from onboarding? | Product | Deferred — not in task PRD |

## 8. Approval

- [ ] Design lead
- [ ] Eng lead
