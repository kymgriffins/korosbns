# Learn Hub Rebuild Plan — Full-Stack Unified

## Current State Assessment

### Repository Stats
- **Frontend** (`korosbns/`): ~300 source files, 34k lines
- **Backend** (`bnske.budgetndiostory.org/`): Django project with `content`, `engagement`, `gamification` apps
- **Branches**: 35 branches with high churn on same files (learn-paths-home, stage-detail-drawer, LearnHubLayout)
- **40+** `any` types, **21** files >300 lines

### Frontend Issues
| File | Lines | Problems |
|------|-------|----------|
| `stage-detail-drawer.tsx` | ~1374 | Monolithic: video, audio, text, trivia, forum, documents all in one component. Uses localStorage for progress (20+ keys). `any` types throughout. Direct `fetch` calls mixed with `apiFetch`. |
| `learn-paths-home.tsx` | ~74KB | Massive dashboard with tabs, stage cards, catalog, leaderboard, profile. Same issues as above. |
| `learn-hub.ts` | 310 | API client with mixed patterns — uses both `apiFetch` and raw `fetch`. Some endpoints pass `auth: true` for civic modules. |
| `gamification.ts` | 178 | Device ID generated client-side as `device-${crypto.randomUUID()}`, stored in localStorage. Direct `fetch` to `/api/gamification/*` using `resolveAppUrl`. |
| `api-client.ts` | 532 | JWT in sessionStorage. `localStorage` used as fallback with migration logic. No httpOnly cookie support. |
| `use-stages.ts` | 37 | Uses `useState`/`useEffect` instead of React Query. Falls back to hardcoded `STAGES_DATA`. |
| `civic-fallback.ts` | 25 | Opt-in hardcoded fallback for offline demos. |
| Missing types | — | `types/learn.ts`, `types/gamification.ts` don't exist. Types scattered across API client files. |

### Backend (Django) State
| App | Models | Status |
|-----|--------|--------|
| **content** | CivicModule, CivicChapter, CivicContent, YouTubeVideo, KnowledgeEntry, ContentUnit, LearningUnit/Course/Stage | Rich but dual hierarchies (civic + legacy). Admin at ~60% smoothness — CivicContent not inlined in CivicChapter admin. |
| **engagement** | TriviaQuestion/TriviaOption, ForumThread/ForumPost, Survey, Bookmark, ShareLog | Trivia attached to CivicContent via FK. Forum attached to chapters/modules. |
| **gamification** | LearnerProfile (user+device dual mode), GamificationRule, Badge, ReferralCode, Referral, Challenge, Certificate, LearnProgress | Well-designed. Anonymous via X-Gamification-Id header (not cookie). Merge logic exists for anonymous→auth transition. |

### Key Architecture Gap: Anonymous Identity
**Current**: localStorage-based `X-Gamification-Id` header passed on every request.
**Desired**: Server-set httpOnly cookie (`bns_gid`) for anonymous identity, eliminating client-side ID generation and localStorage dependency.

---

## Target Architecture

```
                         ┌─────────────────────────────────────┐
                         │         LearnHub (app shell)         │
                         │  ┌───────────────────────────────┐  │
                         │  │  Server Component Shell       │  │
                         │  │  - Device ID from cookie      │  │
                         │  │  - Auth status from token     │  │
                         │  │  - Hydrates React Query       │  │
                         │  └───────────────────────────────┘  │
                         └──────────┬──────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
   ┌─────▼──────┐           ┌───────▼───────┐          ┌──────▼──────┐
   │ StageModule │           │ ContentCatalog│          │ ProfilePanel│
   │ - Video     │           │ - Articles    │          │ - Badges    │
   │ - Audio     │           │ - Videos      │          │ - Certs     │
   │ - Article   │           │ - Stories     │          │ - Progress  │
   │ - Trivia    │           │ - Documents   │          │ - Referral  │
   │ - Discuss   │           │ - Paths       │          └─────────────┘
   └─────────────┘           │ - Quests      │
                             └───────────────┘
```

### API Gateway Pattern

