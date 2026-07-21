# Senior engineer audit — Budget Ndio Story `/learn` & marketing

**Date:** 2026-07-21  
**Branch audited:** `feat/mobile-first-reports-redesign`  
**Evidence:** `audit/screenshots/` + production build + unit tests  
**Standards used:** Apple HIG (Clarity / Deference / Depth), Nielsen Norman heuristics, ISO 9241-210 (task-first), WCAG 2.2 AA intent

Screenshots:
- `landing-core-projects.png`
- `learn-syllabus.png`
- `learn-modules.png`
- `learn-module-read.png`

---

## Would it pass? (by category)

| Category | Verdict | Why |
|----------|---------|-----|
| **Functionality** (build / routes / buttons wired) | **Conditional PASS** | `pnpm build` succeeded. Vitest: **333 passed / 1 failed** (admin kanban timeout — unrelated to learn). Primary CTAs on Syllabus/Modules/Reader are wired (`Link` / `onSelectStage` / Next). Immersive one-question-per-page routes are **not** in this branch’s build tree (`/learn/modules/[slug]` is still a single detail view). |
| **Design (UI)** | **FAIL** | Chrome-heavy, duplicated CTAs, fake progress affordance, duplicate media, title=description, stray focus/dot artifact. Does not meet HIG *deference* or NN *aesthetic–minimalist* bar. |
| **UX** | **FAIL on `/learn`** | User’s job (“start learning Kenya’s budget”) is buried under account prompts, reports escapes, and triple progress chrome. Hierarchy answers “what can I click?” not “what should I do next?” |
| **Value attributes** (civic trust, literacy, clarity) | **PARTIAL FAIL** | Mission copy is strong; surface dilutes trust with placeholder-feeling content (same image twice, same title/description, empty progress theatre). |

**Bottom line:** Shipable as *code that compiles*. **Not** shipable as an internationally credible learning product UI until hierarchy and content hygiene are fixed.

---

## How senior engineers audit (method)

For every viewport ask:

1. **What is the user’s job right now?** (ISO 9241-210)  
2. **What is the single primary action?** (HIG deference / NN aesthetic–minimalist)  
3. **What information is necessary vs decorative?**  
4. **Does every control earn its place** (why here, why now)?  
5. **Is system status shown once**, consistently? (NN visibility of system status — *not* three times)

---

## Page-by-page: what the user sees vs why that is wrong

### 1. Landing — Core projects (`landing-core-projects.png`)

| What user sees | Why it’s there (intent) | Accredited judgment |
|----------------|-------------------------|---------------------|
| “Our Work” + “Core *projects*” | Brand section | OK hierarchy |
| Three equal cards | Showcase flagships | OK pattern |
| Card 2 & 3 **same photo** | Media CMS / copy-paste | **Rookie content bug.** Breaks trust. ISO: real evidence of work. Fix: unique image or omit until ready. |
| “Explore project →” ×3 | Deep links | OK if destinations differ and load |

**Primary fix:** unique imagery + distinct outcomes per project (not three near-identical cards).

---

### 2. Learn — Syllabus home (`learn-syllabus.png`) — worst hierarchy debt

**User job:** Start the first module (or continue).

**What they actually see (order of attention):**

1. Top chrome: logo + 5-tab pill + orphan **Reports**  
2. Hero: title + two CTAs (**Browse modules**, **Open reports**)  
3. Syllabus list with **fake ~8% bar** when progress is 0  
4. Aside: **Save your progress** (signup) stacked on **No account needed** (same message inverted)  
5. Reports again in aside  

| Control | Why is it here? | Should it be? |
|---------|-----------------|---------------|
| Pill: Syllabus / Modules / Documents / Forum / Account | Hub IA | Yes — but **Reports outside the pill** breaks Gestalt grouping |
| Hero **Browse modules** | Primary path | Yes — *one* primary |
| Hero **Open reports** | Escape to analytics product | **No on first viewport.** Reports is a different job. Move to secondary nav only. |
| Top-right **Reports** | Same escape | Redundant with hero + aside |
| Aside **Create free account** | Growth | Soft CTA OK *after* first lesson, not competing with start |
| Aside **No account needed** | Reassure | Contradicts card above; **delete** or merge into one sentence under signup |
| Progress bar at 0 shown with width | “Something is loading” theatre | **Rookie.** Code forces min visual width when `pct === 0` (`Math.max(..., 8)`). HIG: empty state should look empty. |

**Accredited rewrite of first viewport:**
- Brand + one headline + one sentence  
- One CTA: **Start: Budget Policy Statement** (deep-link step 1)  
- Syllabus list without fake bars  
- Auth aside: single soft line, not two competing cards  

---

### 3. Learn — Modules (`learn-modules.png`)

**User job:** Pick a module and start.

