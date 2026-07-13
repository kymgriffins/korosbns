# Admin API Migration TODO

**Branch:** `feat/admin-api-migration`  
**Goal:** Every Next.js admin page must consume Django (`bnske`) JSON APIs the way the HTML portal does — no mock StudioKit pages, no dead sidebar links.  
**Done (do not redo):** Weekly notes / Tasks (`/api/v1/notes/`, board, report, checklist, publish/audit, exports).

**Surfaces**
- Primary target: `apps/admin` (`/dashboard/*`)
- Legacy/embedded: `src/app/admin` — converge onto `apps/admin` over time
- Backend: `bnske.budgetndiostory.org` HTML at `/dashboard/*`, APIs at `/api/v1/*` (+ `/api/gamification/`, `/api/analytics/`, `/api/v2/budget/`)

**Golden rules**
1. Prefer `/api/v1` JSON over scraping HTML form POSTs.
2. If a feature is HTML-only in Django, add a DRF write API first, then wire Next.js.
3. Remove or hide sidebar items that are demo/mock until they are real.
4. Auth: Cookie/Bearer JWT + `IsOrgAdminOrManager` / `IsLeadershipOrDigitalTeam` as on Django.

---

## Phase 0 — Shell hygiene (do first)

- [x] **P0.1** Fix Overview redirect: was `/dashboard` → `/dashboard/default`; now reverse (demo → real overview).
- [x] **P0.2** Demo StudioKit `/dashboard/default` redirects to `/dashboard`.
- [x] **P0.3** Removed placeholder nav: Email + Live Chat iframes.
- [x] **P0.4** Unhide Content → Modules (`sidebarItems.filter(g => g.id !== 4)` removed).
- [x] **P0.5** Profile / privacy / security / org settings / partners nav restored once 1C pages shipped.
- [ ] **P0.6** Single source of truth for `admin-api.ts`.
- [x] **P0.7** Analytics: stop `Math.random()` fake charts (zeros until real series API is wired in 1A.2).

### Learn hub data integrity (related)

- [x] Remove hardcoded civic-module fallbacks ("Budget Basics", "Sector Deep Dive", "Citizen Engagement") — they were not API data; shown when `withFallback` swallowed API errors after login.
- [x] Module detail SEO: `generateMetadata` + Course JSON-LD on `/learn/modules/[slug]`.
- [x] Learn hub layout metadata + sitemap entries for `/learn/modules/{slug}`.

---

## Phase 1 — Already have JSON APIs (wire / harden Next.js)

### 1A. Dashboard & analytics
- [x] **1A.1** Overview KPIs from `GET /api/v1/analytics/dashboard/` (+ org widgets parity with Django `dashboard.html`).
- [x] **1A.2** Analytics page: replace `Math.random()` charts with real series; use `GET /api/v1/analytics/summary/`, module analytics, notes/forum aggregates.

### 1B. Users / team / invitations
- [x] **1B.1** Users list already hits `/users/` — audit create/update/deactivate parity with Django team POSTs.
  - List + search + role filter wired. Direct create/PATCH/DELETE on `/users/` do **not** exist (ListAPIView only).
  - Add members via invitations. Role change / deactivate / verify remain HTML-only → **Phase 2H**.
- [x] **1B.2** Invitations UI: `POST /api/v1/invitations/`, `GET /api/v1/invitations/list/`, `POST .../revoke/` — page + nav in `apps/admin`.
- [x] **1B.3** User stats: `GET /api/v1/users/stats/` surfaced on Users page (total, active 30d, joined 30d, role distribution).

### 1C. Profile / org settings
- [x] **1C.1** Profile: `GET/PATCH /api/v1/users/me/` (+ social links / avatar) — `/dashboard/profile`.
- [x] **1C.2** Org settings: `GET/PATCH /api/v1/org/config/` — `/dashboard/settings`.
- [x] **1C.3** Partners CRUD: list/create/PATCH `/api/v1/org/partners/` — `/dashboard/partners`. Hard DELETE is HTML-only (deactivate via `is_active` in Next.js).
- [x] **1C.4** Privacy / security: `GET /api/v1/privacy/config/`, `GET /api/v1/security/info/` + password change — `/dashboard/privacy`, `/dashboard/security`.

