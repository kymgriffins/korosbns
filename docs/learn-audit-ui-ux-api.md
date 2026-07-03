# `/learn` UI/UX audit — sections, API calls, and improvement map

**Subject:** Kenya civic budget literacy — Finance Bill, BPS/BROP, public participation.  
**Audience:** Citizens and advocates, often mobile, 5–20 minute sessions.  
**Job per session:** Advance one clear learning step — not browse a generic dashboard.

**Base API prefix:** `/api/v1/` (via `apiFetch` in `src/lib/api-client.ts`, proxied in production).  
**Fallback pattern:** Most learn data layers use `withFallback()` in `src/data/*` — on API failure, in-memory seed data is returned so the UI still renders.

---

## Executive summary

`/learn` has strong content and gamification plumbing, but the experience is **fragmented**. It reads as three products stitched together:

1. **Admin-style hub** — `LearnHubLayout` (desktop sidebar + mobile bottom nav)
2. **Marketing content grid** — `LearnTabPage` (list + right sidebar)
3. **Immersive module reader** — `ModuleDetailView` / `StageDetailDrawer`

A cohesive revamp should unify around **one centered “learning stage”** (`--learn-stage-width: 42rem`), **one module reader**, and **one gamification vocabulary** (Sovereigns / SVG).

| Priority | Theme |
|----------|--------|
| **P0** | Single `LearnStage` layout; merge drawer + route reader; one nav model; canonical gamification labels |
| **P1** | Chamber hero (resume-first); global progress rail; unified motion + `prefers-reduced-motion`; drop duplicate right sidebar |
| **P2** | Typography scale; badge/seal system; profile as citizen dossier; budget-themed empty states |
| **P3** | Step-complete stamp animation; restrained delight |

**Implementation note:** Branch `skilledlearnhub` (`c8b38bfc`) implements P0/P1 foundations (`LearnStage`, `LearnChamberHero`, `LearnPathSpine`, drawer removal from hub, gamification constants). Not yet merged to `main` at time of writing.

---

## Global shell (every `/learn` route)

### UI / UX (current)

| Element | Component | Behavior |
|---------|-----------|----------|
| Desktop nav | `LearnHubLayout` → `LearnSidebar` | Admin-style `Sidebar` (`variant="inset"`, collapsible icon rail). Tabs: Dashboard, Modules, Documents, Profile, Forums. Nested civic module links. |
| Mobile nav | `LearnMobileNav` | Bottom tab bar; competes with `pb-24` content padding |
| Tab sync | `LearnTabSync` + `learn-nav.ts` | Hub tabs map to routes (`?tab=modules`, `/learn/forum`, `/learn/documents`, etc.) |
| Context | `LearnProvider` (`learn-context.tsx`) | Shared: `activeTab`, `civicModules`, `gamification`, `activeLesson`, drawer state |
| Width tokens | Various | `max-w-6xl` (dashboard, lists), `max-w-3xl` (profile, module), `max-w-4xl` (documents) — **not optically centered** because content sits beside the left rail |

### Audit issues (global)

- **Triple navigation:** hub query tabs, standalone routes, deep links (`/learn/modules/[slug]`, `/learn/[slug]`)
- **Sidebar is menu-first**, not progress-first
- **Gamification label drift:** XP, points, sovereigns, level used interchangeably
- **Motion inconsistent:** stagger on dashboard; static forum/module pages; reduced-motion not global

### API calls (global / layout)

| When | Method | Endpoint | Auth | Adapter / hook |
|------|--------|----------|------|----------------|
| App load (logged in) | GET | `/gamification/me/` | Yes | `LearnProvider` → `fetchGamificationMe()` |
| App load | GET | `/content/civic-modules/` | No | `LearnProvider` → `learningData.modules.fetch()` |
| Sidebar feed | GET | `/content/events/` | No | `loadEventList()` → `citizenApi.getEvents()` |
| Sidebar feed | GET | `/engagement/surveys/` | No | `loadSurveyList()` → `citizenApi.getSurveys()` |
| Profile update event | — | (invalidates queries) | — | `refreshGamification()` on `bns-profile-updated` |

