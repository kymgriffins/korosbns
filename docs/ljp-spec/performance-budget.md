# Performance Budget
## Learning Journey Platform — Measurable limits

Every PR touching `/learn` or `src/components/lms` is evaluated against this budget.

Measure with: Lighthouse (mobile), Next.js build analyzer, Playwright trace.

---

## 1. Global budgets

| Metric | Target | Fail |
|--------|--------|------|
| LCP (mobile) | < 2.5s | ≥ 3.0s |
| CLS | < 0.1 | ≥ 0.15 |
| INP | < 200ms | ≥ 300ms |
| TTFB (static catalog phase) | < 600ms | ≥ 1s |

---

## 2. Per-route budgets

### Lesson page (critical path)

| Resource | Budget |
|----------|--------|
| LCP element | Video poster or skeleton < 2.5s |
| Initial JS (route) | < 200KB gzip (client chunks) |
| Hydration (client island) | < 150ms on mid-tier mobile |
| Video | Lazy — `preload="metadata"` only until play |
| Motion bundle | Inside client island only |
| Images | `next/image` with `sizes` |
| Fonts | Self-hosted, `font-display: swap` |

### Course detail

| Resource | Budget |
|----------|--------|
| LCP | Hero image optimized, priority |
| Initial JS | < 150KB gzip |
| Module accordion | No JS on server page if possible — client wrapper only for accordion group |

### Hub pages (Home, Catalogue)

| Resource | Budget |
|----------|--------|
| LCP | Continue card or first course image |
| Initial JS | < 120KB gzip |
| Course grid | Max 6 images above fold with lazy below |

---

## 3. Asset rules

| Asset | Rule |
|-------|------|
| Video | Native `<video>` — no custom player SDK v1 |
| Images | `next/image`, WebP, explicit `sizes` |
| Icons | `lucide-react` tree-shaken imports |
| Fonts | Existing Neue Montreal — no new font per route |
| Third-party | No analytics scripts in learn shell |

---

## 4. Code splitting

| Module | Load strategy |
|--------|---------------|
| `LessonExperience` | Client boundary — route level |
| `TriviaPopup` | Colocated in LessonExperience |
| `Catalogue` filters | Client page acceptable |
| `LmsShell` | Shared layout — keep lean |

---

## 5. Data fetching

| Phase | Rule |
|-------|------|
| Static catalog | Sync getters — no waterfall |
| API phase | Parallel `Promise.all` in RSC |
| Client | No fetch on mount for catalog |

---

## 6. Regression gates (CI — target)

```bash
pnpm build                    # must pass
pnpm test                     # unit tests
pnpm test:e2e                 # critical journeys (when added)
# lighthouse-ci (future)      # lesson + home budgets
```

---

## 7. PR performance checklist

- [ ] No new barrel imports bloating bundle (`import from '@/components/lms'`)
- [ ] Images use `sizes`
- [ ] No `"use client"` on full page without justification
- [ ] Video not auto-preloading full file
- [ ] Lighthouse mobile spot-check on changed routes

---

## 8. Failure response

Budget fail → do not merge → optimize or split bundle → re-measure.

Document exception in `decision-log.md` if unfixable.
