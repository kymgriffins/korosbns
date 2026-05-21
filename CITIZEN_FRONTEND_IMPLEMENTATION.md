# Citizen Frontend — Implementation Task List

Actionable checklist for the public site at **https://budgetndiostory.org** consuming BNSKE REST APIs (not admin/staff workflows).

**Last updated:** 2026-05-20

**API base (production):** `https://bnske.budgetndiostory.org`  
**API prefix:** `/api/v1/`  
**Recommended stack (from repo docs):** Next.js + JWT + SWR or React Query (see [org/workflow.md](../org/workflow.md), [admin/templates-plan.md](../admin/templates-plan.md))

---

## Domain & environment model

| Role | Production URL | Notes |
|------|----------------|-------|
| Citizen frontend | `https://budgetndiostory.org` (and `https://www.budgetndiostory.org` if used) | Separate deploy from API |
| BNSKE API | `https://bnske.budgetndiostory.org` | Django/DRF; this repo |
| Staff portal | `https://bnske.budgetndiostory.org/` | Session HTML — **not** part of citizen app |

Backend email deep links use `FRONTEND_URL` (verify, reset, invite). Production must set `FRONTEND_URL=https://budgetndiostory.org` on the API host.

---

## Frontend environment variables

Create `.env.local` (Next.js) or equivalent:

| Variable | Example (production) | Purpose |
|----------|----------------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://bnske.budgetndiostory.org` | All `fetch`/client calls (no trailing slash) |
| `NEXT_PUBLIC_SITE_URL` | `https://budgetndiostory.org` | Canonical site URL, share links, sitemap |
| `NEXT_PUBLIC_DEFAULT_ORG_SLUG` | `bns-default` | Optional; API resolves default org today without client slug |

**Local development**

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://127.0.0.1:8000` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |

**Auth storage:** Persist `access` and `refresh` from login; attach `Authorization: Bearer <access>` to protected routes. Refresh via `POST /api/v1/auth/token/refresh/` before expiry (access ~60 min, refresh ~7 days).

**CORS:** Browser calls from `budgetndiostory.org` → `bnske.budgetndiostory.org` require API `CORS_ALLOWED_ORIGINS` (see [productionguide.md](../prod/productionguide.md)). Use `credentials: 'include'` only if you rely on anonymous survey sessions (see Phase 5 note).

**OpenAPI:** `GET {{API}}/api/docs/` and `GET {{API}}/api/schema/` for contract discovery.

---

## Out of scope (citizen app)

Do **not** implement these in the public frontend (staff/admin only):

| Area | Endpoints | Use instead |
|------|-----------|-------------|
| Django staff portal | `/`, `/dashboard/*` | Staff browser login on API host |
| Org write | `PATCH /api/v1/org/config/`, partner CRUD | Admin portal / Postman |
| Content editorial | `/api/v1/content/admin/*`, `sync/youtube`, `transcripts/upload` | Staff portal / Django admin |
| Survey results / CSV | `GET .../surveys/<id>/results/` | Manager on API host |
| Newsletter subscriber list | `GET /api/v1/newsletter/subscribers/` | Admin/manager |
| Team invitations (create/list/revoke) | `POST/GET /api/v1/invitations/*` | Staff workflows |

**In scope for citizens:** accept invitation (`POST /api/v1/invitations/accept/`) when user receives email link.

Engagement staff endpoints (survey results/CSV, trivia builder, notification admin) live on the API host staff portal — not in this list.

---

## Authentication model (citizen frontend)

Three layers — do not mix them in one “engagement” UI flow without checking auth per endpoint.

| Layer | Who | JWT | Extra |
|-------|-----|-----|-------|
| **Anonymous** | Visitor, no account | Not sent | Survey submit may need Django session cookie when `allow_anonymous=true` (see Phase 6A) |
| **Authenticated citizen** | Verified user with login | `Authorization: Bearer <access>` | Trivia attempts and bookmarks also require **active org membership** (403 without it) |
| **Staff / admin** | Manager on API host | Session or staff JWT | Survey results, editorial tools — **out of scope** below |

**Engagement types in this repo:** There is no separate `/polls/` or `/quizzes/` REST surface. **Surveys** cover polls/questionnaires; **trivia** is the citizen-facing quiz API (admin UI may say “quiz”). Both are under `/api/v1/engagement/`.