**Fallback modules** (when API fails): `DEFAULT_MODULES` in `src/data/learning.ts` — Budget Basics (`BB`), Sector Deep Dive (`SD`), Citizen Engagement (`CE`).

---

## Section 1 — Dashboard (`/learn`, tab `home`)

### UI / UX (current)

| Piece | Component | Pattern |
|-------|-----------|---------|
| Page | `learn/page.tsx` → `LearnPathsHome` → `LearnDashboardView` | Dense widget grid: hero card (avatar, XP bar, streak), stats, module strip, leaderboard, daily quests, published tasks |
| Layout | `max-w-6xl` | Motion: `motion/react` stagger on enter |
| Module open | `onSelectStage` → `StageDetailDrawer` | **Drawer overlay** on home tab (duplicate of module route) |
| Continue CTA | Links to `/learn/modules/[slug]` | Conflicts with drawer path |

### Audit findings

- Too many equal-weight sections; no single “resume” thesis
- Duolingo-clone hero (primary-filled card + XP bar)
- `pb-24` + bottom nav + sidebar = cramped mobile vertical space
- Drawer vs route = two module experiences

### Recommended revamp

- **Chamber hero:** “Continue Step N of Finance Bill 2026” as primary CTA
- Secondary: streak + rank only; leaderboard/quests behind tabs or horizontal swipe
- **Deprecate drawer**; route all module opens to `/learn/modules/[slug]?step=n`

### API calls

| Data | Method | Endpoint | Auth | Source in UI |
|------|--------|----------|------|--------------|
| Gamification (XP, level, streak, badges, recent progress) | GET | `/gamification/me/` | Yes | `useGamificationMe()` |
| Civic modules list | GET | `/content/civic-modules/` | No | `useLearn().civicModules` (context) |
| Leaderboard | GET | `/gamification/leaderboard/?limit=20` | No | `useLeaderboard()` in `LearnPathsHome` |
| Daily quests (top 3) | GET | `/content/learn/quests/` | No | `useDailyQuests()` → `contentData.quests.fetch()` → `learnHubApi.quests()` |
| Published citizen tasks | GET | `/notes/` | Yes | `taskData.tasks.fetch()` → filter `status=published` |
| Module progress | — | **localStorage** | — | `readProgress(slug)` in `src/lib/module-progress.ts` (not server-synced on dashboard) |
| User profile chrome | — | **localStorage** | — | `bns_user_profile`, `bns_onboarding_profile` |

---

## Section 2 — Modules list (`/learn?tab=modules`)

### UI / UX (current)

| Piece | Component | Pattern |
|-------|-----------|---------|
| View | `LearnModulesView` | App header, search/filter, `StageCard` grid |
| Navigation | Card click → `router.push(/learn/modules/[slug])` | Course-catalog feel |
| Layout | `max-w-6xl` | Numeric stage circles on cards |

### Audit findings

- Reads as **course catalog**, not fiscal **path** (BPS → BROP → Finance Bill)
- No shared centered stage wrapper
- Stage order circles don’t match “document types” metaphor

### Recommended revamp

- **Roadmap spine** (`LearnPathSpine` on `skilledlearnhub`): horizontal/vertical path with lock/completion
- Card click → single `LearnStage` reader only

### API calls

| Data | Method | Endpoint | Auth | Source |
|------|--------|----------|------|--------|
| Module list | GET | `/content/civic-modules/` | No | `useLearn().civicModules` |
| Module detail (on navigate) | GET | `/content/civic-modules/{slug}/` | No | `learningData.modules.fetchBySlug(slug)` |
| Refresh | — | Re-fetch modules | No | `refreshModules()` |

---

## Section 3 — Module reader (`/learn/modules/[slug]`)

### UI / UX (current)