```
Client (Next.js)              API Gateway (Next.js)           Backend (Django)
     │                              │                              │
     │  GET /api/v1/stages          │                              │
     │─────────────────────────────►│  GET /content/civic-modules/ │
     │                              │─────────────────────────────►│
     │                              │◄─────────────────────────────│
     │◄─────────────────────────────│                              │
     │                              │                              │
     │  POST /api/v1/progress       │                              │
     │  (httpOnly cookie auto-sent) │  POST /content/learn/progress│
     │─────────────────────────────►│─────────────────────────────►│
     │◄─────────────────────────────│◄─────────────────────────────│
     │                              │                              │
     │  GET /api/v1/leaderboard     │                              │
     │─────────────────────────────►│  GET /gamification/leaderboard│
     │                              │─────────────────────────────►│
     │                              │◄─────────────────────────────│
     │◄─────────────────────────────│                              │
```

Key principles:
- **Client talks only to its own origin** — all `/api/v1/*` requests go to Next.js, which proxies to Django.
- **Server-side cookie injection** — device ID cookie (`bns_gid`) set by middleware or edge function.
- **Auth token in httpOnly cookie** — never accessible to JavaScript.
- **React Query for all server state** — deduplication, caching, background refetch, optimistic updates.
- **No localStorage for data** — max 3 keys: `bns_theme`, `bns_sidebar_collapsed`, read-only `bns_device_id`.
- **Server components where possible** — client components only for interactivity.

---

## Data Flow

### Anonymous User Flow
```
1. Request hits Next.js middleware
2. Middleware checks for bns_gid cookie
   ├─ Missing → Set-Cookie: bns_gid=<uuid> (httpOnly, Secure, SameSite=Lax, Max-Age=31536000)
   └─ Present → Continue
3. Server component renders LearnHub shell
4. Client hydrates, React Query fetches:
   - GET /api/v1/civic-modules/ (public, cached 1h, revalidated)
   - GET /api/v1/learn/summary (public, cached 1h)
5. No profile prompt — anonymous identity is implicit via cookie
6. User progresses through stages:
   - POST /api/v1/civic-chapters/:id/complete/ with cookie
   - Optimistic update in React Query cache
7. On sign-up, backend merges device progress into user profile
```

### Authenticated User Flow
```
1. User logs in → httpOnly cookie set with JWT (access + refresh)
2. Auth state detected server-side via cookie presence
3. Same UI as anonymous + additional features:
   - Profile button with avatar
   - Cross-device sync (already synced)
   - Certificate download
   - Forum posting with real name
   - Leaderboard display name
4. All progress already synced (anonymous→auth merge at login)
```

---

## Full-Stack Implementation Plan

### Phase 0: Foundation (Week 1)

#### 0.1 Django: Anonymous Identity via httpOnly Cookie
| Task | Detail | Backend | Frontend |
|------|--------|---------|----------|
| 0.1.1 | Create `AbstractDeviceMiddleware` that sets/reads `bns_gid` cookie | ✅ New middleware in `core/middleware.py` | — |
| 0.1.2 | Update `GamificationService.resolve_profile()` to read from cookie instead of header | ✅ Update `gamification/services/gamification_service.py` | — |
| 0.1.3 | Remove `X-Gamification-Id` header handling; replace with cookie-based device ID | ✅ Update all `_device_id()` helpers | ✅ Remove `gamificationHeaders()` from frontend |
| 0.1.4 | Add CORS config for credentials mode with cookie | ✅ Update CORS settings | — |
| Tests | | ✅ `test_device_middleware.py` | ✅ `device-id.test.ts` |

#### 0.2 Django: Content Admin Workflow Improvements
| Task | Detail |
|------|--------|
| 0.2.1 | Add `CivicContentInline` to `CivicChapterAdmin` — inline create/edit contents within chapter |
| 0.2.2 | Add `TriviaQuestionInline` to `CivicContentAdmin` — create trivia alongside content |
| 0.2.3 | Add `YouTubeVideoInline` / `AudioInline` to `CivicContentAdmin` — attach media formats |
| 0.2.4 | Add `GovernmentDocumentInline` to `CivicContentAdmin` — attach reference docs |
| 0.2.5 | Add bulk publish action for `CivicModule` (similar to `LearningCourseAdmin.publish_courses`) |
| 0.2.6 | Add preview button in `CivicContentAdmin` — renders content as it would appear in frontend |
| 0.2.7 | Add search/filter enhancements: filter by module, filter by has-video/has-audio |
| Tests | ✅ `test_admin_content_inlines.py` |

