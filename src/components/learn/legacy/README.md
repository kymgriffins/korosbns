# Learn Presentation Layer — DEPRECATED

```yaml
status: deprecated
replaced_by: src/components/budget-hub/
date: 2026-07-08
platform_changes: 0
```

This folder contains the **legacy Learn presentation layer** superseded by **Budget Hub**.

## What moved here

- `learn-dashboard-view.tsx` — dashboard home composition
- `learn-modules-view.tsx` — module grid shell
- `learn-content-grid.tsx` — list/grid cards
- `learn-sidebar.tsx` — secondary sidebar on list pages
- `learn-tab-page.tsx` — articles/videos tab layout
- `dashboard-skeleton.tsx` — loading skeleton

## What did NOT move

- **Runtime:** `contexts/learn-context`, `lib/module-progress`, data adapters
- **Routes:** `/learn/*` unchanged
- **Navigation:** `LearnMobileNav`, `learn-tab-sync`, `learn-nav`
- **Lesson experience:** stage drawers, step content, video players

## Migration status

| Surface | Status |
|---------|--------|
| Budget Hub landing (`/learn`) | Budget Hub |
| Article reader (`/learn/[slug]`) | Budget Hub |
| Tab views (`?tab=modules`, etc.) | Legacy (interim) |
| List pages (`/learn/articles`, etc.) | Legacy (interim) |

Do not extend these components. New editorial UI belongs in `src/components/budget-hub/`.