| Piece | Component | Pattern |
|-------|-----------|---------|
| Page | `modules/[slug]/page.tsx` → `ModuleDetailView` | Collapses hub sidebar; `max-w-3xl` column |
| Tabs | read / watch / quiz | `ChapterStep` content, YouTube embeds, `TriviaSection` |
| Progress | localStorage + API | `readProgress` / `writeProgress` per slug |
| Chrome | Breadcrumb back to `/learn` | Card/Separator heavy — breaks immersion |

### Parallel: `StageDetailDrawer` (home tab only)

Same flows duplicated in `stage-detail-drawer.tsx` — opens from dashboard `onSelectStage`, full-screen on mobile, fights bottom nav scroll.

### Audit findings

- Strongest reader UX but **orphaned** from hub visual system
- No step-change choreography; reduced motion not wired
- Quiz completion: multiple toasts vs one celebration beat
- **Two implementations** to maintain (drawer + route)

### Recommended revamp

- Full-viewport centered stage; hub chrome → progress breadcrumb + XP chip only
- Step transition = document page-turn animation
- Single reader; drawer deprecated

### API calls

| Action | Method | Endpoint | Auth | When |
|--------|--------|----------|------|------|
| Load module | GET | `/content/civic-modules/{slug}/` | No | Page mount |
| Mark progress | POST | `/content/learn/progress/` | Yes | Step/module completion |
| Complete chapter | POST | `/content/civic-chapters/{chapterId}/complete/` | Yes | Chapter done |
| Trivia submit (legacy path) | POST | `/gamification/trivia-answers/` | Yes | Some trivia flows in drawer/detail |
| Trivia attempt (hub API) | POST | `/engagement/trivia/{id}/attempt/` | Yes | `learnHubApi.submitTriviaAttempt()` |
| Certificate | — | Returned in `completeChapter` response | Yes | `certificate_id` on module complete |
| Analytics | POST | `/analytics/events/` | No | `trackAnalytics()` (where wired) |
| Feedback / rating | POST | `/engagement/feedback/` | Varies | `star-rating.tsx`, `rating-section.tsx` |

**Body example — mark progress:**
```json
{ "content_type": "path", "content_id": "<module-uuid>", "progress_percent": 100 }
```

**Local-only:** Step index and per-step completion flags in `localStorage` until synced via progress/chapter endpoints.

---

## Section 4 — Forum (`/learn/forum`)

### UI / UX (current)

| Piece | Component | Pattern |
|-------|-----------|---------|
| Page | `forum/page.tsx` → `ForumView` | `text-lg font-black` header; thread list + search |
| Detail | `ForumThreadDetail` | In-place swap (no route change) |
| Auth gate | “Sign in to post” → login | `CreateThreadDialog` when logged in |
| Layout | Full content column width | Different typography from dashboard |

### Audit findings

- Visual dialect unlike dashboard
- No gamification tie-in (XP for posts, civic badges)
- Not centered to stage width

### Recommended revamp

- Same `LearnStage` width; “Ask about the budget” copy
- Thread detail = breadcrumb focus pattern
- Optional: award sovereigns on quality posts via `/gamification/events/`

### API calls

| Action | Method | Endpoint | Auth | Hook / adapter |
|--------|--------|----------|------|----------------|
| List threads | GET | `/engagement/forum-threads/` | No | `useForumThreads()` |
| List by chapter | GET | `/engagement/forum-threads/?chapter_id={id}` | No | `useForumThreads({ chapterId })` |
| Thread detail | GET | `/engagement/forum-threads/{id}/` | No | `useForumThread(id)` |
| Create thread | POST | `/engagement/forum-threads/` | Yes | `useCreateForumThread()` |
| Create post | POST | `/engagement/forum-threads/{id}/posts/` | Yes | `useCreateForumPost()` |
| Refresh | — | React Query invalidate `["forum"]` | — | Manual refresh button |

---

## Section 5 — Documents

### Two surfaces

#### A. Hub tab (`/learn/documents` route + `documents` tab)