**Not everything is anonymous:** Trivia **play** (submit answers), bookmarks, and notification history always require a logged-in citizen. Surveys are **read** anonymously; **submit** is anonymous only when the survey’s `allow_anonymous` flag is true (default `true` in the model).

---

## API surface summary (citizen)

### Anonymous — no JWT

| Method | Path | Cache (typical) | Notes |
|--------|------|-----------------|-------|
| GET | `/api/v1/org/config/` | `max-age=86400` | |
| POST | `/api/v1/newsletter/subscribe/` | — | |
| POST | `/api/v1/auth/register/` | — | throttled |
| POST | `/api/v1/auth/verify/` | — | throttled |
| POST | `/api/v1/auth/login/` | — | throttled |
| POST | `/api/v1/auth/token/refresh/` | — | body: `{ "refresh": "..." }` |
| POST | `/api/v1/auth/password-reset/request/` | — | throttled |
| POST | `/api/v1/auth/password-reset/confirm/` | — | throttled |
| POST | `/api/v1/invitations/accept/` | — | |
| GET | `/api/v1/users/<uuid>/public/` | — | 404 when profile private |
| GET | `/api/v1/content/knowledge/` | `max-age=86400` | |
| GET | `/api/v1/content/knowledge/<uuid>/` | `max-age=86400` | |
| GET | `/api/v1/content/articles/` | `max-age=86400` | |
| GET | `/api/v1/content/articles/<slug>/` | `max-age=86400` | |
| GET | `/api/v1/content/stories/` | `max-age=86400` | |
| GET | `/api/v1/content/events/` | `max-age=86400` | |
| GET | `/api/v1/content/events/<uuid>/` | `max-age=86400` | |
| GET | `/api/v1/engagement/surveys/` | `max-age=300` | active surveys only |
| GET | `/api/v1/engagement/surveys/<uuid>/` | `max-age=300` | |
| POST | `/api/v1/engagement/surveys/<uuid>/submit/` | — | DRF `AllowAny`; **401 if** survey `allow_anonymous=false` and no JWT |
| GET | `/api/v1/engagement/trivia/` | `max-age=300` | published only |
| GET | `/api/v1/engagement/trivia/<uuid>/` | `max-age=300` | answers hidden |
| GET | `/api/v1/engagement/trivia/<uuid>/leaderboard/` | `max-age=300` | opt-in rows only |
| POST | `/api/v1/engagement/share/` | — | JWT optional (attribution) |

### Authenticated citizen — JWT required

| Method | Path | DRF permission | Extra requirement |
|--------|------|----------------|-------------------|
| POST | `/api/v1/auth/logout/` | `IsAuthenticated` | body: `{ "refresh": "<token>" }` |
| GET/PATCH | `/api/v1/users/me/` | `IsAuthenticated` | verified active user |
| GET/POST/PATCH/DELETE | `/api/v1/users/me/social-links/` | `IsAuthenticated` | — |
| POST | `/api/v1/engagement/surveys/<uuid>/submit/` | `AllowAny` | Use when `allow_anonymous=false` (logged-in submit) |
| POST | `/api/v1/engagement/trivia/<uuid>/attempt/` | `IsAuthenticated` | **Active org membership** (403 otherwise) |
| GET/POST | `/api/v1/engagement/bookmarks/` | `IsAuthenticated` | **Active org membership** |
| GET | `/api/v1/engagement/notifications/` | `IsAuthenticated` | Own queue only; no membership gate in view |

### Engagement API — auth matrix (source: `engagement/views/api.py`)

