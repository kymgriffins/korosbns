# Learning units — frontend (`feature/learning-units-editions`)

## Implemented routes

| Route | File | Purpose |
|-------|------|---------|
| `/learn/units` | `src/app/(marketing)/learn/units/page.tsx` | Hub: list units and fiscal-year editions from API |
| `/learn/units/[unitSlug]/[year]` | `src/app/(marketing)/learn/units/[unitSlug]/[year]/page.tsx` | Edition hub: chapters → `/articles/[slug]`, media, trivia CTA |
| `/learn/bps` | `src/app/(marketing)/learn/bps/page.tsx` | Redirect → `/learn/units/budget-policy-statement/2026` |
| `/articles/[slug]` | (existing) | Chapter reader |

Route helpers: `Routes.LearnUnits`, `Routes.LearnUnitEdition(unitSlug, year)` in `src/constants/routes.ts`.

## Data layer

`src/lib/learning-units.ts` — server fetchers (same pattern as `src/lib/server-content.ts`):

- `fetchLearningUnitsServer()` → `GET /api/v1/content/units/`
- `fetchLearningEditionServer(slug)` → `GET /api/v1/content/courses/<slug>/`
- `fetchLearningEditionByUnitYearServer(unitSlug, year)` — resolves edition slug from units list, then loads course detail
- `resolveEditionSlugServer(unitSlug, year)` — edition slug lookup only

Uses `buildApiUrl` + `SERVER_CONTENT_REVALIDATE_SECONDS` (same-origin `/api/v1` proxy in production).

## API contract

- `GET /api/v1/content/units/` — `{ results: [{ slug, title, abbreviation, description?, editions: [{ slug, fiscal_year, title, module_code? }] }] }`
- `GET /api/v1/content/courses/bps-2026/` — `{ unit, fiscal_year, lessons[], media[], ... }`

## Local smoke test

1. Run API + seed (`bps-2026` edition) on `feature/learning-units-editions`.
2. `npm run dev` in `korosbns`.
3. Visit:
   - http://localhost:3000/learn/units
   - http://localhost:3000/learn/units/budget-policy-statement/2026
   - http://localhost:3000/learn/bps (should redirect to the edition URL)

## Note on “many articles”

Chapters stay as separate articles in the API. The **unit** groups them under one edition; the edition hub links chapters instead of presenting unrelated blog posts.