| Piece | Component | Pattern |
|-------|-----------|---------|
| Hub inline | `LearnDocumentsView` | Rich browser: folders, filters, card/table view, county/year heuristics |
| Standalone | `documents/page.tsx` may use `LearnTabPage` | List grid + right `LearnSidebar` |

#### B. Document repository (primary data for `LearnDocumentsView`)

| Piece | Source | Pattern |
|-------|--------|---------|
| Files | `useLearnDocuments()` | Recursive crawl of doc repository API |
| Endpoints tried | `/api/docrepository/`, Django fallbacks | See `constants/documents.ts` |

### Audit findings

- **Third layout family** when using `LearnTabPage` (grid + right sidebar)
- Sidebar duplicates hub navigation
- Documents feel disconnected from learning path

### Recommended revamp

- Single content lane inside hub; no second sidebar
- Link documents to module prerequisites / FY context

### API calls

| Data | Method | Endpoint | Auth | Source |
|------|--------|----------|------|--------|
| Repository tree | GET | `/api/docrepository/` (Next proxy) or `{API_BASE}/docrepository/` | No | `fetchDocumentsFromAPI()` |
| Subfolder | GET | `/api/docrepository?path={encoded}` | No | Recursive in `documents.ts` |
| Symlink view | GET | `/api/docrepository/link/{id}?mode=view` | No | Link items |
| Symlink download | GET | `/api/docrepository/link/{id}?mode=download` | No | Link items |
| Learn hub document list | GET | `/content/learn/documents/` | No | `LearnTabPage` listKey `documents` |
| Hub summary / trending | GET | `/content/learn/` | No | `useLearnSummary()` |

---

## Section 6 — Articles (`/learn/articles`)

### UI / UX (current)

| Piece | Component | Pattern |
|-------|-----------|---------|
| List | `LearnTabPage` (`listKey: articles`) | `max-w-6xl` + `LearnSidebar` (trending, daily quest) |
| Reader | `/learn/[slug]` → `client-page.tsx` | Resolves article, trivia, or story by slug |

### Audit findings

- Marketing list pattern, not path-integrated
- Right sidebar redundant with hub nav

### API calls

| Action | Method | Endpoint | Auth | Source |
|--------|--------|----------|------|--------|
| List articles | GET | `/content/learn/articles/` | No | `contentData.articles.fetch()` |
| Article by slug | GET | `/content/articles/{slug}/` (citizen API) | No | `contentData.articles.fetchBySlug()` |
| Hub summary | GET | `/content/learn/` | No | `useLearnSummary()` |
| Page view analytics | POST | `/analytics/events/` | No | `trackAnalytics("learn_list_view", { tab })` |

---

## Section 7 — Videos (`/learn/videos`)

### UI / UX (current)

`LearnTabPage` with `listKey: videos` — same grid + sidebar layout as articles.

### API calls

| Action | Method | Endpoint | Auth | Source |
|--------|--------|----------|------|--------|
| List videos | GET | `/content/learn/videos/` | No | `videoData.fetch()` → `learnHubApi.videos()` |
| Fallback | — | `DEFAULT_VIDEOS` in `data/videos.ts` | — | YouTube IDs seeded locally |

---

## Section 8 — Stories (`/learn/stories`)

### UI / UX (current)

`LearnTabPage` with `listKey: stories`.

### API calls

| Action | Method | Endpoint | Auth | Source |
|--------|--------|----------|------|--------|
| List stories | GET | `/content/learn/stories/` | No | `contentData.stories.fetch()` |
| Story by slug | GET | `/content/stories/` (list scan) | No | `contentData.stories.fetchBySlug()` |

---

## Section 9 — Quests (`/learn/quests`)

### UI / UX (current)

| Piece | Component | Pattern |
|-------|-----------|---------|
| Page | `quests/page.tsx` + `quests-protected-gate` | May require auth |
| List | `LearnTabPage` `listKey: quests` | Marketing-style cards |
| Dashboard | `useDailyQuests()` | Top 3 “daily” quests on home |

### Audit findings

- Quest cards don’t show prerequisite module or XP reward clearly
- Feels bolted on vs learning path

### API calls

