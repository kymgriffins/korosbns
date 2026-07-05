# Page Spec: Learn Analytics (`/learn/analytics`)

Parent PRD: [learn-hub](../prd/learn-hub.md) · Status: `QA'd`

## Purpose
Overview dashboard of learn content metrics — modules, articles, videos, stories, documents.

## Users & Entry Points
- Who arrives here: All visitors
- Entry points: Learn Studio sidebar, `/learn/analytics` direct URL

## Primary Action
Browse content distribution metrics and top-performing modules/articles.

## States

| State | What's shown | What's interactive | What's disabled/hidden |
|-------|-------------|-------------------|----------------------|
| Loading | Skeleton grid (6 KPI cards + bar chart) | Nothing | All data |
| Empty (no content) | "No modules yet" / "No articles yet" inside tab panels | Tab switch | Content panel content |
| Populated | KPI cards (Total, Modules, Articles, Videos, Stories, Documents), content distribution bar chart, top articles, top modules by steps | Tab switch (Overview/Content/Modules), refresh | N/A |
| Error — fetch failure | Silently fails (empty counts) | Refresh button | Content panels show empty |

## Data Contract

| Field shown | Source | Type | Behavior if null/missing |
|------------|--------|------|-------------------------|
| Content counts | `learningData.summary.fetch().counts` | `Record<string, number>` | Show 0 |
| Module list | `learningData.modules.fetch()` | `CivicModule[]` | Show empty |
| Articles list | `contentData.articles.fetch()` | `LearnHubItem[]` | Show empty |
| Module steps count | `module.steps.length` | number | 0 |

## Component Map

| UI element | Component used | Decision tree step | Notes |
|-----------|---------------|-------------------|-------|
| Page layout | `StudioPage` | 1 (primitive) | Width "wide" |
| KPI cards | shadcn `Card` | 1 (primitive) | CardHeader + CardContent |
| Content chart | Custom bar chart | 2 (composition) | Pure CSS bars, not Recharts |
| Tabs | shadcn `Tabs` | 1 (primitive) | TabsList + TabsContent |
| Top articles list | Custom list | 2 (composition) | Border + tags |
| Top modules | Custom list with ranking | 2 (composition) | Numbered badges |
| Loading | `Skeleton` | 1 (primitive) | Per-card skeleton |

## Motion Spec

N/A — analytics is data-static, no critical animations.

## Responsive Behavior

| Breakpoint | Layout change |
|-----------|---------------|
| sm (mobile) | 2-column KPI grid, stacked tabs |
| md (tablet) | 3-column KPI grid |
| lg (desktop) | 6-column KPI row |

## Edge Cases

| Edge case | Expected behavior |
|-----------|------------------|
| No content published | All KPIs show 0, all panels empty |
| API fails silently | All counts show 0, refresh button to retry |
| Single module only | KPI shows "1 module", bar chart at 100% |

## Exit Points

| From | To | Trigger |
|------|-----|---------|
| Analytics | Learn Home `/learn` | Sidebar nav |

## Sign-off

- [x] Matches parent PRD scope
- [x] All states filled (no blanks)
- [x] Component Decision Tree followed for every element
- [ ] Motion tokens used, no invented values
- [ ] Ready for Gate 4 (Build)
