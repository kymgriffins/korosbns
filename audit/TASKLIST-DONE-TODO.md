# Tasklist — Done · Not done · To do

**Product:** Budget Ndio Story (`budgetndiostory.org`) — gamified civic LMS + Kenya budget data world  
**Stack:** Next.js (`korosbns`) · Django (`bnske`) · MySQL/cPanel · hybrid JSON/local/edge  
**Updated:** 2026-07-21  
**Branch:** `feat/mobile-first-reports-redesign`  

**Read with:** `PRD-LMS-BUDGET-HUB.md` · `PRD-BUDGET-NDIO-STORY.md` · `CHECKLIST-BUDGET-YEARS.md` · `PROGRESSIVE-UPGRADE.md`

---

## Summary (one screen)

| Bucket | % of north-star | Reality |
|--------|-----------------|--------|
| **DONE** | ~25–35% | Live app, auth, learn/reports shells, FY25–27 seeds, docs/PRDs, CI smoke |
| **PARTIAL** | ~20% | Gamification, offline sync, charts, SEO, admin CMS |
| **NOT DONE** | ~45–55% | Year archive, citizen impact movie-hub, admin runner, simulator, full LMS polish |

**Bar A (shippable youth LMS + current FY reports):** ~50% done.  
**Bar B (independence→now OSINT archive + BudgetWatch impact):** ~15–20% done.

---

## DONE ✅

### Platform & stack
- [x] Next.js App Router app (`korosbns`) + Django API (`bnske`)
- [x] API proxy / citizen auth (login, register, verify, reset working paths)
- [x] Guest browse of learn content without account
- [x] Local module progress (`localStorage`) + offline sync queues (exist; underused)
- [x] Gamification API surface (`/gamification/me/`, events, badges models)
- [x] Build green; citizen vitest + page smoke script
- [x] SEO basics (metadata, sitemap, JSON-LD on key pages)
- [x] Provenance policy documented (`DATA_PROVENANCE_RULE.md`)

### Product surfaces (live-ish)
- [x] Marketing site + `/learn` hub (Syllabus / Modules / Documents / Forum / Account)
- [x] Module detail / reader (read + watch paths)
- [x] `/reports` mobile-first brief (recent work on branch)
- [x] Budget news / civic FY modules
- [x] YouTube / TikTok models & learn videos list
- [x] FY **2025/26** and **2026/27** Level-1 seeded figures (`budget_fy*.json`)

### Spec / audit (this program)
- [x] Surface contracts (what/why/how)
- [x] Living PRDs + verification checklist
- [x] Admin Content Test Runner **spec** (not built yet)
- [x] Official sources array (`audit/data/budget-sources.json`)
- [x] Year matrix 1963/64→2026/27 with **honest** statuses (not fake all-green)
- [x] Progressive upgrade waves documented
- [x] Immersive learn (one-Q-per-page) on remote branch `reform-learn` (not merged to main)

---

## PARTIAL 🟡 (exists but not “never fails” / not product-bar)

| Area | What’s there | What’s missing |
|------|----------------|----------------|
| Hybrid storage | local + Django + some JSON seeds | ISR-first catalogues; stories/quests/trivia seeds empty; queues not wired on all paths |
| Gamification | XP/badges API, soft local profile | Full streaks UI, confetti mastery, leaderboards UX, certificates PDF |
| Learn UX | Modules, filters, signup aside | Netflix rows; one CTA; fake 0% bars; hierarchy debt |
| Immersive lessons | `reform-learn` branch | Merge + finish-path bugs fixed |
| Reports / charts | Recent FY briefs, Recharts pieces | Year selector movie-hub; ≥3 graphs gate; export for video |
| County data | 47 shell / CRA fixture | Official CRA ingest only |
| Admin | CMS pages, many no-ops | Content Lab runner; `/admin` link prefix fixes |
| Offline / PWA | Offline page, local progress | Full service worker + sync button UX |
| Auth | Core flows OK | Forgot-password demo form dead |
| i18n | Not really | Swahili |
| Integrity command | Policy exists | `audit_data_integrity` + runner automation |

---

## NOT DONE ❌ (required by PRDs / BudgetWatch / OSINT hub)

### P0 — do next (Bar A)
- [x] Edge-first learn: seed stories/quests/trivia; SSR hub; no blank on Django slow
- [x] Learn hub surfaces: Continue · Watch · Stories · Know-it · Numbers; **one** primary CTA
- [x] Admin **Content Test Runner** v1 (inventory, suite) — `/admin/dashboard/content-lab`
- [x] FY25/26 & 26/27 episode UI on `/reports` (IN_APP; TESTED_TRUE after lab suite)
- [x] P0 bugs: footer newsletter, learn finish paths, portal/WhatsApp, forgot-password, author/quest hrefs
- [x] Immersive learn routes integrated selectively from `reform-learn` (read/watch/quiz; hub kept) — full hub rewrite not merged
- [ ] Content events: every visible string planned (no orphan copy) — in progress via surfaces
- [x] Wire progress/XP queues on lesson complete paths (module-detail, stage drawer, immersive)

