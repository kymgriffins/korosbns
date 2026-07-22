# PRD — Budget Ndio Story (korosbns + bnske)

**Document id:** `PRD-BNS-2026-07`  
**Status:** draft → living (upgrade after every wave)  
**Apps:** `korosbns` (Next.js citizen + admin UI) · `bnske` (Django API / CMS)  
**Audience:** product, eng, content, auditors  
**Derived from:** session audits, surface contracts, progressive upgrade plan, auditor data vision  

---

## 1. Vision

Build the **best GenZ civic learning + budget intelligence web app for Kenya**: Moodle-structured learning that feels like a modern social media platform for public finance — articles, shorts/stories, podcasts, videos, instant graphs — where **every visible string and every number is planned, cited, and continuously verified**.

**One-liner:** *Moodle discipline + Netflix browse + Duolingo feedback + Treasury-grade numbers.*

---

## 2. Problem

1. Django on cPanel is slow → blank hubs and brittle UX if the frontend waits on every call.  
2. Pages are often designed by vibe → duplicate CTAs, fake progress, meaningless chrome.  
3. Budget data lacks a single **provenance** spine → hard to trust, hard to reuse across Learn / Reports / Video.  
4. Content edits are scattered → no admin “test runner” to see what data is live and fix it in place.  
5. Historical ambition (independence → now) is confused with product MVP → endless scope without ship gates.

---

## 3. Goals & non-goals

### Goals

| ID | Goal | Success signal |
|----|------|----------------|
| G1 | Citizen can learn Kenya’s budget without an account | Start → finish one module step offline-capable |
| G2 | Hub never blanks when Django is slow | Fallback catalogue always renders required surface data |
| G3 | Every on-screen text is a **planned content event** | No orphan copy; admin inventory matches production |
| G4 | Numbers are government-source only | Provenance row on every published metric |
| G5 | Same facts, many presentations | Learn / Reports / Graphs / News bind one fact store |
| G6 | Continuous verification | Admin test runner + automated smoke pass on every release |
| G7 | Fun with reason | Motion only when it changes knowledge or next action |

### Non-goals (this PRD phase)

- Full independence→1963 digitized archive (north-star program, separate track).  
- X.com as source of truth (distribution only).  
- Replacing Parliament/Treasury websites.  
- Building three separate databases for Learn vs Reports vs News.

---

## 4. Users

| Persona | Need |
|---------|------|
| **Youth / GenZ learner** | Short, social, checklist progress; videos & podcasts; know-what-I-know chips |
| **Civic educator / CSO** | Reliable modules, citable figures, shareable graphs |
| **Journalist / producer** | Instant charts for video; cited FY figures |
| **Public servant / partner** | SEO + professionalism; audited sources only |
| **BNS admin / editor** | See what’s live, edit copy/data easily, run verification |
| **Anonymous visitor** | Full read path; soft account for sync only |

---

## 5. Product principles (locked)

1. **Surface-first:** no UI without `surface.id` (what / why locked; how variants for A/B).  
2. **Edge-first catalogue:** Next.js ISR + JSON seeds for public learn content; Django for auth, admin, profiles, authoritative XP.  
3. **Progress is events:** UI never mutates progress; runtime events derive state.  
4. **Planned text only:** every string is a content unit (or surface field) with owner + status.  
5. **Provenance or don’t publish:** metrics without Treasury/Parliament/CRA/county official source stay `draft`.  
6. **Coexistence:** one fact store → many surfaces (Learn, Reports, Infographics, Entertainment).  
7. **True motion only:** scroll/tap/drag must change knowledge or next step.

---

## 6. Information architecture

### Citizen apps (coexisting)

| App surface | Job | Primary data |
|-------------|-----|--------------|
| `/learn` | Netflix-for-budget hub | Modules, continue, watch, stories, know-it |
| `/learn/modules/*` | Lesson runtime | Steps, video, quiz-beats |
| `/reports` | Budget brief / numbers | FY metrics + meaning lines |
| `/budgetnews` | Explainer journalism | Articles tied to cited figures |
| Marketing (`/`, about, events…) | Trust & acquisition | Planned marketing copy only |

### Admin

| Area | Job |
|------|-----|
| Content CMS | CRUD modules, articles, stories, media |
| **Content Test Runner** (new) | Inventory live strings/data; run checks; inline edit |
| Gamification | Rules, badges (authoritative) |
| Provenance desk | Attach sources to metrics |

---

## 7. Content governance — “planned events”

Nothing appears in production unless it is a **Content Event**:

```yaml
content_event:
  id: string                 # e.g. copy.learn.hub.hero.headline
  surface_id: string         # learn.hub.hero
  channel: learn|reports|news|marketing|admin_ui
  kind: copy|metric|media|cta|quiz|glossary_term|calendar_event
  body: string | structured
  status: draft|review|published|retired
  locale: en-KE
  owner: role
  updated_at: datetime
  # if kind == metric:
  provenance_id: string      # required when published
```

**Rule:** UI components may only bind to `content_event.id` or surface data keys — not hard-coded orphan marketing lines (except temporary seeds marked `status: seed` with expiry).

---

## 8. Functional requirements

### 8.1 Learn (Moodle + fun)