| Action | Method | Endpoint | Auth | Source |
|--------|--------|----------|------|--------|
| List quests | GET | `/content/learn/quests/` | No | `contentData.quests.fetch()` |
| Daily subset | — | Client filter `daily !== false`, slice(0,3) | — | `useDailyQuests()` |

---

## Section 10 — Alerts (`/learn?tab=alerts`)

### UI / UX (current)

| Piece | Component | Pattern |
|-------|-----------|---------|
| View | `AlertsView` | `max-w-3xl`; “Participation Alerts” header |
| Content | Recent activity cards from gamification | Icons by `content_type` |

### Audit findings

- Copy promises “hyper-local county alerts” but UI mostly shows **recent progress**, not geo alerts
- `profile` prop passed but underused for county matching

### API calls

| Data | Method | Endpoint | Auth | Source |
|------|--------|----------|------|--------|
| Recent progress | GET | `/gamification/me/` | Yes | `useGamificationMe()` → `recent_progress[]` |
| Refresh | — | Invalidate `["gamification", "me"]` | — | Refresh button |

**Gap:** No dedicated alerts/notifications API — county/document alerts are aspirational in copy.

---

## Section 11 — Profile (`/learn?tab=profile` + `/learn/profile`)

### UI / UX (current)

| Piece | Component | Pattern |
|-------|-----------|---------|
| Hub tab | `ProfileView` | `max-w-3xl`; Bitmoji avatar, badges, certificates, settings inline |
| Standalone | `profile/page.tsx` | Also loads `learningData.profile.fetch()` |
| Account subroutes | `/learn/account/*` | Separate `ContentLayout` settings app (password, notifications, sign-out) |

### Audit findings

- Stats-heavy, light on **story** (which Finance Bill step earned each badge)
- Account pages feel like generic settings, not learn identity
- Profile should be **citizen dossier**: seals on a document, completion timeline

### API calls

| Action | Method | Endpoint | Auth | Source |
|--------|--------|----------|------|--------|
| Gamification profile | GET | `/gamification/me/` | Yes | `useGamificationMe()` |
| Learn profile aggregate | GET | `/content/learn/profile/` | Yes | `learningData.profile.fetch()` |
| Badge catalog | GET | `/gamification/badges/` | No* | `useBadgeCatalog()` |
| Certificates | GET | `/gamification/certificates/` | Yes | `useCertificates()` |
| Issue certificate | POST | `/gamification/certificates/issue/` | Yes | `useIssueCertificate()` |
| Update profile | PATCH | `/users/me/` (via profile hooks) | Yes | `useUpdateProfile()` |
| Change password | POST | Auth endpoint | Yes | `useChangePassword()` |
| Record gamification event | POST | `/gamification/events/` | Yes | `useRecordEvent()` |
| Referrals | GET/POST | `/gamification/referrals/`, `/claim/` | Yes | `useReferralMe()`, `useClaimReferral()` |
| Challenges | GET/POST | `/gamification/challenges/`, `/{id}/submit/` | Yes | `useChallenges()`, `useSubmitChallenge()` |

\*Badge catalog fetch uses `gamificationData.badges.fetch()` — check auth requirements per environment.

**Local:** Avatar/onboarding preferences in `localStorage`; progress reset via `clearAllModuleProgress()`.

---

## Section 12 — Analytics (`/learn/analytics`)

### UI / UX (current)

`LearnAnalyticsView` — KPI cards, bar chart of content counts, module step totals. Internal/educator-facing tone.

### API calls

| Data | Method | Endpoint | Auth | Source |
|------|--------|----------|------|--------|
| Hub summary counts | GET | `/content/learn/` | No | `learningData.summary.fetch()` |
| Modules | GET | `/content/civic-modules/` | No | `learningData.modules.fetch()` |
| Articles | GET | `/content/learn/articles/` | No | `contentData.articles.fetch()` |
| Module analytics (available, not always used here) | GET | `/content/analytics/modules/?period=&module_slug=` | No | `learnHubApi.moduleAnalytics()` |