#### 0.3 Django: API Contract Standardization
| Task | Detail |
|------|--------|
| 0.3.1 | Audit all `/content/`, `/gamification/`, `/engagement/` API response shapes for consistency |
| 0.3.2 | Create shared response serializers for paginated lists (`count`, `results`, `next`, `previous`) |
| 0.3.3 | Ensure all datetime fields use ISO 8601 format |
| 0.3.4 | Ensure all UUID/ID fields are consistently typed (string UUIDs) |
| 0.3.5 | Add `/api/v1/` prefix middleware or URL conf for all API routes |
| Tests | ✅ `test_api_response_contract.py` |

#### 0.4 Frontend: Foundation
| Task | Detail |
|------|--------|
| 0.4.1 | Create shared type definitions: `types/api.ts`, `types/learn.ts`, `types/gamification.ts` |
| 0.4.2 | Create standardized hooks directory: `hooks/use-stages.ts` (React Query), `hooks/use-progress.ts`, `hooks/use-gamification.ts` |
| 0.4.3 | Create middleware for `bns_gid` cookie (edge-compatible) |
| 0.4.4 | Install/configure React Query provider |
| 0.4.5 | Create unified API client `lib/api-client.ts` (consolidate `api-client.ts`, `api.ts`, direct `fetch` calls) |
| 0.4.6 | Remove `civic-fallback.ts`, `civic-stages.ts`, `stages-data.ts` dependencies |
| 0.4.7 | Eliminate all `any` types in learn modules |
| Tests | ✅ `env.test.ts`, ✅ `api-client.test.ts`, ✅ `hooks/*.test.ts`, ✅ `middleware.test.ts` |

---

### Phase 1: Django Backend Alignment (Week 2)

#### 1.1 Django: LearnProgress API for Anonymous Users
| Task | Detail |
|------|--------|
| 1.1.1 | Refactor `LearnProgressUpdateView` to use cookie-based device identity |
| 1.1.2 | Add batch progress sync endpoint `POST /api/v1/learn/progress/batch/` for offline recovery |
| 1.1.3 | Add progress summary endpoint `GET /api/v1/learn/progress/summary/` returning per-stage completion stats |
| 1.1.4 | Add `GET /api/v1/learn/stages/:slug/progress/` for stage-specific progress |
| Tests | ✅ `test_progress_api_anonymous.py`, ✅ `test_progress_api_batch.py` |

#### 1.2 Django: Leaderboard & Gamification Improvements
| Task | Detail |
|------|--------|
| 1.2.1 | Optimize leaderboard query with materialized view or Redis caching |
| 1.2.2 | Add `device_name` field to `LearnerProfile` for anonymous leaderboard display |
| 1.2.3 | Add weekly/daily leaderboard scoping |
| 1.2.4 | Add streak milestone rewards endpoint |
| Tests | ✅ `test_leaderboard_scoped.py` |

#### 1.3 Django: Forum & Discussion API
| Task | Detail |
|------|--------|
| 1.3.1 | Allow anonymous users to create forum threads (with device ID as author) |
| 1.3.2 | Add `POST /api/v1/forum/posts/` with device ID support |
| 1.3.3 | Add `GET /api/v1/forum/chapter/:chapter_id/threads/` shortcut |
| Tests | ✅ `test_forum_anonymous.py` |

---

### Phase 2: Frontend Learn Shell (Weeks 2-3)

| Task | Detail | Tests |
|------|--------|-------|
| 2.1 | `LearnHubLayout` — responsive shell (server component shell + client hydration) | ✅ layout.test.tsx |
| 2.2 | `LearnContext` — UI state only (sidebar, active tab); no gamification data | ✅ learn-context.test.tsx |
| 2.3 | `StageCard` component — presentation only, receives data as props | ✅ stage-card.test.tsx |
| 2.4 | `StageList` component — vertical timeline of stages | ✅ stage-list.test.tsx |
| 2.5 | `StatsPanel` — reads from React Query cache, not localStorage | ✅ stats-panel.test.tsx |
| 2.6 | Replace `learn-paths-home.tsx` with composed `LearnHubHome` | ✅ learn-hub-home.test.tsx |

---

### Phase 3: Frontend Stage Detail (Weeks 3-4)