| Req | Description | Priority |
|-----|-------------|----------|
| L1 | Hub rows: Continue, Watch, Stories, Cast, Know-it, Numbers | P0 |
| L2 | One primary CTA on first viewport | P0 |
| L3 | Module step: one focus; progress shown once | P0 |
| L4 | Quiz: one question per page/beat | P0 |
| L5 | Local progress + XP preview; queue sync to Django | P0 |
| L6 | Stories as short-slide or story-scroll variants | P1 |
| L7 | Podcast chapter markers for long audio | P1 |
| L8 | Merge immersive routes from `reform-learn` | P1 |

### 8.2 Data resilience

| Req | Description | Priority |
|-----|-------------|----------|
| D1 | Required surface fields always resolve (API or fallback) | P0 |
| D2 | Public catalogues use ISR; not `no-store` | P0 |
| D3 | Seeds for modules, articles, stories, quests, trivia | P0 |
| D4 | Smoke script covers all public routes | P0 |

### 8.3 Budget facts & provenance

| Req | Description | Priority |
|-----|-------------|----------|
| B1 | Metric model with provenance (org, doc URL, FY, geo) | P0 |
| B2 | Sources whitelist: Treasury, Parliament, CRA/COB, official county | P0 |
| B3 | Reports + Learn bind same metric ids | P0 |
| B4 | Instant graph templates → SVG/PNG export for video | P1 |
| B5 | Glossary of budget terms with official definitions | P1 |
| B6 | Circa calendar of Kenyan budget history events | P1 |
| B7 | Expand FY coverage (modern PFM era first; independence later) | P2 |

### 8.4 Admin Content Test Runner (P0)

Admin route (proposed): `/admin/dashboard/content-lab` or `/admin/dashboard/test-runner`

| Capability | Detail |
|------------|--------|
| **Inventory** | List all published `content_event`s / surface fields currently reachable |
| **Presence matrix** | Per surface: required keys → ✅ API / ✅ fallback / ❌ missing |
| **Preview** | Render surface with live data (citizen chrome optional) |
| **Inline edit** | Edit copy/metric meaning where permissions allow; save to Django; invalidate ISR |
| **Run suite** | One-click: route smoke + surface required-data checks + broken-link scan |
| **History** | Last run timestamp, fail list, owner assigned |
| **Block publish** | Cannot set `published` if required keys fail or metric lacks provenance |

### 8.5 SEO & trust

| Req | Description | Priority |
|-----|-------------|----------|
| S1 | Metadata + JSON-LD on learn/reports/news | P0 (exists — maintain) |
| S2 | Glossary & calendar pages indexable with citations | P1 |
| S3 | Government-partner tone; no unverifiable claims | P0 |

### 8.6 Continuous upgrade loop

```
PRD / Surface → Implement variant A → Test Runner + smoke → Ship
     ↑________________________________gather events / fix fails___|
```

Every wave updates: this PRD checklist, surface YAML, runner baselines.

---

## 9. Non-functional requirements

| Area | Requirement |
|------|-------------|
| Performance | Hub TTFB usable on 3G; catalogue from edge/seed &lt; 1s perceived |
| A11y | WCAG 2.2 AA intent; reduced-motion honored |
| Security | Admin auth; no PII in public seeds; secrets never in repo |
| Reliability | Public learn available when Django 5xx (degraded but meaningful) |
| Observability | Runner results stored; citizen smoke in CI |

---

## 10. Done definitions

### Bar A — Product MVP (ship gate)

- [ ] Waves 0–6 in `audit/PROGRESSIVE-UPGRADE.md` complete  
- [ ] Surface contracts for hub + module + quiz published  
- [ ] Admin Test Runner v1: inventory + presence matrix + run suite  
- [ ] No P0 dead CTAs (footer newsletter, learn finish paths, forgot-password)  
- [ ] Smoke ≥ public routes green; citizen vitest green  
- [ ] Every Learn first-viewport string is a content event or documented seed  

### Bar B — National archive (program)

- [ ] Glossary live  
- [ ] Circa calendar (modern era complete; independence arc in progress)  
- [ ] Provenance desk used for all published metrics  
- [ ] Instant graph export used in ≥1 video workflow  
- [ ] FY coverage roadmap published with % ingested  

---

## 11. Milestones

| Milestone | Outcome |
|-----------|---------|
| M0 | PRD + checklist + surfaces (this doc) |
| M1 | Edge catalogue + hub surfaces Wave 1–2 |
| M2 | Admin Test Runner v1 |
| M3 | Content events for learn + marketing critical paths |
| M4 | Provenance + graph export v1 |
| M5 | Glossary + circa calendar v1 |
| M6 | Bar A launch review |

---

## 12. Risks

| Risk | Mitigation |
|------|------------|
| Scope conflates Bar A and Bar B | Separate checklists; Bar B never blocks Bar A ship |
| Editors bypass runner | Publish gate in admin |
| Seeds drift from Django | Runner diffs seed vs API; weekly job |
| cPanel downtime | Edge-first + queues |
| Orphan demo routes (`blog-01`…) | Retire or noindex; not in IA |

---

## 13. References

- `audit/PROGRESSIVE-UPGRADE.md`  
- `audit/SENIOR-DESIGN-AUDIT.md`  
- `agent/spec/surface-contracts/*`  
- `bnske.budgetndiostory.org/DATA_PROVENANCE_RULE.md`  
- Agent LJP backlog `agent/spec/backlog/*`  

---

## 14. Open decisions (need owner)

1. Content Event storage: Django model vs headless CMS vs JSON+admin overlay?  
2. Test Runner edit: Django admin API only vs Next server actions?  
3. Bar A launch date / partner demo date?  
4. Which FY set is “must publish” for launch (e.g. 2022/23–2026/27)?  