### 1D. Communication (claimed wired — audit for real CRUD/send)
- [x] **1D.1** Campaigns: list/create/edit/send/schedule/preview → `/api/v1/newsletter/campaigns/`.
- [x] **1D.2** Inbox notes/read → `/api/v1/newsletter/inbox/`.
- [x] **1D.3** Outbox dispatch/retry → `/api/v1/newsletter/outbox/`.
- [x] **1D.4** Contact messages reply/read/delete → `/api/v1/contact/messages/`.
- [x] **1D.5** Email hooks list/resend → `/api/v1/email-hooks/`.
- [x] **1D.6** Subscribers list → `/api/v1/newsletter/subscribers/` (add nav if missing).
- [x] **1D.7** Notifications / trigger-rules / audit-logs (Django `/dashboard/notifications/`) — add Next.js pages.

### 1E. Content (stories, knowledge, courses, media)
- [ ] **1E.1** Stories/articles admin CRUD + transition → `/api/v1/content/admin/articles|stories/`.
- [ ] **1E.2** Knowledge base CRUD → `/api/v1/content/admin/knowledge/`.
- [ ] **1E.3** Learning courses admin → `/api/v1/content/admin/courses/`.
- [ ] **1E.4** Media upload → `/api/v1/content/admin/media/upload/`.
- [ ] **1E.5** YouTube sync trigger → `/api/v1/content/sync/youtube/`.
- [ ] **1E.6** Authors — confirm full parity with `/api/v1/content/authors/`.
- [ ] **1E.7** Content feedback admin → `/api/v1/engagement/feedback/admin/`.

### 1F. Documents
- [ ] **1F.1** Doc repository files/folders/links (+ proxy) → `/api/v1/docrepository/*` — full Next.js admin UI.

### 1G. Forum / community (moderation)
- [ ] **1G.1** Thread list/detail using `/api/v1/engagement/forum-threads/`.
- [ ] **1G.2** Admin soft-delete / moderation (may need new API if only HTML today).

---

## Phase 2 — Partial in Django (add write APIs, then Next.js)

### 2A. Civic modules admin wizard
- [ ] **2A.1** Backend: admin write endpoints for civic modules / chapters / wizard (today mostly HTML).
- [ ] **2A.2** Next.js Modules page: full create/edit/delete/preview (not citizen-read-only).

### 2B. Surveys
- [ ] **2B.1** Backend: survey CRUD write API (create/edit HTML-only today).
- [ ] **2B.2** Next.js surveys list/form + results (`GET .../surveys/<id>/results/`).

### 2C. Trivia
- [ ] **2C.1** Backend: trivia builder write API.
- [ ] **2C.2** Next.js trivia CRUD + attempts inspector.

### 2D. Events
- [ ] **2D.1** Harden admin events API (galleries parity with HTML).
- [ ] **2D.2** Next.js events admin UI.

### 2E. TikTok / social
- [ ] **2E.1** Backend: TikTok admin write API (public read exists).
- [ ] **2E.2** Next.js social media hub + TikTok CRUD.

### 2F. KE Budget writes
- [ ] **2F.1** Backend: admin write for fiscal year / entity / allocation (reads on v1/v2 today).
- [ ] **2F.2** Next.js budget-data admin beyond read-only.

### 2G. Studio / project
- [ ] **2G.1** Backend: admin write for studio services/portfolio/testimonials/bookings status.
- [ ] **2G.2** Backend: project milestones/config write.
- [ ] **2G.3** Next.js studio + project admin pages.

### 2H. Team beyond list
- [ ] **2H.1** Role assign / deactivate / verify endpoints if missing from JSON; then Next.js.

