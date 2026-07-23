# Frontend authentication (korosbns)

**Canonical policy module:** `src/lib/auth-policy.ts`  
**Full documentation:** `docs/frontend-auth.md`  
**Cursor rule:** `.cursor/rules/frontend-auth.mdc`

## Non-negotiable rules for AI agents

1. **Do not invent a new auth model.** The Learning Hub uses the **HYBRID** model defined in `auth-policy.ts`.
2. **Do not add a global login wall on `/learn/*`.** Only `/learn/account/*` and `/learn/quests/*` require authentication at the route level.
3. **Do not duplicate route lists.** Import `LEARN_PROTECTED_PATH_PREFIXES`, `AUTH_*` constants from `auth-policy.ts` for middleware, guards, and tests.
4. **Do not pass raw `next` query params to `router.push`.** Always use `sanitizeRedirectPath()`.
5. **Do not call privileged APIs without `auth: true`.** Progress, gamification, profile, chapter completion, trivia attempts, and forum writes require Bearer tokens.
6. **Use `isLoggedIn` from `useAuth()` for UI gating**, not `isAuthenticated()` (token presence without validation).

## Quick reference

| Concern | Implementation |
|---------|----------------|
| Session state | `AuthProvider` + `GET /users/me/` |
| Route protection (server) | `middleware.ts` → `evaluateAuthMiddleware()` |
| Route protection (client) | `<Protected>` on account/quests layouts only |
| Post-login redirect | `sanitizeRedirectPath()` |
| Token storage | `sessionStorage` (access) + `localStorage` (refresh) + cookie bridge for middleware |

When changing auth behavior, update **all** of: `auth-policy.ts`, `docs/frontend-auth.md`, tests in `src/lib/__tests__/auth-*.test.ts`, and `.cursor/rules/frontend-auth.mdc`.

---

# Learning Hub upgrade summary

## New standalone routes (outside SPA tab system)
| Route | File | Component |
|-------|------|-----------|
| `/learn/modules/[slug]` | `src/app/(marketing)/learn/modules/[slug]/page.tsx` | `ModuleDetailView` |
| `/learn/analytics` | `src/app/(marketing)/learn/analytics/page.tsx` | `LearnAnalyticsView` |

## New/rebuilt components
| Component | Location | Purpose |
|-----------|----------|---------|
| `ModuleDetailView` | `src/components/learn/module-detail-view.tsx` | Mobile-first tabbed reader (Read/Watch/Quiz) with progress bar, prev/next nav, completion flow |
| `LearnAnalyticsView` | `src/components/learn/learn-analytics-view.tsx` | Tabbed analytics (Overview/Content/Modules) with KPI cards, bar chart, top articles/modules |
| `ArticleForumSection` (via `ModuleForum` reuse) | `client-page.tsx` | Collapsible discussion section below article body |

## Upgraded components
| Component | Changes |
|-----------|---------|
| `LearnContentGrid` | Type icons, gradient fallbacks, difficulty badges, published date, tags, hover zoom |
| `LearnDashboardView` | Quick action buttons row (Start Learning, Analytics, Discussions, Quests), daily motivational quote card |
| `LearnHubLayout` sidebar | Analytics link added under "Insights" group |

## Routes updated
- Dashboard cards now navigate to `/learn/modules/[slug]` instead of using overlay callback
- Module list cards navigate to `/learn/modules/[slug]`
- "Continue learning" card navigates to `/learn/modules/[slug]`

## TypeScript
All new code passes `tsc --noEmit` cleanly. Strict mode enforced on all callback parameters.

---

# Headless Data Layer

**Canonical location:** `src/data/*.ts` 
**Pattern doc:** `TASKLIST.md` → Phase 7

## Rules for AI agents

1. **Do not call API functions directly in page/components.** Always go through `src/data/{domain}.ts` stores using `withFallback()`.
2. **Learn catalogue is JSON-only.** `learningData.modules` / `summary`, `videoData`, `contentData` articles/stories/paths/quests/trivia list, and `transcripts` read seeded JSON under `src/data/fallbacks/` and must not call Learn Hub catalogue APIs. **Profile and gamification** (plus trivia leaderboard / knowledge when used) remain authenticated or personal API calls.
3. **YouTube bloodline:** `fallbacks/content-videos.json` + module `youtube_urls` are the frontend source of truth for series; do not hydrate videos from Django on the Learn Hub.
3. **Every data store must export**: `get()`, `set()`, `fetch()`, and optionally `fetchById()` / `create()` / `update()` / `delete()`.
4. **`fetch()` for non-catalogue domains must use `withFallback()`** from `src/data/adapter.ts` — it tries the real API first, falls back to defaults on failure.
5. **Default data comes from seed JSONs** (`content_videos.example.json`, `civic_modules.json`, `bnsConfig.json`, etc.) or sensible zero-value states.
6. **All stores are headless** — they work without a backend. The UI stays functional with defaults.
7. **Add new types to the store file**, not to shared type files, unless the type is used across multiple domains.

## Migration workflow per page

```
1. Add `src/data/{domain}.ts` store (if not already created)
2. Import the store in the page/component
3. Replace `citizenApi.getXxx()` / `adminApi.getXxx()` / `learnHubApi.getXxx()`
   with `dataStore.fetch()` (which uses `withFallback` internally)
4. Remove loading/error states that only trigger on API failure
5. Test with backend ON → live data
6. Test with backend OFF → default data
```

## Quick reference

| Store | File | Default Source |
|-------|------|----------------|
| Videos | `src/data/videos.ts` | `content_videos.example.json` |
| Transcripts | `src/data/transcripts.ts` | Inline defaults + API fetch |
| Content (articles/stories/docs) | `src/data/content.ts` | Seed JSONs |
| Learning modules | `src/data/learning.ts` | `civic_modules.json` |
| Tasks | `src/data/tasks.ts` | `bnsConfig.json` meeting action items |
| Users & Team | `src/data/users.ts` | `bnsConfig.json` leadership |
| Gamification | `src/data/gamification.ts` | Zero-value defaults |
| Events | `src/data/events.ts` | `content_events.example.json` |
| Surveys | `src/data/surveys.ts` | `engagement_surveys.example.json` |
| Forum | `src/data/forum.ts` | Empty array |
| Budget | `src/data/budget.ts` | Budget seed JSONs |
| Analytics | `src/data/analytics.ts` | Zero-value defaults |
| Partners | `src/data/partners.ts` | `bnsConfig.json` consortium |
| Admin meta | `src/data/admin-meta.ts` | Hardcoded sidebar nav |
| Site inventory | `src/data/site-content-inventory.ts` | `bnsConfig.json` |
