# Budget Hub Content API Audit

## Objective
Map existing Learn content APIs to Budget Hub page generation using **content id**.

## Existing Learn API Surfaces

- `contentData.articles.fetch(filters)` -> list items with `id`, `slug`, `title`
- `contentData.articles.fetchBySlug(slug)` -> full article payload
- `contentData.trivia.fetchList()` -> list items with `id` / `slug`
- `contentData.trivia.fetchBySlug(slug)` -> full trivia payload
- `contentData.stories.fetch(filters)` -> list items with `id` / `slug`
- `contentData.stories.fetchBySlug(slug)` -> story payload (best effort)

## Budget Hub Mapping

- New resolver: `src/lib/budget-hub-content-resolver.ts`
  - `resolveBudgetHubContentBySlug(slug)` (existing route compatibility)
  - `resolveBudgetHubContentById(contentId)` (new Budget Hub content-id flow)

- New content-id route:
  - `src/app/(marketing)/learn/content/[contentId]/page.tsx`
  - Resolves article/trivia/story by id, then renders `UnifiedReaderClientPage`

- Card-link migration:
  - `learnHubItemToCard()` now links to `Routes.LearnContentById(item.id)`
  - Budget Hub landing article cards now open via content-id pages

## Runtime/Contract Safety

- No platform contract changes.
- No navigation law changes.
- Existing slug routes remain functional (`/learn/[slug]`).

## Notes

- Article/trivia detail endpoints are slug-based; id routing uses list lookup first, then resolves by slug.
- Story resolution supports both direct slug lookup and list fallback by id/slug.
