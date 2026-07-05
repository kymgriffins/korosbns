# Page inventory — Korosbns Zero-Gap

Status key: `☐` not started · `◐` spec draft · `☑` spec + checklist complete

States shorthand: **L** loading · **E** empty · **Er** error · **P** populated · **D** denied

---

## P0 — Ship first (v0.3.0)

| # | Route | Primary action | States | Spec | Checklist |
|---|-------|----------------|--------|------|-----------|
| 1 | `/admin/dashboard/task` | Find / open a task | L E Er P | ☑ | ☑ |
| 2 | `/admin/dashboard/task/[id]` | Edit weekly note | L E Er P D | ☑ | ☑ |
| 3 | `/admin/dashboard/task/new` | Create task | L Er P | ☑ | ☑ |
| 4 | `/admin/dashboard/task/report` | View weekly report | L E Er P | ◐ | ☐ |
| 5 | `/admin/dashboard/task-overview` | Overview metrics | L E Er P | ◐ | ☐ |
| 6 | `/learn` (dashboard) | Continue learning | L E Er P | ☑ | ☑ |
| 7 | `/learn/[slug]` | Read module | L E Er P D | ☑ | ☑ |
| 8 | `/learn/profile` | View progress | L E Er P | ☑ | ☑ |
| 9 | `/learn/account` | Manage account | L Er P | ☑ | ☑ |
| 10 | `/auth/login` | Sign in | Er P | ☑ | ☑ |
| 11 | `/auth/register` | Create account | Er P | ◐ | ☐ |
| 12 | `/auth/reset` | Reset password | Er P | ☐ | ☐ |
| 13 | `/auth/verify` | Verify email | Er P | ☐ | ☐ |
| 14 | `/weekly-notes/manage` | Manage notes | L E Er P D | ☐ | ☐ |
| 15 | `/reports` | View reports hub | L E Er P | ☐ | ☐ |

---

## P1 — High traffic (v0.4.0)

| # | Route | Spec | Checklist |
|---|-------|------|-----------|
| 16 | `/` (landing) | ☐ | ☐ |
| 17 | `/events` | ☐ | ☐ |
| 18 | `/events/[id]` | ☐ | ☐ |
| 19 | `/budgetnews` | ☐ | ☐ |
| 20 | `/budgetnews/[slug]` | ☐ | ☐ |
| 21 | `/learn/forum` | ☑ | ☐ |
| 22 | `/learn/analytics` | ☑ | ☐ |
| 23 | `/learn/videos` | ☐ | ☐ |
| 24 | `/bns-studio` | ☐ | ☐ |
| 25 | `/surveys` | ☐ | ☐ |
| 26 | `/surveys/[id]` | ☐ | ☐ |
| 27 | `/weekly-notes/audit` | ☐ | ☐ |
| 28 | `/bns-project/[id]` | ☐ | ☐ |
| 29 | `/admin/dashboard` (home) | ☐ | ☐ |
| 30 | `/admin/dashboard/users` | ☐ | ☐ |
| 31 | `/admin/dashboard/content` | ☐ | ☐ |
| 32 | `/admin/dashboard/communication/*` | ☐ | ☐ |
| 33 | `/admin/dashboard/budget-data` | ☐ | ☐ |
| 34 | `/admin/auth/v2/login` | ☐ | ☐ |
| 35 | `/offline` | ☐ | ☐ |

---

## P2 — Admin / secondary

Remaining `/admin/dashboard/*` routes (crm, ecommerce, logistics, academy, kanban, invoice, …). **No new work** until P0+P1 green or explicit PRD.

---

## P3 — Deprecate candidates

| Route | Action |
|-------|--------|
| `/admin/dashboard/(legacy)/*-v1` | Remove or redirect (Phase 6) |
| Template demos without PRD | Hide from nav |

---

## Spec file naming

`docs/zero-gap/specs/<tier>-<slug>.md`  
Example: `docs/zero-gap/specs/p0-task-detail.md`

Use template: [templates/PAGE-SPEC-TEMPLATE.md](./templates/PAGE-SPEC-TEMPLATE.md)
