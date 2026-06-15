# Budget Ndio Story — Roadmap

> Last updated: 2026-06-15

---

## Status Legend

| Mark | Meaning |
|------|---------|
| [x] | Done |
| [~] | In progress |
| [ ] | Not started |
| [!] | Blocked |

---

## ✅ Done — Budget News & Analytics

### Data & Backend

- [x] **`CivicModule.is_financial_year_analysis` flag** — marks modules as FY analysis content
- [x] **`metadata.report` JSON schema** — stores KPIs, sector/revenue/expenditure charts, comparison rows, highlights at module level
- [x] **Per-chapter `ContentUnit.metadata.report`** — chapter-level KPIs, chart config (bar/pie), callouts
- [x] **API endpoint `GET /api/v1/content/civic-modules/?is_financial_year_analysis=true`** — lists FY analysis modules with full chart data
- [x] **API endpoint `GET /api/v1/content/civic-modules/<slug>/`** — single module detail with nested chapter chart data
- [x] **Analytics tracking** — `POST /api/analytics/events/` for module/chapter views
- [x] **Seed data: FY2026/27 budget** — 13 chapters covering all sectors with real KES figures
- [x] **Seed articles** — HTML content for budget-at-a-glance, education, health, infrastructure, etc.

### Frontend — Chart Infrastructure

- [x] **`recharts` (3.8.1)** installed as dependency
- [x] **`src/ui/chart.tsx`** — reusable chart wrapper (`ChartContainer`, `ChartTooltip`, `ChartLegend`, theme-aware styling via CSS vars)
- [x] **`src/types/budget-report.ts`** — TypeScript types: `BudgetKpi`, `BudgetChartPoint`, `BudgetComparisonRow`, `BudgetCallout`, `BudgetReportProfile`, `ChapterReportData`, `BudgetChartConfig`
- [x] **`src/lib/budget-format.ts`** — KES formatting: `formatKesBillions`, `formatKesTrillions`, `percentChange`
- [x] **`src/lib/budget-report-data.ts`** — data resolvers: `resolveReportProfile`, `resolveChapterReport`, `parseArticleBlocks`

### Frontend — Components

- [x] **`BudgetKpiGrid` / `BudgetKpiCard`** — KPI display with trend arrows
- [x] **`BudgetBarChart`** — sector/revenue/expenditure bar chart with colored bars
- [x] **`BudgetPieChart`** — donut pie chart with custom legend
- [x] **`BudgetComparisonTable`** — FY2025/26 vs FY2026/27 side-by-side comparison
- [x] **`BudgetCalloutCard`** — info/warning/success callout cards
- [x] **`BudgetReportHero`** — hero with FY badge, theme, presenter
- [x] **`BudgetModuleReportOverview`** — full module overview combining KPIs + charts + tables + highlights
- [x] **`BudgetChapterReportBlocks`** — chapter-level report: KPIs, chart, comparison rows, callouts
- [x] **`BudgetArticleBody`** — article content parser (headings, paragraphs, lists, images)
- [x] **`BudgetReportToc`** — sticky table of contents sidebar

### Frontend — Pages & Routes

- [x] **`/budgetnews`** — list of all FY analysis modules with cards
- [x] **`/budgetnews/[slug]`** — module detail with hero, KPI grid, charts, chapter list, TOC
- [x] **`/budgetnews/[slug]/[chapterSlug]`** — chapter detail with report blocks and article body

---

## 🔜 Phase 1 — Chart Animations

Goal: Make existing charts feel alive with entrance animations and micro-interactions.

| Task | Priority | Est. Effort | Dependencies |
|------|----------|-------------|--------------|
| [ ] Animate `BudgetBarChart` bars with staggered grow-up on mount (recharts `animationBegin`/`animationDuration`) | High | 2h | None |
| [ ] Animate `BudgetPieChart` with sweep-in entrance | High | 1h | None |
| [ ] Animate `BudgetKpiCard` values with count-up (use `@number-flow/react` already in deps) | High | 2h | None |
| [ ] Add hover state transitions on chart bars (opacity/scale) | Medium | 1h | None |
| [ ] Stagger KPI cards entrance (stagger children on mount) | Medium | 1h | None |
| [ ] Scroll-triggered chart animation (re-animate when scrolled into view) | Low | 3h | `IntersectionObserver` |

**Acceptance criteria:** All charts on `/budgetnews/[slug]` animate in when the page loads. KPIs count up. Bars grow from bottom. Pie sweeps open.

---

## 🔜 Phase 2 — Historical Data Backend

Goal: Support multiple fiscal years so users can browse FY2025/26, FY2024/25, etc.

