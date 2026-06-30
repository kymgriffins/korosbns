# BNS Core Feature Progress & Audit Tracker

## Auth System — Priority: CRITICAL

> **Status**: ⬜ Not Started | 🔄 In Progress | ✅ Complete | ❌ Blocked

| # | Item | Status | Notes |
|---|------|--------|-------|
| A1 | Fix middleware `bns_has_session` marker cookie expiry mismatch (1h vs actual session) | ⬜ | Marker expires in 1h but real session lasts longer; causes false redirects |
| A2 | Remove redundant `useLogin` hook in `use-auth-actions.ts` | ⬜ | Unused — login page calls `useAuth().login()` directly |
| A3 | Create centralized RBAC constants (single source of truth for role slugs) | ⬜ | `AdminGuard` hardcodes `["admin","manager","editor"]` — needs centralization |
| A4 | Audit all admin pages — replace `isLoggedIn` checks with `AdminGuard` or `RequireAuth` with role prop | ⬜ | `content/page.tsx`, `modules/page.tsx`, `task-overview/page.tsx` use raw `isLoggedIn` |
| A5 | Add unit tests for `auth-context.tsx` (core auth state machine) | ⬜ | No direct tests exist |
| A6 | Delete dead `apps/budgethub/middleware.ts` | ⬜ | Empty matcher, no-op |
| A7 | Test middleware for `/admin` and `/task` paths | ⬜ | Only `/learn/*` paths tested |
| A8 | Fix `/task` page on live site — diagnose "error try again" | ✅ | Added FALLBACK_TASKS, `withFallback` safety net |

## Learn Hub (/learn) — Priority: HIGH

| # | Item | Status | Notes |
|---|------|--------|-------|
| L1 | Audit all 19 learn pages with gstack design/eng/QA | ⬜ | Design review, error states, loading UX |
| L2 | Add CRUD admin pages for articles, stories, videos, quests, paths | ⬜ | Currently read-only; needs backend APIs + admin forms |
| L3 | Migrate `/learn/account/*` to use `userData` stores exclusively | ⬜ | Some direct `citizenApi` calls remain |

## Task Board (/task) — Priority: HIGH

| # | Item | Status | Notes |
|---|------|--------|-------|
| T1 | Verify `withFallback` works on live site | ⬜ | Added FALLBACK_TASKS but need live verification |
| T2 | Migrate direct `taskApi` calls in pages to `taskData` store methods | ⬜ | `task/[id]/page.tsx`, `kanban/page.tsx` call `taskApi` directly |
| T3 | Add task creation/edit forms to `/admin` | ✅ | Already exists at `admin/dashboard/task/new` and `admin/dashboard/task/[id]` |

## Admin (/admin) — Priority: HIGH

| # | Item | Status | Notes |
|---|------|--------|-------|
| AD1 | Demo pages → real data: `ecommerce`, `academy`, `crm`, `finance`, `logistics`, `default`, `calendar`, `invoice` | ⬜ | 8 pages use DemoBanner + hardcoded data |
| AD2 | Add user documentation/tips to every admin page | ⬜ | Tooltips, help text, page-level guidance |
| AD3 | Create `/admin/not-found.tsx` and `/admin/error.tsx` | ⬜ | Falls back to root-level |
| AD4 | Clean up legacy `(legacy)/` pages or remove them | ⬜ | 4 legacy v1 dashboards |

## Backend CRUD APIs Needed (Deprecating Django HTMLs) — Priority: HIGH

| # | Endpoint | Current State | Status |
|---|----------|--------------|--------|
| B1 | `POST/PATCH/DELETE /api/v1/content/learn/{type}/{id}` | GET-only | ⬜ |
| B2 | `POST/PATCH/DELETE /api/v1/content/civic-modules/{slug}` | GET-only | ⬜ |
| B3 | `GET/POST/PATCH/DELETE /api/v1/users/` (admin) | Only `/users/me/` exists | ⬜ |
| B4 | `GET/POST/PATCH/DELETE /api/v1/roles/` | Does not exist (Django HTML only) | ⬜ |
| B5 | `DELETE /api/v1/engagement/forum-threads/{id}` | GET+POST only | ⬜ |
| B6 | `POST/PATCH/DELETE /api/v1/content/authors/{slug}` | GET-only | ⬜ |
| B7 | `GET/POST/DELETE /api/v1/budget/records/` | Does not exist | ⬜ |
| B8 | Newsletter management admin API | Subscriber list exists, no CRUD | ⬜ |

## Surveys (/surveys) — Priority: MEDIUM

| # | Item | Status | Notes |
|---|------|--------|-------|
| S1 | Add survey results page to admin | ⬜ | `engagement/surveys/{id}/results/` exists on backend |
| S2 | Add survey creator/editor to admin | ⬜ | Currently Django HTML only |
| S3 | Add survey CRUD to data stores | ⬜ | Only `fetch()` exists |

## Events (/events) — Priority: MEDIUM

| # | Item | Status | Notes |
|---|------|--------|-------|
| E1 | Add event CRUD to admin | ⬜ | Backend has admin event endpoints |
| E2 | Add event RSVP management | ⬜ | Community Hub registration is basic |

## Reports (Budget Tracking) — Priority: MEDIUM

| # | Item | Status | Notes |
|---|------|--------|-------|
| R1 | Bring `/reports` into main app from `apps/budgethub` | ⬜ | Exists only in apps/budgethub |
| R2 | Add budget report data store to frontend | ⬜ | Needs store + fallback |

## Newsletter — Priority: LOW

| # | Item | Status | Notes |
|---|------|--------|-------|
| N1 | Create newsletter subscription page | ⬜ | Currently has no frontend page |
| N2 | Add newsletter admin (campaigns, subscribers, analytics) | ⬜ | Backend has basic subscriber list |

## June 18th Meeting Report — Priority: NOW

| # | Item | Status | Notes |
|---|------|--------|-------|
| J1 | Find/create June 18 meeting task in task board | ⬜ | No June 18 meeting in `bnsConfig.json` |
| J2 | Check off completed checklist items on task detail page | ⬜ | Instructions: `/task/{id}` → Checklist tab → click checkboxes |
| J3 | Generate meeting report with completed/pending breakdown | ⬜ | |

## QA & Testing — Priority: HIGH

| # | Item | Status | Notes |
|---|------|--------|-------|
| Q1 | Run gstack QA on /admin (all 32 pages) | ⬜ | |
| Q2 | Run gstack QA on /learn (all 19 pages) | ⬜ | |
| Q3 | Run gstack QA on /task (3 pages) | ⬜ | |
| Q4 | Run gstack QA on /surveys, /events, /auth | ⬜ | |
| Q5 | Full test suite: `npx vitest run` | 39/40 pass | 287/289 tests pass (2 pre-existing analytics failures) |
| Q6 | TypeScript check: `npx tsc --noEmit` | ⬜ | |

## Documentation — Priority: MEDIUM

| # | Item | Status | Notes |
|---|------|--------|-------|
| D1 | Add user tips/help text to every admin page | ⬜ | "Working tips" for each admin section |
| D2 | Document auth flow in AGENTS.md | ✅ | Existing but needs update |
| D3 | Document headless data layer pattern | ✅ | Existing in AGENTS.md |

## Legend
- ⬜ Not Started
- 🔄 In Progress  
- ✅ Complete
- ❌ Blocked
