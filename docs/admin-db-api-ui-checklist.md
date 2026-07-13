# Admin DB | API | UI checklist

Use this to verify `/admin` (korosbns) can **populate and manage** real org data end-to-end.

**Surfaces**

| Surface | Role |
|---------|------|
| Django models + admin portal HTML | Source of truth / reference UX |
| `bnske` `/api/v1/*` | Write/read JSON for Next admin |
| `apps/admin` `/dashboard/*` | Canonical React admin UI |
| `src/app/admin/dashboard/*` | Live site mount; prefer re-exports of `apps/admin` |

**How to check a row**

1. **DB** — model exists; seed or create at least one row for the org  
2. **API** — authenticated `GET` list/detail returns it; writes succeed without inventing client fallbacks  
3. **UI** — `/admin/dashboard/...` lists the row and mutations refresh from API (no mock-only tables)

Status: `OK` · `PARTIAL` · `GAP` · `N/A`

---

## Learning Hub (civic modules) — priority

| Capability | DB | API | UI | Notes |
|------------|----|-----|-----|-------|
| Module list/create/update/delete | OK | OK | OK | `/dashboard/modules` |
| Module workflow transition | OK | OK | OK | `allowed_actions` + `/transition/` |
| Chapters CRUD + reorder | OK | OK | PARTIAL→OK | Wizard + `reorderChapters` |
| Chapter YouTube URLs | OK | OK | PARTIAL→OK | Wizard YouTube step |
| Link article to chapter | OK | OK | PARTIAL→OK | `link-article` + create article |
| Module trivia (questions) | OK | OK | OK | Wizard creates trivia + patches `trivia_id` |
| Publish checklist (advisory) | N/A | N/A | OK | Non-strict stepper hints |
| Learner hub `/learn` | OK | OK | OK | Public civic-modules; no fake catalogue |
| Authors (from modules) | OK | GAP writes | PARTIAL | List only |
| Courses (legacy) | OK | PARTIAL (no transition) | PARTIAL | Prefer civic modules |

---

## People & account

| Domain | Route | DB | API | UI | Gaps |
|--------|-------|----|-----|-----|------|
| Users | `/users` | OK | PARTIAL | OK | Invite + role/deactivate/verify; no direct create/PATCH |
| Invitations | `/invitations` | OK | OK | OK | |
| Authors | `/authors` | OK | GAP | PARTIAL | No write API |
| Profile | `/profile` | OK | OK | OK | |
| Privacy | `/privacy` | OK | PARTIAL | OK | GET-only |
| Security | `/security` | OK | OK | OK | Password change |

---

## Content

| Domain | Route | DB | API | UI | Gaps |
|--------|-------|----|-----|-----|------|
| Modules | `/modules` | OK | OK | OK (wizard) | See Learning Hub |
| Stories | `/stories` | OK | PARTIAL | OK | No hard DELETE |
| Knowledge | `/knowledge` | OK | PARTIAL | OK | No hard DELETE |
| Courses | `/courses` | OK | PARTIAL | PARTIAL | No publish transition |
| Media / YouTube sync | `/media` | OK | OK | OK | No full media library list |
| Feedback | `/feedback` | OK | PARTIAL | PARTIAL | No status PATCH |

---

## Engagement

| Domain | Route | DB | API | UI | Gaps |
|--------|-------|----|-----|-----|------|
| Hub | `/engagement` | OK | OK | OK | Composed KPIs |
| Surveys + results | `/surveys` | OK | OK | OK | |
| Trivia + attempts | `/trivia` | OK | OK | OK | Also embedded in module wizard |
| Events | `/events` | OK | OK | OK | |
| Forum | `/forum` | OK | OK | OK | Soft-delete |

---

## Communication

| Domain | Route | DB | API | UI | Gaps |
|--------|-------|----|-----|-----|------|
| Dashboard | `/communication` | OK | OK | OK | |
| Campaigns | `.../campaigns` | OK | OK | OK | |
| Inbox / Outbox | `.../inbox`, `outbox` | OK | OK | OK | |
| Contact messages | `.../contact-messages` | OK | OK | OK | |
| Email hooks | `.../email-hooks` | OK | OK | OK | |
| Subscribers | `.../subscribers` | OK | PARTIAL | OK | List-only |
| Notifications | `.../notifications` | OK | OK | OK | |
| Audit logs | `.../audit-logs` | OK | OK | OK | |
| Social / TikTok | `/social` | OK | OK | OK | |

---

## Organization & library

| Domain | Route | DB | API | UI | Gaps |
|--------|-------|----|-----|-----|------|
| Doc repository | `/docrepository` | OK | OK | OK | |
| Org settings | `/settings` | OK | OK | OK | |
| Partners | `/partners` | OK | PARTIAL | OK | Soft deactivate only |
| Roles | `/roles` | OK | OK | OK | |
| Gamification | `/gamification` | OK | OK | OK | |
| Studio | `/studio` | OK | OK | PARTIAL | Portfolio/testimonials API unused in UI |
| KE Budget | `/ke-budget` | OK | PARTIAL | OK | Entities list-only |
| Budget uploads | `/budget-data` | OK | OK | PARTIAL | Off sidebar; linked from overview |
| Invoices | `/invoices` | OK | OK | OK | |

---

## Tasks / analytics

| Domain | Route | DB | API | UI | Gaps |
|--------|-------|----|-----|-----|------|
| Overview | `/dashboard` | OK | OK | OK | |
| Analytics | `/analytics` | OK | OK | OK | |
| Task board / report | `/task`, `/task/report` | OK | OK | OK | |
| Notes page | `/notes` | OK | OK | PARTIAL | Wired but not in nav |

---

## Residual blockers (fix for “all related data”)

- [ ] Authors write API + UI  
- [ ] Course publish `/transition/`  
- [ ] Feedback status update  
- [ ] Studio portfolio + testimonials tabs  
- [ ] KE budget entity CRUD  
- [x] Module `trivia_id` attach via JSON PATCH (wizard create + patch)  
- [x] Remove dual legacy modules UI (`src/.../modules` → re-export wizard)  
- [ ] Privacy config writes (if product needs them)

---

## Manual smoke (per org)

1. Log into `/admin` as leadership/digital-team.  
2. **Learning → Modules**: create module → add chapter → add YouTube → add trivia question → publish.  
3. Open `/learn/modules/<slug>` — chapter steps + trivia appear.  
4. Spot-check Users, Surveys, Campaigns, Doc repo, KE Budget for non-empty API lists.  
5. Confirm no page still shows invented fallback rows when the API errors.