---

## Section 13 — Paths & units (deep links)

### Routes

| Route | Purpose |
|-------|---------|
| `/learn/paths/[slug]` | Learning edition / course path |
| `/learn/units/[unitSlug]/[year]` | Fiscal year edition within unit |
| `/learn/authors/[slug]` | Author + their modules |

### API calls

| Action | Method | Endpoint | Auth | Source |
|--------|--------|----------|------|--------|
| Course by slug | GET | `/content/courses/{slug}/` | No | `learningData.courses.fetchBySlug()` |
| Units list | GET | `/content/units/` | No | `learningData.courses.fetchByUnitYear()` |
| Author | GET | `/content/authors/{slug}/` | No | `learningData.authors.fetchBySlug()` |
| Authors list | GET | `/content/authors/` | No | `learningData.authors.fetch()` |
| Budget news modules | GET | `/content/civic-modules/?is_financial_year_analysis=true` | No | `learnHubApi.budgetNewsModules()` |
| FY years index | GET | `/content/civic-modules/years/` | No | `learnHubApi.budgetNewsYears()` |
| Stage leaderboard | GET | `/content/learn/stages/{slug}/leaderboard/` | No | `learnHubApi.stageLeaderboard()` |

---

## Section 14 — Trivia & engagement (embedded + standalone)

### UI / UX

- Embedded in module steps via `TriviaSection` / `triviaForStep()`
- Standalone via `/learn/[slug]` when slug resolves to trivia

### API calls

| Action | Method | Endpoint | Auth | Source |
|--------|--------|----------|------|--------|
| Trivia list | GET | `/engagement/trivia/` | No | `contentData.trivia.fetchList()` |
| Trivia by slug/id | GET | `/engagement/trivia/{id}/` | No | `contentData.trivia.fetchBySlug()` |
| Submit attempt | POST | `/engagement/trivia/{id}/attempt/` | Yes | `learnHubApi.submitTriviaAttempt()` |
| Trivia leaderboard | GET | `/engagement/trivia/{id}/leaderboard/` | No | `contentData.trivia.fetchLeaderboard()` |
| Legacy trivia answers | POST | `/gamification/trivia-answers/` | Yes | `ModuleDetailView`, `StageDetailDrawer` |

---

## Section 15 — Account subroutes (`/learn/account/*`)

### UI / UX

Separate from hub tabs — uses `DashboardShell` / `ContentLayout`. Settings-app pattern (password, notifications, sign-out). Protected by `account-protected-gate`.

### API calls

Uses shared auth/profile hooks (`AccountProfileForm`, citizen account APIs) — not learn-hub-specific. Typically `GET/PATCH /users/me/` and auth password endpoints.

---

## Master API reference (`learnHubApi` + related)

All paths relative to `/api/v1/`.

| Method | Endpoint | Used for |
|--------|----------|----------|
| GET | `/content/learn/` | Hub summary, trending, counts |
| GET | `/content/learn/videos/` | Video list |
| GET | `/content/learn/articles/` | Article list |
| GET | `/content/learn/stories/` | Story list |
| GET | `/content/learn/documents/` | Document list |
| GET | `/content/learn/paths/` | Path list |
| GET | `/content/learn/quests/` | Quest list |
| GET | `/content/learn/profile/` | Authenticated learn profile |
| POST | `/content/learn/progress/` | Mark content progress |
| GET | `/content/civic-modules/` | All civic modules |
| GET | `/content/civic-modules/{slug}/` | Single module + chapters/steps |
| POST | `/content/civic-chapters/{id}/complete/` | Complete chapter |
| GET | `/content/units/` | Learning units |
| GET | `/content/courses/{slug}/` | Course edition |
| GET | `/content/authors/` | Authors |
| GET | `/content/authors/{slug}/` | Author detail |
| GET | `/content/analytics/modules/` | Module analytics |
| GET | `/gamification/me/` | XP, level, streak, badges, progress |
| GET | `/gamification/leaderboard/` | Leaderboard |
| GET | `/gamification/badges/` | Badge catalog |
| GET | `/gamification/certificates/` | User certificates |
| POST | `/gamification/certificates/issue/` | Issue certificate |
| POST | `/gamification/events/` | Record gamification events |
| GET | `/gamification/challenges/` | Challenges |
| POST | `/gamification/challenges/{id}/submit/` | Submit challenge |
| GET/POST | `/engagement/forum-threads/` | Forum |
| POST | `/engagement/forum-threads/{id}/posts/` | Forum replies |
| GET/POST | `/engagement/trivia/{id}/attempt/` | Trivia |
| GET | `/engagement/surveys/` | Sidebar surveys |
| GET | `/content/events/` | Sidebar events |
| GET | `/content/articles/{slug}/` | Article reader |
| POST | `/analytics/events/` | Client analytics |
| POST | `/engagement/feedback/` | Ratings |
| GET | `/notes/` | Published tasks on dashboard |
| GET | `/api/docrepository/` | Document repository (Next/Django) |