| Task | Detail | Tests |
|------|--------|-------|
| 3.1 | `StepVideoPlayer` — YouTube embed with progress tracking | ✅ step-video.test.tsx |
| 3.2 | `StepAudioPlayer` — audio player with progress | ✅ step-audio.test.tsx |
| 3.3 | `StepArticleReader` — prose reader with takeaways | ✅ step-article.test.tsx |
| 3.4 | `TriviaEngine` — MCQ + reflection, no localStorage, server-synced | ✅ trivia-engine.test.tsx |
| 3.5 | `ProgressSync` — optimistic updates via React Query mutation | ✅ progress-sync.test.ts |
| 3.6 | `DiscussionBoard` — forum threads + posts | ✅ discussion.test.tsx |
| 3.7 | `StageDetailDrawer` — composed from above, max 200 lines | ✅ stage-detail-drawer.test.tsx |
| 3.8 | `DocumentsPanel` — document browser with year filter | ✅ documents-panel.test.tsx |

---

### Phase 4: Leaderboard & Gamification (Week 4)

| Task | Detail | Tests |
|------|--------|-------|
| 4.1 | `Leaderboard` — paginated, scoped (all/weekly/daily) | ✅ leaderboard.test.tsx |
| 4.2 | Gamification hooks — `useGamification`, `useBadges`, `useStreak` | ✅ gamification-hooks.test.ts |
| 4.3 | `BadgeGallery` — earned + locked badges | ✅ badge-gallery.test.tsx |
| 4.4 | `CertificateList` — downloadable certificates | ✅ certificate.test.tsx |
| 4.5 | `ReferralCard` — share referral link, track referrals | ✅ referral.test.tsx |
| 4.6 | `ProfilePage` — gamification + profile settings | ✅ profile-page.test.tsx |

---

### Phase 5: Content Catalog (Week 4-5)

| Task | Detail | Tests |
|------|--------|-------|
| 5.1 | `ContentCatalog` — unified listing with tab switching | ✅ content-catalog.test.tsx |
| 5.2 | `ArticleCard` / `VideoCard` / `DocumentCard` — listing card components | ✅ card-components.test.tsx |
| 5.3 | `SearchBar` + `FilterPanel` — search, tag, difficulty filter | ✅ search-filter.test.tsx |
| 5.4 | ISR for content pages — `revalidate=3600` on catalog pages | — |
| 5.5 | Remove old `constants/documents-registry.ts` | — |

---

### Phase 6: Hardening (Weeks 5-6)

| Task | Detail | Tests |
|------|--------|-------|
| 6.1 | Error boundaries per module | ✅ error-boundary.test.tsx |
| 6.2 | Loading skeletons everywhere | ✅ skeleton.test.tsx |
| 6.3 | Offline detection + graceful degradation | ✅ offline.test.ts |
| 6.4 | Django: Add throttling/rate limiting on progress endpoints | ✅ test_rate_limits.py |
| 6.5 | Django: Cache optimization for leaderboard (Redis) | ✅ test_leaderboard_cache.py |
| 6.6 | Performance audit (LCP, CLS, INP) | lighthouse CI |
| 6.7 | E2E: anonymous journey | playwright |
| 6.8 | E2E: authenticated journey | playwright |
| 6.9 | E2E: anonymous→auth merge | playwright |
| 6.10 | Load test (k6) — target 10k concurrent users | k6 |

---

## API Contract

### Standard Response Format
```json
// List endpoint
{
  "count": 42,
  "next": "/api/v1/learn/articles/?page=2",
  "previous": null,
  "results": [...]
}

// Detail endpoint
{
  "id": "uuid",
  "title": "string",
  // ...type-specific fields
}

// Error response
{
  "detail": "Human-readable error message",
  "code": "error_code_string"
}
```

