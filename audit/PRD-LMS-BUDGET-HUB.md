# PRD — Gamified LMS + Kenya Budget Data World (Audit-Ready)

**Doc id:** `PRD-LMS-BUDGET-HUB-2026-07`  
**Version:** 1.1  
**Status:** Living · Audit-honest (no fake all-green years)  
**Stack:** Next.js (`korosbns`) · Django (`bnske`) · MySQL on cPanel · hybrid JSON/local/edge  
**Companion docs:**  
- [`PRD-BUDGET-NDIO-STORY.md`](./PRD-BUDGET-NDIO-STORY.md)  
- [`CHECKLIST-PRD-VERIFICATION.md`](./CHECKLIST-PRD-VERIFICATION.md)  
- [`ADMIN-CONTENT-TEST-RUNNER.md`](./ADMIN-CONTENT-TEST-RUNNER.md)  
- [`surface-contracts/`](../agent/spec/surface-contracts/)  
- bnske [`DATA_PROVENANCE_RULE.md`](../../bnske.budgetndiostory.org/DATA_PROVENANCE_RULE.md)

---

## 0. Senior audit verdict (frank)

| Claim in prior drafts | Truth |
|-----------------------|--------|
| “All years 1963–2026 tested & verified true” | **False.** Only recent FYs are ingested with Level-1 provenance in-repo (strongest: **2025/26**, **2026/27**). |
| “Production-ready historical hub” | **False.** Architecture + movie-hub UX can be built; historical series is a **multi-year OSINT ingest program**. |
| “County CRA figures ready” | **Mostly false for prod claims.** Fixture is illustrative until official CRA ingest. |
| LMS guest + auth + gamification + hybrid storage | **Partially true.** Progress/XP queues and seeds exist; edge-first + admin test runner still P0. |

**This PRD forbids marking a year `TESTED_TRUE` unless critical metrics pass the integrity gate (§7).**

---

## 1. Executive summary

Build one product with two coexisting experiences on the same provenanced data:

1. **Gamified LMS (`/learn`)** — free guest + authenticated; Moodle structure; Netflix browse; Duolingo feedback; data never blanks for critical paths.  
2. **Budget Data World (`/reports`)** — year selector → “episode” workshop (movie-hub); economists + citizens; graphs/images that do justice; OSINT **only** from government Level-1 sources (Treasury, Parliament, CBK, KNBS, COB, OAG, CRA, counties).

**Reliability doctrine:** critical data points only are guaranteed (transactions + Zod/DRF + fallbacks + admin runner). Non-critical analytics can degrade.

---

## 2. Goals

| ID | Goal |
|----|------|
| G1 | Guest can learn and keep local progress; auth syncs to Django |
| G2 | Critical LMS + budget metrics never blank / never lie |
| G3 | Select year → enter full data workshop (`/reports/[fy]`) |
| G4 | Every published number has Level-1 provenance |
| G5 | Instant graphs (Recharts → export) for video/production |
| G6 | Admin test runner verifies presence + allows edit |
| G7 | Continuous: smoke + integrity command + checklist |

---

## 3. Architecture (hybrid storage)

```
┌─────────────────────────────────────────────────────────┐
│  Next.js (Vercel)                                        │
│  ISR/seeds for public catalogue · localStorage progress  │
│  React Query cache · surface variants · graph export     │
└─────────────┬───────────────────────────────────────────┘
              │ /api/v1 proxy
┌─────────────▼───────────────────────────────────────────┐
│  Django (cPanel) + MySQL                                 │
│  SoT for auth, enrollments, XP, published metrics        │
│  JSONField year payloads + relational critical columns   │
│  cache (LocMem/file; Redis if available)                 │
└─────────────────────────────────────────────────────────┘
```

**Sync:** local → queue → Django; auth: server wins; guest: device cookie + last-write.  
**Critical writes:** `@transaction.atomic` + validators.  
**Integrity:** `manage.py audit_data_integrity` + Admin Content Lab suite.

---

## 4. Critical data points (only these are “never fail”)

### LMS

| Key | Storage |
|-----|---------|
| enrollment | MySQL |
| progress (module/step %, last position, score) | MySQL + JSON blob + local |
| xp, level, streak | MySQL + local preview |
| achievements | MySQL |
| content catalogue (modules/lessons) | MySQL + Next seed fallback |

### Budget year episode

| Key | Required for `TESTED_TRUE` |
|-----|----------------------------|
| `fy` | yes |
| `total_expenditure` | yes |
| `total_revenue` | yes |
| `deficit` (+ % GDP if available) | yes |
| `recurrent` / `development` | yes (modern era) |
| `top_sectors[]` (≥5 with values) | yes (modern era) |
| `provenance.sources[]` Level-1 URLs | yes |
| `verified_against` (≥2 sources or doc+speech) | yes |
| `graphs[]` (≥3 generated or stored) | yes for page “does justice” |
| `documents[]` PDF links | yes |