| What user sees | Problem |
|----------------|---------|
| CURRICULUM / Civic modules / search / All·Active·Done / All types·Budget data·Civic | Filter chrome for **one** module = tool UI before content (HIG deference fail) |
| Title **and** description both “Budget Policy Statement” | Content hygiene fail; looks unfinished |
| Huge empty right gutter | Layout assumes dense grid; one card looks broken |
| Refresh icon | Power-user; hide unless offline/error |
| Black floating dot | Likely focus/cursor/debug artifact — treat as visual defect |

**Accredited rule:** Filters appear when `n > ~6` or after search focus. For 1–3 modules, show a list/cards only + Start.

---

### 4. Learn — Module read (`learn-module-read.png`)

**User job:** Read step 1, then go to step 2 (or Watch).

**Chrome inventory (too many “status” systems):**

| Surface | Shows |
|---------|--------|
| Module context bar | Progress bar 0/2 |
| Segment + “Step 1 of 2” | Mode + step |
| Sidebar Curriculum | Highlighted step + 0/2 |
| Sidebar Progress | 0% |
| Bottom bar | Previous / Step 1 of 2 / Next |
| Mid-article SignUpCta | Account interrupt |

That is **six** progress/context channels for one step. NN: visibility of system status ≠ redundant status. HIG: chrome defers to content.

| Element | Keep? | Why |
|---------|-------|-----|
| Back: Learn / title | Yes | Wayfinding |
| Read / Watch | Yes | Mode |
| Article body | Yes | The job |
| Bottom Next | Yes | Primary forward |
| Sidebar author card | No during read | Prestige metadata; move to module cover |
| Sidebar Progress % + Curriculum + top bar + footer step | Collapse to **one** | Curriculum *or* bottom step label |
| Sign-up box mid-scroll | Defer | After step complete / mastery, not mid-paragraph |

**Boundary:** Previous disabled on step 1 — correct. Next primary — correct. Quiz absence when only Read/Watch — OK if no trivia; don’t show empty Quiz tab.

---

## Rookie mistakes (checklist from your images)

1. **Duplicate project imagery** (landing)  
2. **Duplicate CTAs for same destinations** (Reports ×3, Browse modules ×2)  
3. **Contradictory aside copy** (save progress vs no account needed)  
4. **Fake progress at 0%**  
5. **Title === description** on module card  
6. **Filter chrome before content** with tiny catalogs  
7. **Triple/sextuple progress UI** in reader  
8. **Growth CTA interrupting reading**  
9. **Orphan nav item** (Reports outside group)  
10. **Stray black dot** (visual defect / focus leak)  
11. **Empty layout waste** when grid has one item  

---

## Functionality note (honest)

- Build: **PASS**  
- Unit tests: **333/334** — fail is admin kanban timeout, not learn  
- Buttons in screenshots: primary paths are **wired** (not dead)  
- Content & IA quality: **not** at product-bar  
- Immersive “one question per page” rebuild is **not** present on this branch’s route map; reader is still `ModuleDetailView`

---

## Pass criteria to re-test later (definition of done)

**Design UI:** one composition per first viewport; no duplicate media; no fake meters; no orphan nav.  
**UX:** one primary action; progress shown once; signup after value, not before.  
**Functionality:** smoke all `/learn/*` + reader Next/Prev/Watch; no console errors.  
**Value:** every visible string earns trust (unique desc, real images, no placeholder echo).

---

## MCP / tooling status

- Screenshots stored: `korosbns/audit/screenshots/`  
- Workspace MCP config: `.cursor/mcp.json` → `shadcnspace-mcp`  
- Enable the server in Cursor MCP settings, then re-run component audits with shadcnspace + Motion skills on the redesigned learn surface.

---

## Automated surface audits (2026-07-21)

**Build:** `pnpm build` — PASS  
**Unit tests:** 333 passed / 1 failed (admin kanban timeout)

### Cross-cutting conclusions

1. **Learn** — Immersive rebuild absent on this branch. Real bugs: wrong author/module/quest hrefs; drawer can’t finish last step without quiz; no-op Continue on last passed quiz; WhatsApp/portal actions don’t open destinations; video index not reset across steps.
2. **Marketing** — Internal routes OK. Highest impact: sitewide footer newsletter form has no submit; `/learnhub` “See Report” / “See All Notifications” are no-ops; partner logos / some dropdowns fall back to `#`.
3. **Admin / auth** — Citizen login/register/verify/reset OK. Forgot-password demo form is dead. Many admin links omit `/admin` prefix; email-hooks shim missing; widespread no-op buttons on roles/users/kanban/calendar/invoice shells; all 17 `src/data/admin-*.ts` files unused.

**Priority fix order (engineering):** (1) learn completion + href bugs, (2) footer newsletter submit, (3) admin `/admin` prefix links + forgot-password, (4) learnhub placeholder CTAs.  
**Priority fix order (product UI):** hierarchy / duplicate CTA / fake progress on `/learn` (see above).
