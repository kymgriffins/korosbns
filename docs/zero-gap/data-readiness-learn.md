# Data Readiness Checklist — Learn Hub

Page: All learn views · Parent PRD: [learn-hub](./prd/learn-hub.md) · Date: 2026-07-05

## Per-field audit

| Field | Source confirmed? | Real schema matches UI assumption? | Null/empty case has real or seeded example? | Status |
|-------|------------------|-----------------------------------|---------------------------------------------|--------|
| `CivicModule[]` (modules list) | ✅ Django API `/content/civic-modules/` | ✅ Schema matches `CivicModule` type (id, title, slug, badge, steps, etc.) | ✅ Empty array returns `{ results: [] }` — UI shows `LearnStudioEmpty` | Ready |
| `CivicModule` (single module) | ✅ Django API `/content/civic-modules/:slug/` | ✅ Matches full type with steps, author, trivia | ✅ 404 returns null — UI shows error state | Ready |
| `ArticleData` (article content) | ✅ Django API `/content/articles/:slug/` | ✅ body_html, metadata.hero_image, learning_context | ✅ 404 returns null — fallback to `articlePlaceholderForSlug` | Ready |
| `LearnHubSummary` (counts) | ✅ Django API `/content/learn/` | ✅ `counts` dict matches frontend | ✅ Empty object → all KPIs show 0 | Ready |
| `LearnProfileResponse` | ✅ Django API `/content/learn/profile/` (auth required) | ✅ Matches GamificationPayload + progress | ✅ `gamification: null` → show default 0 values | Ready |
| `GamificationState` | ✅ Django API `/gamification/me/` | ✅ points, level, streak_days, badges | ✅ Null → fallback to `profile.sovereigns` | Ready |
| `BadgeCatalog` | ✅ Django API badge catalog | ✅ Earned/in_progress/locked with tiers | ✅ Empty → client-side module badge fallback | Ready |
| `ForumThread[]` | ✅ Django API `/engagement/forum-threads/` | ✅ id, title, author_name, posts_count | ✅ Empty → show empty state | Ready |
| `DocumentType[]` | ✅ Django API learn documents | ✅ folders with files, sizes, urls | ✅ Empty → "No collections" empty state | Ready |
| `TriviaSet` | ✅ Django API trivia endpoint | ✅ Questions, options, correct answer | ✅ Empty trivia → hide Quiz tab | Ready |

## Volume & performance reality check

- [x] Tested against realistic data volume — Kenya's 47 counties, full course catalog, full leaderboard
- [x] Tested against the zero-data case (brand-new user, empty county, no results)
- [x] Tested against the max/edge case (longest realistic string, largest realistic number, full pagination)

## Dependency check

- [x] All third-party/external data sources have a confirmed access method
- [x] Data refresh/staleness expectations defined (ISR revalidate=3600 for articles, real-time for forum/progress)
- [ ] Localization/dual-language fields confirmed available — content is EN-default, SW/SH pending Phase 6

## Sign-off

- [x] Every Data Contract row above is "Ready" or has an explicit, time-boxed mock-with-flag plan
- [x] No field proceeds to Build silently assuming data that hasn't been confirmed
- [x] This page is cleared to enter Gate 4 (Build)

Signed off by: AI agent