### Endpoint Summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/civic-modules/` | Public | List all published civic modules with chapters |
| GET | `/api/v1/civic-modules/:slug/` | Public | Civic module detail with chapters |
| POST | `/api/v1/civic-chapters/:id/complete/` | Public | Mark chapter complete (cookie or JWT) |
| GET | `/api/v1/learn/` | Public | Hub summary (counts + trending) |
| GET | `/api/v1/learn/profile/` | Public | Learner profile (gamification + progress) |
| POST | `/api/v1/learn/progress/` | Public | Update progress |
| POST | `/api/v1/learn/progress/batch/` | Public | Batch sync progress |
| GET | `/api/v1/learn/videos/` | Public | Video list (filtered/sorted) |
| GET | `/api/v1/learn/articles/` | Public | Article list |
| GET | `/api/v1/learn/paths/` | Public | Learning paths list |
| GET | `/api/v1/learn/quests/` | Public | Trivia quests list |
| GET | `/api/v1/learn/:content_type/:id/` | Public | Content detail |
| GET | `/api/v1/learn/stages/:slug/leaderboard/` | Public | Stage leaderboard stats |
| GET | `/api/v1/gamification/me/` | Public | Current learner gamification state |
| POST | `/api/v1/gamification/events/` | Public | Record gamification event |
| GET | `/api/v1/gamification/leaderboard/` | Public | Leaderboard (scoped) |
| GET | `/api/v1/gamification/referrals/me/` | Public | Referral code + stats |
| POST | `/api/v1/gamification/referrals/claim/` | Public | Claim referral |
| GET | `/api/v1/gamification/challenges/` | Public | Active challenges |
| POST | `/api/v1/gamification/challenges/:id/submit/` | Public | Submit challenge |
| GET | `/api/v1/gamification/certificates/` | Public | User certificates |
| POST | `/api/v1/gamification/certificates/issue/` | Public | Issue certificate |
| GET | `/api/v1/forum/chapter/:id/threads/` | Public | Forum threads for chapter |
| POST | `/api/v1/forum/threads/` | Public | Create thread |
| GET | `/api/v1/forum/threads/:id/` | Public | Thread detail with posts |
| POST | `/api/v1/forum/threads/:id/posts/` | Public | Create post |

---

## File Structure (Target)

```
src/
├── app/(marketing)/learn/
│   ├── page.tsx                    # Server component → LearnHubHome
│   ├── layout.tsx                  # Server component → LearnHubLayout
│   └── [slug]/page.tsx             # ISR content page
├── components/learn/
│   ├── learn-hub-layout.tsx        # App shell
│   ├── learn-hub-home.tsx          # Dashboard (was learn-paths-home.tsx)
│   ├── stage-card.tsx              # Stage presentation card
│   ├── stage-list.tsx              # Vertical timeline
│   ├── stage-detail-drawer.tsx     # Composed from sub-components (<200 lines)
│   ├── step-video-player.tsx
│   ├── step-audio-player.tsx
│   ├── step-article-reader.tsx
│   ├── trivia-engine.tsx
│   ├── discussion-board.tsx
│   ├── documents-panel.tsx
│   ├── leaderboard.tsx
│   ├── badge-gallery.tsx
│   ├── certificate-list.tsx
│   ├── referral-card.tsx
│   ├── profile-page.tsx
│   ├── content-catalog.tsx
│   ├── search-bar.tsx
│   └── filter-panel.tsx
├── hooks/
│   ├── use-stages.ts               # React Query
│   ├── use-progress.ts             # React Query mutation
│   ├── use-gamification.ts         # React Query
│   └── use-forum.ts                # React Query
├── lib/
│   ├── api-client.ts               # Unified fetch wrapper
│   ├── api-url.ts                  # URL builder
│   └── api-errors.ts               # Error types
├── types/
│   ├── api.ts                      # Shared API types
│   ├── learn.ts                    # Learn module types
│   └── gamification.ts             # Gamification types
├── contexts/
│   ├── learn-context.tsx            # UI state only
│   └── auth-context.tsx             # Auth state
├── middleware.ts                    # bns_gid cookie, auth check
└── env.ts                          # Zod-validated env schema
```

---

## Migration: Deletion List

Files to delete once functionality is rebuilt:

| File | Phase | Replacement |
|------|-------|-------------|
| `components/learn/learn-paths-home.tsx` | Phase 2 | `learn-hub-home.tsx` |
| `components/learn/stage-detail-drawer.tsx` | Phase 3 | `stage-detail-drawer.tsx` (split) |
| `constants/stages-data.ts` | Phase 0 | API-only |
| `hooks/use-stages.ts` | Phase 0 | `hooks/use-stages.ts` (React Query) |
| `lib/civic-fallback.ts` | Phase 0 | No fallback |
| `lib/civic-stages.ts` | Phase 0 | Direct API types |
| `constants/documents-registry.ts` | Phase 3 | API-based documents |
| `lib/gamification.ts` | Phase 0 | Part of `lib/api-client.ts` + hooks |
| `lib/fetch-policy.ts` | Phase 0 | Part of unified client |
| `lib/debug-logs.ts` | Phase 0 | Remove or simplify |
| `lib/api.ts` | Phase 0 | Part of unified client |

