# Admin Content Test Runner — spec sketch

**PRD ref:** §8.4 `audit/PRD-BUDGET-NDIO-STORY.md`  
**Proposed route:** `/admin/dashboard/content-lab`  
**Goal:** Editors see what data is present on citizen apps, fix it in place, and prove nothing meaningless ships.

---

## Screens

### 1. Dashboard
- Last suite run (pass/fail counts)
- Surfaces with ❌ missing required keys
- Content events in `draft` older than N days

### 2. Presence matrix
Rows = `surface.id` · Columns = required data keys  
Cell = `API` | `FALLBACK` | `MISSING` | `STALE`

### 3. Inventory
Searchable table of content events: id, surface, kind, status, updated, owner  
Click → editor drawer

### 4. Inline editor
- Copy fields: textarea + preview  
- Metrics: value + meaning + provenance picker (whitelist orgs)  
- Save → Django API → revalidate Next tags  
- “Retire” sets status retired (removes from citizen)

### 5. Run suite
Buttons:
1. **Smoke routes** — reuse `scripts/audit-page-smoke.mjs` logic server-side  
2. **Surface required-data** — fetch each surface’s keys  
3. **Link check** — internal hrefs 404 scan  
4. **Full** — all three  

Output: downloadable JSON + UI fail list with “Edit” deep links.

---

## Permissions
- `content.view_lab` — read matrix  
- `content.edit_events` — inline edit  
- `content.run_suite` — execute checks  
- `content.publish` — status → published (blocked if suite red for that surface)

---

## Acceptance (v1)
- [ ] Matrix shows learn.hub.* surfaces from YAML  
- [ ] Missing key opens editor or create form  
- [ ] Suite run completes &lt; 3 min on staging  
- [ ] Publish blocked when surface required-data fails  
- [ ] Citizen hub still serves fallbacks if Django down during edit  

---

## Implementation notes
- Prefer reading `agent/spec/surface-contracts/learn-hub.yaml` as the required-key source of truth.  
- Citizen strings gradually migrate to content events; until then runner flags hard-coded first-viewport copy via allowlist.  
- Do not use X/Twitter as provenance for metrics.