| Endpoint | Method | DRF class | Citizen can call? | Business rule |
|----------|--------|-----------|-------------------|---------------|
| `/engagement/surveys/` | GET | `AllowAny` | Yes | — |
| `/engagement/surveys/<id>/` | GET | `AllowAny` | Yes | ACTIVE + in window |
| `/engagement/surveys/<id>/submit/` | POST | `AllowAny` | Yes if anonymous allowed | **401** without JWT when `allow_anonymous=false`; anonymous uses **session** for duplicate prevention |
| `/engagement/surveys/<id>/results/` | GET | `IsAuthenticated` + manager/admin | **No** | Staff only |
| `/engagement/trivia/` | GET | `AllowAny` | Yes | — |
| `/engagement/trivia/<id>/` | GET | `AllowAny` | Yes | — |
| `/engagement/trivia/<id>/attempt/` | POST | `IsAuthenticated` | **No without JWT** | **403** without active org membership |
| `/engagement/trivia/<id>/leaderboard/` | GET | `AllowAny` | Yes | — |
| `/engagement/bookmarks/` | GET/POST | `IsAuthenticated` | **No without JWT** | **403** without active org membership |
| `/engagement/share/` | POST | `AllowAny` | Yes | `user` set when JWT present |
| `/engagement/notifications/` | GET | `IsAuthenticated` | **No without JWT** | Filtered to `target_user=request.user` |

---

## Phase 0 — Project setup & API client

| ID | Task | Acceptance criteria |
|----|------|---------------------|
| 0-1 | Scaffold app (Next.js App Router recommended per staff docs) | Builds; env vars loaded |
| 0-2 | `apiClient` with base URL from `NEXT_PUBLIC_API_BASE_URL` | All paths under `/api/v1/` |
| 0-3 | JWT helper: store access/refresh; attach Bearer header; refresh on 401 | Login + refresh flow works against prod or local API |
| 0-4 | Error + throttle handling (429/401/403) | User-safe messages; no token leakage in UI |
| 0-5 | Import Postman collection + Production env for manual QA | [postman/README.md](../../postman/README.md) |
| 0-6 | Optional: generate types from `GET /api/schema/` | Speeds parallel development |

---

## Phase 1 — App shell, layout & org config

Single source of truth: `GET /api/v1/org/config/` (AllowAny).

| ID | Task | Endpoint | Auth | Acceptance criteria |
|----|------|----------|------|---------------------|
| 1-1 | Fetch org config on app load (SWR/React Query, 24h dedupe) | `GET /api/v1/org/config/` | None | Footer, contact, SEO meta populated |
| 1-2 | Apply `seo.title`, `seo.description`, `og_image`, `favicon` | — | — | SSR/SSG or `useEffect` meta tags |
| 1-3 | Header/footer: `tagline`, `socials`, `layout.footer_note` | — | — | Matches API order; external links open in new tab |
| 1-4 | About section: `mission`, `vision`, `values` | — | — | Renders when fields non-empty |
| 1-5 | Partner carousel when `layout.show_partner_carousel` | — | — | Hidden when false; partner tier/order respected |
| 1-6 | Newsletter CTA visibility | — | — | Signup block only if `layout.show_newsletter_signup` |
| 1-7 | localStorage fallback if config fetch fails | — | — | Degraded mode per [org/userstories.md](../org/userstories.md) US-5.2 |

---

## Phase 2 — Authentication & account lifecycle

| ID | Task | Method | Path | Auth | Acceptance criteria |
|----|------|--------|------|------|---------------------|
| 2-1 | Registration form | POST | `/api/v1/auth/register/` | None | 201 + message; body: `email`, `password`, optional `first_name`, `last_name` |
| 2-2 | Email verification page | POST | `/api/v1/auth/verify/` | None | Reads `?token=` from email link (`/auth/verify/` on frontend); 200 activates account |
| 2-3 | Login | POST | `/api/v1/auth/login/` | None | Stores JWT; rejects unverified users (401) |
| 2-4 | Logout | POST | `/api/v1/auth/logout/` | JWT | Sends refresh in body; clears client tokens |
| 2-5 | Token refresh | POST | `/api/v1/auth/token/refresh/` | refresh body | Seamless session extension |
| 2-6 | Password reset request | POST | `/api/v1/auth/password-reset/request/` | None | Always shows neutral success copy |
| 2-7 | Password reset confirm | POST | `/api/v1/auth/password-reset/confirm/` | None | Page `/auth/reset/?token=`; `token` + `password` |
| 2-8 | Invite accept flow | POST | `/api/v1/invitations/accept/` | Optional JWT | Handles `accepted` and `requires_registration` → register + verify → re-accept |
| 2-9 | Route guards | — | — | — | Protected pages require verified JWT |

**Email link routes (must exist on frontend):**

