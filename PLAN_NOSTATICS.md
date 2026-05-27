# No-Statics Plan — Replace All Hardcoded Values with API Calls

**Branch:** `ft-nostatics`
**Goal:** Eliminate ~6,000+ lines of hardcoded content across 30+ files by sourcing all data from backend APIs.

---

## Phase 1 — Wire Existing APIs (Frontend only, no backend changes)

| # | File | Lines | Hardcoded Content | API Endpoint | Action |
|---|---|---|---|---|---|
| 1.1 | `src/constants/bnsConfig.json` | 453 | Entire org config (tagline, mission, partners, activities, programs, social links, impact, team, meetings) | `GET /org/config/` | Delete file. Use API response directly. Remove `staticFallback()` in `org-context.tsx` and `org-config.ts`. |
| 1.2 | `src/constants/team.ts` | 71 | 6 team members (name, role, image, bio, socials) | `GET /org/team/public/` | Delete file. Components fetch team from API. |
| 1.3 | `src/constants/stories.json` | 594 | 5 story flows with full page text, facts, pillars, risks, quiz prompts | `GET /content/stories/` | Delete file. Use API with slug-based lookup. |
| 1.4 | `src/constants/articles.json` | 22 | 3 placeholder articles | `GET /content/articles/` | Delete file. |
| 1.5 | `src/constants/docrepository-dump.json` | 1133 | 178 hardcoded document entries (names, sizes, URLs, folder paths) | `GET /content/learn/documents/` | Delete file. |
| 1.6 | `src/constants/documents-registry.ts` | 413 | Stage-to-folder map, constitution docs, document filtering | `GET /content/learn/documents/` + `GET /content/units/` | Derive mappings from API metadata instead of hardcoding. |
| 1.7 | `src/lib/learn-deep-dives.ts` | 199 | 4 complete fallback articles with full HTML | `GET /content/learn/articles/` + detail endpoint | Remove `FALLBACK_ARTICLES`. Always fetch from API. |
| 1.8 | `src/lib/article-placeholders.ts` | 19 | 4 hardcoded placeholder image entries | `GET /content/articles/` | Remove. API returns images. |
| 1.9 | `src/contexts/org-context.tsx` | 31 | `staticFallback()` hardcoded config | `GET /org/config/` | Remove fallback. Show loading state if API fails. |
| 1.10 | `src/lib/org-config.ts` | 26 | `staticFallback()` + offline cache logic | `GET /org/config/` | Remove fallback and offline cache. |
| 1.11 | `src/components/marketing/consortium-partners.tsx` | 60 | 3 partners + 4 activities | `GET /org/config/` → `partners[]` | Wire to API data instead of hardcoded arrays. |
| 1.12 | `src/components/marketing/partners-marquee.tsx` | 29 | 3 partner logos (Cloudinary URLs) | `GET /org/config/` → `partners[]` | Wire to API data. |
| 1.13 | `src/components/marketing/research.tsx` | 65 | `fallbackDocuments` — 6 hardcoded doc entries | `GET /content/learn/documents/` | Remove fallback. |
| 1.14 | `src/components/marketing/stories.tsx` | 84 | 6 hardcoded story cards + chart data | `GET /content/stories/` | Fetch from API. |
| 1.15 | `src/components/learn/learn-paths-home.tsx` | 100+ | `TRANSLATIONS` dictionary (EN/SW/SH) | New `/translations/` endpoint or remove | Move to backend i18n. |
| 1.16 | `src/components/marketing/landing-article-section.tsx` | 7 | Hardcoded stats "50k+" and "12+" | `GET /org/config/` → `metrics[]` | Wire to API. |
| 1.17 | `src/app/api/images/cohort/route.ts` | 35 | 5 fallback local images | Cloudinary API | Remove fallbacks. |

---

## Phase 2 — Extend Org Config API (Backend + Frontend)

**Backend:** Add new fields to `OrganizationConfig` model / serializer / public payload.

| # | Frontend File | Hardcoded Content | Backend Addition |
|---|---|---|---|
| 2.1 | `src/constants/links.ts` (76 lines) | Nav links (5), footer links (12), social links (7) | Add `navigation` JSONField to `OrganizationConfig`: `{ nav: [...], footer: [...], social: [...] }` |
| 2.2 | `src/constants/feature-flags.ts` (7 lines) | `LEARN_STORIES_VISIBLE` boolean | Add `features` JSONField: `{ learn_stories_visible: bool, ... }` |
| 2.3 | `src/components/marketing/impact.tsx` (45 lines) | 6 impact metrics (5M+, 47, 5000, 20+, 1.2M+, 100%) | Add `metrics` JSONField array to org config |
| 2.4 | `src/constants/cloudinary.ts` (23 lines) | Cloudinary image/video URLs, YouTube embed URL | Add `media` JSONField: `{ cloudinary_base, youtube_channel_id, ... }` |
| 2.5 | `src/components/marketing/faq.tsx` (74 lines) | 10 FAQ Q&As across 6 categories | New `GET /content/faq/` endpoint or use `ContentUnit` with `format=FAQ` |
| 2.6 | `src/components/marketing/learn.tsx` (136 lines) | 7 FAQ items + 5 quiz questions + module info | Same FAQ endpoint + new quiz endpoint |
| 2.7 | `src/constants/learn-tabs.ts` (9 lines) | 7 learn tab definitions | Add `learn_tabs` to learn hub summary API |
| 2.8 | `src/components/marketing/hero.tsx` | 4 floating badge texts | Add `hero_badges` to org config |