### P1 — BudgetWatch / citizen impact
- [x] Citizen lens blocks for FY **2025/26** + **2026/27** from cited seed copy only
- [x] Instant graph export (SVG/PNG) for episode charts
- [x] Economist vs citizen filter tabs on FY episodes
- [x] CBK GFS + Treasury books **ingest scaffolding** for **2013/14 → 2024/25** (`SOURCE_LISTED` stubs; no invented figures)
- [x] Honest UI for `GAP` / `SOURCE_LISTED` years (digitize CTA + portal links — never invent numbers)
- [ ] Glossary of budget terms (Level-1 definitions)
- [ ] Circa calendar of budget history events
- [x] County lens (47-county list → official CRA/Treasury/COB URLs; **no** illustrative CRA figures)
- [ ] Public participation hub (Treasury/Parliament comment windows)

### P2 — Full LMS + engagement
- [x] Impact simulator MVP (realloc sliders) — clearly labeled **SCENARIO**, not official
- [x] Basic leaderboard / XP display on learn profile (API-backed)
- [ ] Certificate PDF generation
- [ ] Drag-drop quiz types; confetti/Lottie mastery
- [x] PWA: existing `/sw.js` kept; `/reports` added to precache shell
- [ ] Swahili key explainers
- [ ] User-generated stories / forum quality bar
- [ ] Pre-2013 independence archive digitization program
- [ ] Lighthouse CI / CWV budget enforcement
- [ ] GDPR export/delete UX polish
- [ ] Full leaderboards / daily streaks / quests UX (beyond basic profile board)

### Explicitly out of “done” claims
- [ ] All years 1963–2026 `TESTED_TRUE` — **false today**; matrix says so
- [ ] X.com as data source of truth — never
- [ ] KPMG/WB alone as published KPI source — Level-2 label only

---

## Ordered backlog (execute top → bottom)

| # | Task | Owner lens | Depends on |
|---|------|------------|------------|
| 1 | Edge catalogue + seeds | Eng | — |
| 2 | Netflix `/learn` hub (surfaces) | Eng + UX | 1 |
| 3 | Admin Content Test Runner v1 | Eng | PRD runner spec |
| 4 | FY25/26 + 26/27 → TESTED_TRUE + episode page | Eng + Data | 3 |
| 5 | P0 bug sweep (newsletter, finish paths, auth forgot) | Eng | — |
| 6 | Merge `reform-learn` | Eng | 2 |
| 7 | Citizen impact + graph export | Eng + Content | 4 |
| 8 | Ingest 2013→2025 from CBK/Treasury | OSINT + Eng | 4 |
| 9 | Glossary + circa calendar | Content | sources JSON |
| 10 | County official + map | Data + Eng | provenance |
| 11 | Simulator + full gamification | Product | Bar A ship |
| 12 | Pre-2010 archive program | Research | long |

---

## Definition of “done” for each layer

| Layer | Done when |
|-------|-----------|
| **UI** | Surface job clear; one primary action; ≥3 visuals on year episodes |
| **UX** | Guest path works offline-capable; auth syncs; no fake progress |
| **Data** | Critical keys always resolve (API or fallback); Level-1 provenance |
| **Database** | Critical writes transactional; JSON ↔ relational integrity check green |
| **Year page** | Status ≥ `IN_APP` and runner → `TESTED_TRUE` |

---

## Quick status by persona promise

| Promise | Status |
|---------|--------|
| Free guest learning | ✅ Partial (works; polish needed) |
| Authenticated sync / XP | 🟡 Partial |
| Data never fails (critical) | 🟡 Seeds help; runner + ISR not done |
| Select any year → workshop | ❌ Only recent FYs rich; others GAP/SOURCE_LISTED |
| How budget affects citizen | ❌ Narrative blocks not productized |
| Org-grade OSINT archive | ❌ Program, not product yet |
| Admin edit + verify all copy | ❌ Spec only |

---

## Sign-off snapshot

| | Count (approx) |
|--|----------------|
| Done checklist items | ~25 |
| Partial | ~12 areas |
| Not done P0 | ~8 |
| Not done P1–P2 | ~20+ |

**Next action:** glossary + public participation hub; extract real CBK/Treasury metrics for 2013→2025 into IN_APP seeds (OSINT); optional full `reform-learn` hub rewrite PR later.