| Backend setting path | Frontend route |
|---------------------|----------------|
| `{FRONTEND_URL}/auth/verify/?token=` | `/auth/verify` |
| `{FRONTEND_URL}/auth/reset/?token=` | `/auth/reset` |
| `{FRONTEND_URL}/invite/?token=` | `/invite` |

---

## Phase 3 — User profile & preferences

| ID | Task | Method | Path | Auth | Acceptance criteria |
|----|------|--------|------|------|---------------------|
| 3-1 | Profile settings page | GET/PATCH | `/api/v1/users/me/` | JWT | Edit `display_name`, `bio`, `avatar_url`, names, visibility |
| 3-2 | Notification preferences | PATCH | `/api/v1/users/me/` | JWT | `event_toggles`, `digest_frequency` persisted |
| 3-3 | Privacy controls | PATCH | `/api/v1/users/me/` | JWT | `profile_visibility`, `allow_discovery`, `show_email_publicly` |
| 3-4 | Social links CRUD | GET/POST/PATCH/DELETE | `/api/v1/users/me/social-links/` | JWT | Platform + URL + visibility |
| 3-5 | Public profile page | GET | `/api/v1/users/<uuid>/public/` | Optional | 404 when private; respect visibility enum |

---

## Phase 4 — Content (knowledge, articles, stories, events)

All public reads; published content only.

| ID | Task | Method | Path | Auth | Acceptance criteria |
|----|------|--------|------|------|---------------------|
| 4-1 | Knowledge hub / list | GET | `/api/v1/content/knowledge/` | None | List renders; honor cache headers |
| 4-2 | Knowledge detail | GET | `/api/v1/content/knowledge/<uuid>/` | None | 404 handling |
| 4-3 | Articles index | GET | `/api/v1/content/articles/` | None | Cards link to slug routes |
| 4-4 | Article reader | GET | `/api/v1/content/articles/<slug>/` | None | SEO-friendly URL; share hooks |
| 4-5 | Stories feed (swipe UI) | GET | `/api/v1/content/stories/` | None | Card/swipe pattern per [content/overview.md](../content/overview.md) |
| 4-6 | Events list | GET | `/api/v1/content/events/` | None | Sorted by `starts_at` from payload |
| 4-7 | Event detail + galleries | GET | `/api/v1/content/events/<uuid>/` | None | External gallery URLs only (no uploads) |
| 4-8 | Tag/filter UX (client-side) | — | — | — | Filter list payloads if tags present in JSON |
| 4-9 | Share integration | POST | `/api/v1/engagement/share/` | None (JWT optional) | `content_type`: `knowledge` \| `article` \| `event`; channel enum; works logged out |

---

## Phase 5 — Newsletter

| ID | Task | Method | Path | Auth | Acceptance criteria |
|----|------|--------|------|------|---------------------|
| 5-1 | Subscribe form | POST | `/api/v1/newsletter/subscribe/` | None | Body: `email`, optional `name`, `source`; 201 or 200 idempotent |
| 5-2 | Respect org toggle | — | — | — | Hide form when config `show_newsletter_signup` false |
| 5-3 | Handle disabled API | — | — | — | 403 → friendly “signup unavailable” |

---

## Phase 6A — Engagement (anonymous / no account)

Browse and submit without login where the API allows it. Do **not** call trivia `attempt/` or bookmarks here.

| ID | Task | Method | Path | Auth | Acceptance criteria |
|----|------|--------|------|------|---------------------|
| 6A-1 | Survey list | GET | `/api/v1/engagement/surveys/` | None | Active surveys only |
| 6A-2 | Survey detail + form | GET | `/api/v1/engagement/surveys/<uuid>/` | None | Read `allow_anonymous` from payload; show login CTA when false |
| 6A-3 | Survey submit (anonymous) | POST | `/api/v1/engagement/surveys/<uuid>/submit/` | None + session | Only when `allow_anonymous=true`; body `{ "answers": { "<question_id>": <value> } }`; 201 with `response_id` |
| 6A-4 | Cross-origin session | — | — | `credentials: 'include'` | Required for anonymous duplicate prevention; confirm API `CORS` + cookie settings |
| 6A-5 | Trivia browse | GET | `/api/v1/engagement/trivia/`, `.../<uuid>/` | None | No answers in detail; “Sign in to play” for attempt |
| 6A-6 | Leaderboard (read-only) | GET | `/api/v1/engagement/trivia/<uuid>/leaderboard/` | None | Opt-in rows only |