| Task | Priority | Est. Effort | Dependencies |
|------|----------|-------------|--------------|
| [ ] Add `fiscal_year` field to `CivicModule` (char field, e.g. "2026/27") | High | 1h | None |
| [ ] Create seed data for FY2025/26 budget (research + compile from public records) | High | 2-3d | Public data availability |
| [ ] Create seed data for FY2024/25 budget | Medium | 2-3d | Public data availability |
| [ ] Create seed data for FY2023/24 budget | Medium | 2-3d | Public data availability |
| [ ] Add API filter `?fiscal_year=2026/27` to civic-modules endpoint | High | 0.5h | `fiscal_year` field |
| [ ] Add API filter `?fiscal_year__gte=2024/25` for range queries | Medium | 0.5h | `fiscal_year` field |
| [ ] Document data sources and compilation methodology in `documentations/budget/data-sources.md` | Medium | 2h | Research |

**Acceptance criteria:** API returns modules filtered by fiscal year. At least FY2025/26 has complete seed data with chart figures.

---

## 🔜 Phase 3 — Fiscal Year Selector UI

Goal: Let users switch between fiscal years on the budget news pages.

| Task | Priority | Est. Effort | Dependencies |
|------|----------|-------------|--------------|
| [ ] Add FY dropdown/chips filter to `/budgetnews` page | High | 3h | Phase 2 API filters |
| [ ] Add FY navigation on module detail page ("View FY2025/26 instead") | High | 2h | Phase 2 API filters |
| [ ] Show "Available FYs" badge on budget news cards | Medium | 1h | Phase 2 data |
| [ ] Persist selected FY in URL query param (`?fy=2026/27`) | Medium | 1h | None |
| [ ] Loading skeleton when switching FY | Low | 0.5h | None |

**Acceptance criteria:** Users can filter budget news by fiscal year. URL reflects selection. Switching FY reloads chart data.

---

## 🔜 Phase 4 — Cross-Year Trend Charts

Goal: Compare budget figures across multiple fiscal years with line/area charts.

| Task | Priority | Est. Effort | Dependencies |
|------|----------|-------------|--------------|
| [ ] Add `GET /api/v1/content/analytics/budget-trends/?sector=education&from=2024/25&to=2026/27` endpoint | High | 4h | Phase 2 data |
| [ ] Build `BudgetTrendChart` component (line/area chart, multiple FYs) | High | 4h | recharts `LineChart` |
| [ ] Add sector selector for trend view | Medium | 2h | None |
| [ ] Animate trend lines with draw effect | Medium | 2h | recharts `animationDuration` |
| [ ] Show % change annotations on data points | Low | 2h | None |

**Acceptance criteria:** Users can see a line chart comparing a sector's allocation across 3+ fiscal years with animated draw effect.

---

## 🔜 Phase 5 — Data Export & Sharing

Goal: Allow users to download charts and share reports.

| Task | Priority | Est. Effort | Dependencies |
|------|----------|-------------|--------------|
| [ ] Add "Download as PNG" on charts (html2canvas or recharts `toDataURL`) | Medium | 3h | None |
| [ ] Add "Download as CSV" for comparison tables | Medium | 2h | None |
| [ ] Shareable URL with FY + sector params | Low | 1h | Phase 3 URL params |
| [ ] Print-friendly stylesheet for budget news pages | Low | 2h | None |

---

## 📋 Summary

| Phase | Scope | Status | Target |
|-------|-------|--------|--------|
| ✅ Done | Full chart infra, FY2026/27 seed, report components | Complete | Shipped |
| 🔜 P1 | Chart entrance animations | Not started | Next sprint |
| 🔜 P2 | Historical FY data backend | Not started | Next sprint |
| 🔜 P3 | FY selector UI | Not started | Sprint +2 |
| 🔜 P4 | Cross-year trend charts | Not started | Sprint +3 |
| 🔜 P5 | Export & sharing | Not started | Sprint +4 |

---

## Existing Code Index

### Frontend Key Files

| File | Purpose |
|------|---------|
| `korosbns/src/ui/chart.tsx` | Recharts wrapper (ChartContainer, ChartTooltip, ChartLegend) |
| `korosbns/src/types/budget-report.ts` | Budget report type definitions |
| `korosbns/src/lib/budget-format.ts` | KES formatting utilities |
| `korosbns/src/lib/budget-report-data.ts` | Report data resolvers |
| `korosbns/src/components/budget-news/report-blocks.tsx` | All chart/report React components |
| `korosbns/src/app/(marketing)/budgetnews/` | Budget news pages (list, module, chapter) |
| `korosbns/src/lib/learn-hub.ts` | API client for budget news endpoints |
| `korosbns/src/constants/routes.ts` | Budget news route definitions |
| `korosbns/package.json` | Dependencies (recharts 3.8.1) |

### Backend Key Files

| File | Purpose |
|------|---------|
| `bnske.budgetndiostory.org/content/models/civic_learning.py` | CivicModule/CivicChapter models |
| `bnske.budgetndiostory.org/content/models/content.py` | ContentUnit model with metadata.report |
| `bnske.budgetndiostory.org/content/views/civic.py` | API views for civic modules |
| `bnske.budgetndiostory.org/seeds/budget_fy2026_27.json` | FY2026/27 seed data |
| `bnske.budgetndiostory.org/documentations/budget/research/budgetreportsgaps.md` | Historical data gap analysis |