---

## Branch Strategy

```
main
└── rebuild/learn                          # Integration branch
    ├── rebuild/learn-phase/0-foundation   # Phase 0
    ├── rebuild/learn-phase/1-backend      # Phase 1 (Django)
    ├── rebuild/learn-phase/2-shell        # Phase 2 (Frontend)
    ├── rebuild/learn-phase/3-detail       # Phase 3 (Frontend)
    ├── rebuild/learn-phase/4-gamification # Phase 4
    ├── rebuild/learn-phase/5-catalog      # Phase 5
    └── rebuild/learn-phase/6-hardening    # Phase 6
```

Each phase branch merges into `rebuild/learn` when:
- All tests pass (frontend + backend)
- Build succeeds (both projects)
- No TypeScript errors
- No regressions in existing functionality

---

## Standards

### File Structure per Component
```
components/learn/trivia-engine/
├── trivia-engine.tsx           # Component
├── trivia-engine.test.tsx      # Unit tests
└── index.ts                    # Barrel export
```

### No File >200 Lines
Components exceeding 200 lines must be split.

### Zero `any` Types
All 40+ existing `any` usages eliminated in Phase 0.

### Zero localStorage for Data
Exceptions (max 3 keys):
- `bns_theme` (theme preference)
- `bns_sidebar_collapsed` (UI state)
- `bns_device_id` (read-only, set by server)

### TDD Workflow
1. Write test (red) → defines expected behavior
2. Write code (green) → passes the test
3. Refactor (blue) → clean up

### React Query Patterns
```ts
// Query
export function useStages() {
  return useQuery({
    queryKey: ['stages'],
    queryFn: () => apiFetch<Stage[]>('/api/v1/civic-modules/'),
    staleTime: 1000 * 60 * 60,
  });
}

// Mutation with optimistic update
export function useCompleteChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chapterId: string) =>
      apiFetch(`/api/v1/civic-chapters/${chapterId}/complete/`, { method: 'POST' }),
    onMutate: async (chapterId) => {
      await queryClient.cancelQueries({ queryKey: ['progress'] });
      const previous = queryClient.getQueryData(['progress']);
      queryClient.setQueryData(['progress'], (old: ProgressData) => ({
        ...old,
        completedChapters: [...(old?.completedChapters ?? []), chapterId],
      }));
      return { previous };
    },
    onError: (err, chapterId, context) => {
      queryClient.setQueryData(['progress'], context?.previous);
    },
  });
}
```

---

## Success Criteria

| Metric | Current | Target |
|--------|---------|--------|
| Test coverage (learn modules) | ~2.4% | >80% |
| File >200 lines in learn/ | 6 | 0 |
| `any` types in learn/ | 40+ | 0 |
| localStorage data keys | 20+ | ≤3 |
| Hardcoded URLs in src/ | 80+ | 0 |
| Build time | ~45s | <30s |
| Lighthouse Performance | ? | >90 |
| Lighthouse Accessibility | ? | >95 |
| Load test (concurrent users) | ? | 10,000 no errors |
| Django admin content creation | ~60% smooth | >90% smooth |

---

## Django Admin Improvements Detail

### Current Pain Points (Content Creation)
1. No inline editing of CivicContent within CivicChapter — must navigate away
2. Trivia questions created separately, linked manually
3. No preview of content as learner would see it
4. Media upload not streamlined within content form
5. No bulk operations for modules (unlike LearningCourse)
6. No document attachment inline for CivicContent
7. No search/filter for contents by module or media type

### Target Admin Flow
```
CivicModule Change Page
└── CivicChapter Inline (order, title)
    └── CivicContent Inline (title, article body, youtube_url, audio_url)
        └── TriviaQuestion TabularInline (question, options, answer, explanation)
        └── GovernmentDocument Inline (select from uploaded docs)
    └── Preview Button → opens frontend route in new tab
└── Bulk Publish Action (list view)
└── Export as JSON/CSV (list view)
```