## Phase 6B — Engagement (authenticated citizen)

Requires verified JWT from Phase 2. Trivia play and bookmarks also require **active org membership** (register + verify + default org membership).

| ID | Task | Method | Path | Auth | Acceptance criteria |
|----|------|--------|------|------|---------------------|
| 6B-1 | Survey submit (logged-in) | POST | `/api/v1/engagement/surveys/<uuid>/submit/` | JWT | Required when `allow_anonymous=false`; optional when true (attributes response to user) |
| 6B-2 | Trivia attempt | POST | `/api/v1/engagement/trivia/<uuid>/attempt/` | JWT + membership | Body: `answers`, optional `leaderboard_opt_in`; 401 without JWT, 403 without membership |
| 6B-3 | Bookmarks page | GET/POST | `/api/v1/engagement/bookmarks/` | JWT + membership | Toggle by `content_type` + `content_id` |
| 6B-4 | Notification history | GET | `/api/v1/engagement/notifications/` | JWT | Paginated; optional `?status=` filter |

---

## Phase 7 — Cross-cutting UX & production readiness

| ID | Task | Acceptance criteria |
|----|------|---------------------|
| 7-1 | Loading/error/empty states on all feeds | No silent failures |
| 7-2 | Respect `Cache-Control` (CDN/browser); revalidate on focus optional | Performance on repeat visits |
| 7-3 | Accessibility: forms, carousel, story swipe | WCAG-oriented baseline |
| 7-4 | E2E smoke: anonymous survey (if allowed) → register → verify → login → trivia attempt → bookmark | Against staging or prod API |
| 7-5 | Deploy frontend to `budgetndiostory.org`; API `FRONTEND_URL` + CORS updated | Email links land on production frontend |
| 7-6 | Security review: tokens in memory/httpOnly strategy; no secrets in client | Only `NEXT_PUBLIC_*` exposed |

---

## Suggested page map (frontend-owned routing)

Backend does not define page URLs. Suggested routes:

| Route | Phase | Data source |
|-------|-------|-------------|
| `/` | 1, 4 | org config + featured content |
| `/about` | 1 | org config |
| `/knowledge`, `/knowledge/[id]` | 4 | content API |
| `/articles`, `/articles/[slug]` | 4 | content API |
| `/stories` | 4 | content API |
| `/events`, `/events/[id]` | 4 | content API |
| `/surveys`, `/surveys/[id]` | 6A–6B | engagement API (submit auth per `allow_anonymous`) |
| `/trivia`, `/trivia/[id]` | 6A browse, 6B play | engagement API |
| `/auth/login`, `/auth/register`, `/auth/verify`, `/auth/reset` | 2 | auth API |
| `/invite` | 2 | invitations API |
| `/account`, `/account/notifications` | 3, 6B | users + engagement API |
| `/users/[id]` | 3 | public profile API |

---

## Backend coordination checklist (before go-live)

- [ ] API production: `FRONTEND_URL=https://budgetndiostory.org`, `FRONTEND_BASE_URL` same if using share UTM base
- [ ] `CORS_ALLOWED_ORIGINS` includes `https://budgetndiostory.org` and `https://www.budgetndiostory.org`
- [ ] `CSRF_TRUSTED_ORIGINS` includes frontend origins (for any cookie-based flows)
- [ ] Postman: add Newsletter folder (optional); regenerate with `python postman/gen_collection.py`
- [ ] Smoke: `curl https://bnske.budgetndiostory.org/api/v1/org/config/`

---

## References

- Postman: [../../postman/BNSKE-API.postman_collection.json](../../postman/BNSKE-API.postman_collection.json)
- Org config spec: [../org/configspec.md](../org/configspec.md)
- Auth workflows: [../usermanagent/workflows.md](../usermanagent/workflows.md)
- Engagement contexts: [../engagements/contexts/](../engagements/contexts/)
- Engagement DRF views: `engagement/views/api.py` (permission source of truth)
- Production: [../prod/productionguide.md](../prod/productionguide.md)