---

## Phase 3 — New Backend Endpoints Needed

| # | Frontend File | Lines | Content | Backend Needed |
|---|---|---|---|---|
| 3.1 | `src/constants/stages-data.ts` | 1187 | 8 complete learning stages, transcripts, trivia (50+ questions), reflections | `GET /content/learn/stages/` — new model: `LearningStage` with steps, transcripts, trivia questions |
| 3.2 | `src/constants/stages-data.ts` | 1039-1187 | 22 stage takeaways | Include in stages endpoint |
| 3.3 | `src/constants/testimonials.ts` | 38 | 5 testimonials (name, role, quote, avatar) | Add `testimonials` JSONField to org config OR new content type |
| 3.4 | `src/components/learn/learn-paths-home.tsx` | 30-99 | EN/SW/SH translation strings | `GET /api/v1/translations/` — new endpoint or serve via org config |
| 3.5 | `src/constants/documents-registry.ts` | 25-31 | Stage-folder mapping | Add `stage_slug` or `folder_slug` to `LearningUnit` model |
| 3.6 | `src/layouts/LearnHubLayout.tsx` | 15-19 | `ALL_STAGES` — only first 3 of 8 stages | Fetch from stages API instead of hardcoding subset |

---

## Phase 4 — Structural Constants (Stay as-is)

These define app routing and build configuration, not data. **Do not move to API**.

| File | Reason |
|---|---|
| `src/constants/routes.ts` | SPA routing paths — changes would break all links |
| `src/constants/fonts.ts` | CSS/build config for font loading |
| `src/constants/sidebar.ts` | UI layout max items (low impact) |
| `src/constants/capabilities.ts` | Derived from team data — remove in Phase 1 instead |
| `src/constants/workflow.ts` | 3 static workflow steps — could migrate to Phase 2 |
| `src/constants/org.ts` | `PRIMARY_ORG_SLUG` — keep as config env var fallback |

---

## Phase 5 — Delete Mock/Scaffold Data

These files contain placeholder content from a different product template. **Delete entirely.**

| File | Lines | Content |
|---|---|---|
| `src/constants/membership.ts` | 58 | "Starter $25/mo", "Pro $42/mo" — not BNS pricing |
| `src/constants/integrations.ts` | 39 | GitHub, Slack, Notion, Figma, Discord, VS Code — references "Avento" |
| `src/constants/difference.ts` | 18 | "Other tools" vs "Avento features" — different product |

---

## API Contract Audit

Before implementation, verify each backend endpoint returns the expected shape:

| Endpoint | Expected Shape | Status |
|---|---|---|
| `GET /org/config/` | `{ tagline, mission, seo: { title, description, keywords, og_image }, layout: { show_newsletter, show_partners }, socials: [...], partners: [...], contact: {...} }` | ✅ Verified |
| `GET /org/team/public/` | `{ results: [{ id, name, title, bio, avatar_url, social_links }] }` | ✅ Verified |
| `GET /content/articles/` | `{ results: [{ id, slug, title, summary, body, body_html, published_at, author, metadata }] }` | ✅ Verified |
| `GET /content/articles/:slug/` | `{ id, slug, title, summary, body, body_html, published_at, author, metadata, learning_context? }` | ✅ Verified |
| `GET /content/stories/` | `{ results: [{ id, slug, title, summary, body, format, published_at, author, metadata }] }` | ✅ Verified |
| `GET /content/learn/documents/` | `{ count, results: [{ id, title, summary, url, content_type, ... }] }` | ✅ Verified |
| `GET /content/units/` | `{ results: [{ slug, title, abbreviation, editions: [{ slug, fiscal_year, title }] }] }` | ✅ Verified |
| `GET /content/courses/:slug/` | `{ id, slug, title, fiscal_year, module_code, summary, unit, lessons, media }` | ✅ Verified |

---

## Migration Strategy Per Component

Each migration follows this pattern:

**Before (hardcoded):**
```tsx
const items = STATIC_ARTICLES; // from constants/articles.json
```

**After (API-driven):**
```tsx
const { data, isLoading } = useQuery({
  queryKey: ['articles'],
  queryFn: () => citizenApi.getArticles(),
});
if (isLoading) return <Skeleton />;
const items = data?.results ?? [];
```

Use React Query (`@tanstack/react-query` already installed) for all data fetching. Each component gets a unique `queryKey`. Stale times vary by content type:
- Org config: 30 min (rarely changes)
- Team: 1 hour
- Articles/Stories: 5 min
- Documents: 10 min
- Learning stages: 1 hour

---

## Execution Order

1. Delete Phase 5 mock files (zero risk, no dependencies)
2. Wire Phase 1.1 (org config API) — unblocks partners, social links, nav
3. Wire Phase 1.2 (team API) — unblocks team section, capabilities
4. Wire Phase 1.3-1.6 (content APIs) — unblocks articles, stories, documents
5. Remove fallbacks and placeholders (1.7-1.14)
6. Implement Phase 2 backend changes (org config extensions)
7. Implement Phase 3 backend endpoints (stages, testimonials, FAQ, translations)
8. Wire Phase 2-3 frontend components