---

## Phase 3 — HTML-only today (new APIs required)

- [ ] **3.1 Roles & permissions** — Django `roles.html` has no DRF API. Design `/api/v1/roles/` (or groups) then Next.js Roles UI.
- [ ] **3.2 Gamification admin** — rule/badge CRUD HTML-only; learner APIs exist. Add admin gamification APIs + Next.js page.
- [ ] **3.3 Invoices** — entire invoice HTML app has no DRF. Decide: port to API + Next.js, or drop from admin scope.
- [ ] **3.4 Engagements hub shell** — thin landing; rebuild as Next.js overview of surveys/trivia/events/forum once those ship.

---

## Phase 4 — Sidebar IA (proposed end state)

Keep:
1. **Dashboard** — Overview, Analytics  
2. **Tasks** — Overview, Board, Report *(DONE)*  
3. **People** — Users, Invitations, Authors, Profile  
4. **Content** — Modules, Stories, Knowledge, Courses, Media, Feedback  
5. **Engagement** — Surveys, Trivia, Events, Forum  
6. **Communication** — Campaigns, Inbox, Outbox, Contacts, Hooks, Subscribers, Notifications  
7. **Library** — Doc repository  
8. **Org** — Settings, Partners, Roles, Gamification, Studio, Budget  
9. **Account** — Privacy, Security  

Remove until real: Mail iframe, Live Chat, StudioKit demos, finance demos.

---

## Suggested implementation order

| Sprint | Focus | Why |
|--------|--------|-----|
| S0 | Phase 0 shell hygiene | Stops fake pages looking “broken” |
| S1 | 1A + 1C + 1B | Real home + identity |
| S2 | 1D audit + 1E content | Highest daily admin use after tasks |
| S3 | 1F docs + 1G forum | Ops completeness |
| S4 | Phase 2 write APIs (modules, surveys, trivia) | Unblocks learning/engagement admin |
| S5 | Phase 3 roles + gamification (+ invoices decision) | Parity with Django portal |

---

## Reference map (Django HTML → API)

| Django HTML | API surface | Next.js status |
|-------------|-------------|----------------|
| `/dashboard/weekly-notes/` | `/api/v1/notes/` (+ teams, publish, audit, exports) | **DONE** (Tasks) |
| `/dashboard/team/` | `/api/v1/users/`, `/api/v1/users/stats/`, invitations | **1B done** (list/stats/invite; role/deactivate → 2H) |
| `/dashboard/roles/` | — | Missing API |
| `/dashboard/settings/` | `/api/v1/org/config/`, partners | **DONE** (Settings + Partners) |
| /dashboard/newsletter/* | /api/v1/newsletter/*, contact, email-hooks, notifications, audit-logs | **1D done** (CRUD/send + subscribers/notifications/audit pages) |
| `/dashboard/stories|knowledge|learning/` | `/api/v1/content/admin/*` | Partial / missing UI |
| `/dashboard/civic-modules/` | Citizen read only; writes HTML | Needs admin write API |
| `/dashboard/surveys|trivia/` | Results/read; writes HTML | Needs write APIs |
| `/dashboard/docrepository/` | `/api/v1/docrepository/*` | Missing / partial UI |
| `/dashboard/gamification/` | Citizen gamification only | Needs admin APIs |
| `/dashboard/studio/` | Public read; admin write HTML | Needs admin write APIs |
| `/dashboard/invoices/` | — | HTML-only |
| `/dashboard/analytics/` | analytics summary/dashboard | Wired (1A — empty series labeled honestly) |

---

## Definition of done (per feature)

1. Sidebar item opens a real page (no catch-all / iframe / StudioKit).  
2. List + detail + mutations call Django JSON with correct auth.  
3. Error/empty/loading states handled.  
4. Parity checklist vs corresponding Django HTML view signed off.  
5. No silent fallback to mock numbers.
