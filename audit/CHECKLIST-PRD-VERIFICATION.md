# Checklist — PRD verification & continuous upgrade

**Use with:** `audit/PRD-BUDGET-NDIO-STORY.md`  
**Rule:** tick only with evidence (PR link, runner screenshot, smoke JSON).  
**Cadence:** before every release; after every content publish; weekly full runner.

---

## A. Planned content (nothing meaningless)

- [ ] Every new UI string has a `content_event.id` or surface data key  
- [ ] No hard-coded orphan CTAs on first viewports (Learn, Landing, Reports)  
- [ ] Seeds marked `status: seed` have owner + replace-by date  
- [ ] Retired copy removed from production (not just hidden with CSS)  
- [ ] Duplicate messages merged (e.g. signup vs “no account needed”)  

## B. Surfaces (what / why / how)

- [ ] New region has entry in `agent/spec/surface-contracts/`  
- [ ] `job` + `why` + `success.event` filled  
- [ ] ≥2 `how.variants` defined before A/B  
- [ ] `anti` list respected in UI review  
- [ ] Required `data[]` keys resolve via API **or** fallback  

## C. Learn product

- [ ] Hub: one primary CTA  
- [ ] Continue / Watch / Stories / Know-it rows (or explicit “not in this release”)  
- [ ] Module progress shown once  
- [ ] Quiz one question per beat  
- [ ] Local progress works logged-out  
- [ ] XP/progress queue syncs when online  
- [ ] Finish path works with and without trivia  
- [ ] Author / quest hrefs point at real routes  

## D. Data & provenance

- [ ] Published metrics have provenance (Treasury / Parliament / CRA / county official)  
- [ ] Learn and Reports reference same metric ids where shared  
- [ ] No illustrative county figures labeled as audited  
- [ ] Glossary terms (when shipped) cite definition source  
- [ ] Calendar events (when shipped) cite source  

## E. Admin Content Test Runner

- [ ] Runner route reachable for editors  
- [ ] Inventory lists live content events / surface fields  
- [ ] Presence matrix: ✅ API / ✅ fallback / ❌ missing  
- [ ] Failed keys are editable inline (or deep-link to editor)  
- [ ] “Run suite” executes: route smoke + required-data + link check  
- [ ] Last run stored with timestamp + fail list  
- [ ] Publish blocked when required checks fail  

## F. Automated tests

- [ ] `pnpm build` green  
- [ ] Citizen vitest green  
- [ ] `node scripts/audit-page-smoke.mjs` — public routes OK  
- [ ] Critical journeys Playwright (learn start → next step)  
- [ ] API contract smoke against bnske (or recorded fixtures)  

## G. Pages (progressive)

For each route in release scope:

| Route | What shown? | Why? | Data OK? | Motion justified? | Smoke | Owner |
|-------|-------------|------|----------|-------------------|-------|-------|
| `/learn` | | | ☐ | ☐ | ☐ | |
| `/learn/modules` | | | ☐ | ☐ | ☐ | |
| `/learn/modules/[slug]` | | | ☐ | ☐ | ☐ | |
| `/reports` | | | ☐ | ☐ | ☐ | |
| `/` | | | ☐ | ☐ | ☐ | |
| `/contact` | | | ☐ | ☐ | ☐ | |
| `/auth/*` | | | ☐ | ☐ | ☐ | |
| …add rows as upgraded… | | | ☐ | ☐ | ☐ | |

## H. Release gate (Bar A)

- [ ] PRD sections 8.1–8.4 P0 requirements met  
- [ ] This checklist A–F complete for in-scope routes  
- [ ] Progressive waves for this release ticked in `PROGRESSIVE-UPGRADE.md`  
- [ ] Known P0 bugs from senior audit closed or waived with owner  

## I. After ship (constant upgrade)

- [ ] Runner weekly job scheduled  
- [ ] Failures filed with surface id  
- [ ] Variant experiment logged (how A vs B)  
- [ ] PRD / surfaces updated if jobs change  
- [ ] Seeds refreshed from Django when API healthy  

---

## Quick commands

```bash
# Public route smoke
node scripts/audit-page-smoke.mjs https://YOUR_PREVIEW_URL

# Citizen unit tests
pnpm test:citizen

# Production build
pnpm build
```

---

## Sign-off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Product | | | |
| Eng | | | |
| Content | | | |
| QA / Runner | | | |
