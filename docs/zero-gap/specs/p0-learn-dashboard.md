# Page Spec: Learn dashboard (`/learn`)

Parent PRD: [learn-hub](../prd/learn-hub.md) · Status: `QA'd`

## Purpose
Citizen learning home — continue modules, see progress.

## States
| State | Behavior |
|-------|----------|
| Loading | DashboardSkeleton |
| Error | ShieldAlert + retry (modulesError) |
| Empty | No modules message |
| Populated | LearnDashboardView |

## Sign-off
- [x] Dynamic stage count
- [x] Error/empty explicit
