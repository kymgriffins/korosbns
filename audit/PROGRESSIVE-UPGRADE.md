# Progressive app upgrade program (korosbns)

**Goal:** Every page is tested, designed, meaningful, and resilient when Django (bnske / cPanel) is slow.  
**Rule:** Next.js owns public catalogue + experience; Django owns auth, admin, profiles, authoritative points.  
**Design logic:** Every region is a **Surface** (`agent/spec/surface-contracts/`) — lock **what/why**, swap **how** variants for tests (Moodle structure, fun motion, Kenya budget data).  
**PRD:** [`PRD-BUDGET-NDIO-STORY.md`](./PRD-BUDGET-NDIO-STORY.md) · [`PRD-LMS-BUDGET-HUB.md`](./PRD-LMS-BUDGET-HUB.md) · **Tasklist:** [`TASKLIST-DONE-TODO.md`](./TASKLIST-DONE-TODO.md) · **Checklist:** [`CHECKLIST-PRD-VERIFICATION.md`](./CHECKLIST-PRD-VERIFICATION.md) · [`CHECKLIST-BUDGET-YEARS.md`](./CHECKLIST-BUDGET-YEARS.md) · **Admin runner:** [`ADMIN-CONTENT-TEST-RUNNER.md`](./ADMIN-CONTENT-TEST-RUNNER.md) · **Sources:** [`data/budget-sources.json`](./data/budget-sources.json)

**Active branch (this workstream):** `feat/mobile-first-reports-redesign` → merge to `main` via PR when green.  
**Immersive learn (prior session):** already on remote `reform-learn` — merge in **Wave L2** after edge catalogue.

---

## Waves (do in order)

### Wave 0 — Branch hygiene (now)
- [x] Fetch remotes; align feature branch with `korosbns/main`
- [x] Commit agent contracts + audit evidence + smoke script
- [ ] Open/update PR; keep `reform-learn` until merged into main
- [ ] Do **not** commit demo shadcn routes (`blog-01`, `footer-02`, …) or unused `src/data/admin-*.ts`

### Wave 1 — Edge-first data (never blank)
- Seed `stories` / `quests` / `trivia` JSON fallbacks (same pattern as `civic-modules.json`)
- SSR-hydrate `/learn` hub rows; public GETs use ISR, not `cache: no-store`
- Wire progress/XP queues on lesson complete (local first → sync)
- Smoke: `node scripts/audit-page-smoke.mjs`

### Wave 2 — Learn hub = Netflix-for-budget (LJP-005 / LJP-006)
- Rows: Continue · Watch · Stories/shorts · Cast/panel · Know-it checklist · Numbers
- First viewport: one primary CTA; no duplicate Reports/signup chrome
- Content formats: tiles, scroll-stories, slides, tables-as-reveals

### Wave L2 — Bring `reform-learn` immersive routes
- Merge `reform-learn` (read/watch/quiz-per-page) onto upgraded hub
- Fix drawer finish / Continue no-op / author href bugs from audit

### Wave 3 — Marketing progressive upgrade
| Priority | Route | Fix focus |
|----------|-------|-----------|
| P0 | Footer sitewide | Newsletter `onSubmit` |
| P0 | `/contact` | Motion visibility (done on related commits — re-verify) |
| P1 | `/` landing | Unique project images; hero budget |
| P1 | `/learnhub` | Wire or remove no-op See Report / notifications |
| P2 | `/about`, `/team`, `/events`, `/faq`, `/reports` | One job per section; motion with reason |

### Wave 4 — Auth + citizen
- Fix `/auth/forgot-password` (wire API or redirect to working reset)
- Login/register/verify already OK — add smoke coverage only

### Wave 5 — Admin (prefix + no-ops)
- Fix bare `/dashboard/*` → `/admin/dashboard/*`
- email-hooks shim; kill or wire no-op shell buttons
- Leave unused `admin-*.ts` out of main until imported

### Wave 6 — Quality gate (every page)
For each route before “done”:
1. **What is displayed?** (one job)
2. **Why here?** (primary action earns the pixel)
3. **Data?** (fallback if Django slow)
4. **Emotion?** (scroll/tap changes knowledge or next step — else no motion)
5. Smoke HTTP + critical button click path
6. Matches `agent/spec` DoD when learn-related

---

## Branch map (session work)

| Branch | Status | Contains |
|--------|--------|----------|
| `main` | remote tip | PR #59 high-standard civic app |
| `feat/mobile-first-reports-redesign` | active | reports mobile-first + this audit/agent commit |
| `reform-learn` | remote, not in main | Apple HIG immersive + learn-ui-primitives |
| `feat/high-standard-civic-app` | merged via #59 | learn width/scroll/auth aside fixes |

---

## Definition of “logics handled”

- Public learn content: never empty shell when API fails  
- Progress: event-derived (progress contract); UI does not mutate  
- Auth/admin/profile: Django source of truth  
- Points: local preview + queue; authoritative after sync  
- No dead primary CTAs on upgraded pages  