Pre-1990: allow `status: PARTIAL` with narrative + %GDP proxies **only if** KNBS/CBK/World Bank Level-2 labeled — never invent nominal KSh.

---

## 5. Budget Data World (`/reports`) — movie hub

| UI | Job |
|----|-----|
| Timeline / year selector | Enter workshop for FY |
| Episode hero | Theme “poster”, FY badge, provenance chip |
| Synopsis | Economic context (cited) |
| Cast | Top allocations |
| Trailer | Optional YouTube/podcast chapter |
| Visuals | ≥3 charts + optional archival image |
| Extras | PDF books, CSV/JSON export |
| Behind the scenes | Audit notes, variances, runner status |
| Seasons | Decades / Vision 2030 / devolution era |
| Filters | Citizen vs economist lenses |

**Same metrics** power Learn lessons and Reports graphs (metric id coexistence).

---

## 6. Official sources array (Level-1 loop)

Machine file: [`data/budget-sources.json`](./data/budget-sources.json)  
App import: use in runner + reports footer.

**Whitelist (publish allowed):** National Treasury, Parliament, CBK, KNBS, COB, OAG, CRA, official county sites.  
**Secondary only (labeled):** WB/IMF/KPMG/media — never sole source for a published KPI.

---

## 7. Year verification statuses

| Status | Meaning |
|--------|---------|
| `GAP` | No usable Level-1 extract in our DB |
| `SOURCE_LISTED` | Official PDFs/pages known; not yet extracted |
| `PARTIAL` | Some critical metrics + provenance; page may show limited UI |
| `IN_APP` | Seed/API serves metrics with provenance |
| `TESTED_TRUE` | Runner passed: critical keys + ≥2 source check + ≥3 graphs + smoke |

**Honesty rule:** Do not print ✅ TESTED_TRUE in marketing until runner says so.

Year matrix: [`CHECKLIST-BUDGET-YEARS.md`](./CHECKLIST-BUDGET-YEARS.md)

---

## 8. Gamification (LMS)

XP for lesson/quiz/streak; badges; soft local XP for guests; authoritative `/gamification/me/` when auth; leaderboards cached; certificates later. Motion only on real unlocks.

---

## 9. Admin

Content Lab / Test Runner (§ companion doc): inventory, presence matrix, inline edit, suite (smoke + required keys + links), **block publish** if red.

---

## 10. Implementation phases

| Phase | Deliverable |
|-------|-------------|
| P0 | Edge LMS catalogue + surface hub + runner v1 + FY26/27 & 25/26 `TESTED_TRUE` |
| P1 | `/reports/[fy]` episode template + graph export + year selector over `IN_APP` years |
| P2 | Ingest CBK GFS / Treasury books for 2013/14→present → move years `SOURCE_LISTED`→`IN_APP` |
| P3 | Glossary + circa calendar; county official ingest |
| P4 | Pre-2010 OSINT digitization program (PARTIAL pages OK) |

---

## 11. Senior audit checklist (UI / UX / data / DB)

### UI/UX
- [ ] Surface contract per viewport  
- [ ] Year episode: ≥3 visuals, provenance chip visible  
- [ ] No fake 0% bars / duplicate CTAs  
- [ ] Guest offline banner + sync  
- [ ] WCAG 2.2 AA intent + reduced-motion  

### Data
- [ ] Provenance Level-1 on every published metric  
- [ ] Sources array looped in CI (URLs HEAD/GET reachable or waived)  
- [ ] Year status file matches runner output  
- [ ] County illustrative never labeled audited  

### Database
- [ ] Critical writes transactional  
- [ ] JSON year payload + relational critical columns in sync  
- [ ] `audit_data_integrity` green on staging  
- [ ] Soft-delete / version snapshots for progress  

### Reliability
- [ ] Fallback seeds for learn catalogue  
- [ ] Optimistic UI + rollback  
- [ ] Sentry on critical paths  
- [ ] Smoke + citizen tests in CI  

---

## 12. What economists & citizens need (per year)

| Lens | Fields |
|------|--------|
| Economist | Deficit %GDP, debt service, rev vs target, recurrent/dev split, YoY, execution rate |
| Citizen | Education/health/infra allocations, county share, plain-language meaning, per-capita where cited |
| NGO/OSINT | Equity sectors, climate lines, PDF primary docs, variance notes |

---

## 13. Explicit non-claims

- We do **not** claim a complete independence→now numeric series today.  
- We do **not** use X.com as a source of truth.  
- We do **not** ship KPMG-only figures without Treasury/Parliament primary.  
- We do **not** mark years verified without the runner.

---

## 14. Next build order

1. Commit sources JSON + year checklist (this package).  
2. Admin runner reads year checklist + surface required keys.  
3. Harden FY2026/27 + 2025/26 to `TESTED_TRUE`.  
4. Episode UI for those years; selector lists others as `SOURCE_LISTED` / `GAP` (honest empty states with “help us digitize”).  
5. CBK/Treasury ingest pipeline for 2013→2025.  