---

## Design tokens (audit recommendation → `skilledlearnhub`)

| Token | Value | Role |
|-------|-------|------|
| `--learn-stage-width` | `42rem` | Single centered column |
| `--learn-chamber-ink` | `#0b1220` | Dark reading room |
| `--learn-chamber-paper` | `#f7f4ee` | Warm paper |
| `--learn-seal-gold` | `#c4a035` | Sovereign / official stamp |
| `--learn-vote-green` | `#1f6b4f` | Civic progress |
| `--learn-vermillion` | `#d4483b` | Urgency / hearings |

**Gamification label (canonical):** `SOVEREIGN_LABEL = "Sovereigns"`, `SOVEREIGN_SHORT = "SVG"` in `src/lib/learn-gamification.ts` (`skilledlearnhub`).

---

## Copy improvements (audit)

| Current | Recommended |
|---------|-------------|
| Community Forums | Ask about the budget |
| Civic Modules | Learning path / FY name |
| Master the budget process | Pick up where you left off in Finance Bill 2026 |
| Sign in to post | Sign in to join the discussion |
| Failed to load modules | Modules didn’t load. Check connection and try again. |
| Submit (generic) | Save answer / Post reply / Continue |

---

## Route map (survive vs redirect — audit proposal)

| Keep | Merge / redirect |
|------|------------------|
| `/learn` (resume hub) | `?tab=*` → prefer stable routes over query-only state |
| `/learn/modules/[slug]` | `StageDetailDrawer` → redirect to route |
| `/learn/forum` | — |
| `/learn/documents` | Inline hub lane; optional drop standalone |
| `/learn/articles`, `/videos`, `/quests` | Hub content lanes, no right sidebar |
| `/learn/profile` | Consolidate with `?tab=profile` |
| `/learn/[slug]` | Article/trivia/story reader inside `LearnStage` |

---

## Key files index

```
src/layouts/LearnHubLayout.tsx       # Global shell, sidebar, events/surveys
src/components/learn/learn-paths-home.tsx   # Hub tab router
src/components/learn/learn-dashboard-view.tsx
src/components/learn/learn-modules-view.tsx
src/components/learn/module-detail-view.tsx
src/components/learn/stage-detail-drawer.tsx  # Duplicate reader (deprecate)
src/components/learn/learn-tab-page.tsx       # Articles/videos/quests lists
src/components/learn/forum-view.tsx
src/components/learn/learn-documents-view.tsx
src/components/learn/profile-view.tsx
src/components/learn/alerts-view.tsx
src/lib/learn-hub.ts                 # Primary API facade
src/data/learning.ts                 # Modules + fallback seeds
src/data/content.ts                  # Articles, stories, quests, documents
src/data/forum.ts                    # Forum adapter
src/contexts/learn-context.tsx       # Shared hub state
```

---

*Generated from the read-only `/learn` UI/UX audit (Jul 2026) cross-referenced with the korosbns codebase. Update this doc when `skilledlearnhub` merges or API routes change.*
