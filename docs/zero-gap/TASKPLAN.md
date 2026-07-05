# Korosbns Zero-Gap Upgrade Task Plan

**Branch:** `feat/zero-gap-upgrade`  
**Framework:** [GOLDRULES/MASTER-FRAMEWORK.md](../../GOLDRULES/MASTER-FRAMEWORK.md)  
**Status:** Active · **App version target:** `0.1.0` → `0.2.0` (foundation) → `0.3.0` (P0 surfaces) → `0.4.0` (full gate compliance on core routes)

This plan turns the GOLDRULES audit into a **continuous upgrade program**. Every sprint ships user-visible fixes **and** structural debt reduction. Nothing merges without passing the mechanical audit script and the relevant page checklist.

---

## North-star outcomes

1. **Zero-Gap process** — PRD → page inventory → page spec → build → QA checklist for all **P0+** routes before feature work.
2. **Layer separation** — UI, data fetching, and business logic never live in the same file (see [LAYER-CONVENTIONS.md](./LAYER-CONVENTIONS.md)).
3. **Scalable patterns** — Reusable compositions in `src/components/patterns/`; APIs in `src/lib/` and `src/data/`; hooks in `src/hooks/`.
4. **Token + motion discipline** — Semantic Tailwind only; motion via `src/motion/motion-tokens.ts`.
5. **All pages** — loading, empty, error, populated (and permission-denied where applicable) on every async surface.

---

## Version milestones

| Version | Theme | Ship criteria |
|---------|--------|----------------|
| **0.2.0** | Foundation | Docs, lint script, layer conventions, pattern dir, motion tokens, CI hook |
| **0.3.0** | P0 surfaces | Task + Learn + Auth pass Gate 5 checklist; mobile-first task detail merged |
| **0.4.0** | P1 surfaces | Marketing home + weekly notes + admin task hub compliant |
| **0.5.0** | Scale learn | Dynamic stage counts; API-only learn data; no hardcoded `8` |
| **0.6.0** | Admin trim | Legacy `*-v1` routes deprecated or checklist-complete |
| **1.0.0** | Zero-Gap core | All P0–P1 routes have signed page specs + green checklists |

Track progress in [UPGRADE-LOG.md](./UPGRADE-LOG.md).

---

## Priority tiers (page inventory)

| Tier | Scope | Count (approx) |
|------|--------|----------------|
| **P0** | Daily user value — must spec + fix first | ~15 routes |
| **P1** | High traffic marketing + content | ~25 routes |
| **P2** | Admin dashboard (non-template) | ~20 routes |
| **P3** | Legacy templates, demos, `*-v1` | Defer or remove |

Full inventory: [PAGE-INVENTORY.md](./PAGE-INVENTORY.md).

---

## Phase 0 — Foundation (v0.2.0)

**Goal:** Tooling and conventions so every later PR is measurable.

| ID | Task | Owner | Done when |
|----|------|-------|-----------|
| 0.1 | Branch `feat/zero-gap-upgrade` + this task plan | — | ✓ |
| 0.2 | [LAYER-CONVENTIONS.md](./LAYER-CONVENTIONS.md) adopted in PR template | Eng | Doc merged; PRs reference it |
| 0.3 | `scripts/goldrules-audit.mjs` + `pnpm goldrules:audit` | Eng | Script runs in CI (warn → fail over time) |
| 0.4 | `src/motion/motion-tokens.ts` maps GOLDRULES §5 tokens | Eng | No new inline `duration:` outside motion/ |
| 0.5 | `src/components/patterns/` README + first 3 patterns | Eng | EmptyStateShell, PageChrome, AsyncListShell |
| 0.6 | Copy GOLDRULES templates → `docs/zero-gap/templates/` | Eng | PRD + PAGE-SPEC + CHECKLIST local copies |
| 0.7 | `pnpm goldrules:audit` in GitHub Actions (non-blocking) | Eng | Workflow green |
| 0.8 | Bump `package.json` to `0.2.0`; log in UPGRADE-LOG | Eng | Version committed |

---

## Phase 1 — Process gates (parallel with Phase 2)

**Goal:** Gates 1–3 exist for P0 before more P0 UI work.

| ID | Task | Done when |
|----|------|-----------|
| 1.1 | PRD: **Task workspace** (`docs/zero-gap/prd/task-workspace.md`) | Approved; page inventory complete |
| 1.2 | PRD: **Learn hub** (`docs/zero-gap/prd/learn-hub.md`) | Approved; references production-audit fixes |
| 1.3 | PRD: **Citizen auth** (`docs/zero-gap/prd/citizen-auth.md`) | Approved |
| 1.4 | Page specs for all P0 routes (one file per page under `docs/zero-gap/specs/`) | Every mandatory field filled |
| 1.5 | Retro-spec existing P0 pages (document current vs target) | Gap list per page |

---

## Phase 2 — P0 UI/UX + architecture (v0.3.0)

### 2A — Tasks (`/admin/dashboard/task/*`)

| ID | Task | Layer | GOLDRULES |
|----|------|-------|-----------|
| 2A.1 | Merge mobile-first task `[id]` (editor first, mobile chrome) | UI | §8 responsive |
| 2A.2 | Extract `task-form` → `useTaskForm` hook + zod schema in `src/lib/task-schema.ts` | Data/logic | §4 forms |
| 2A.3 | `TaskFormView` presentational; page only wires hook | UI | Layer separation |
| 2A.4 | Board/list/tiles: `AsyncListShell` pattern (loading/empty/error) | UI | §4 async lists |
| 2A.5 | Gate 5 checklist signed for task list, detail, new | QA | COMPONENT-CHECKLIST |
| 2A.6 | Remove inline `style={{}}` from task components | UI | §7 |
| 2A.7 | Subtask roster templates (feat branch) merge if not on main | Feature | PRD trace |

### 2B — Learn (`/learn/*`)

| ID | Task | Layer | GOLDRULES |
|----|------|-------|-----------|
| 2B.1 | Replace hardcoded `8` with API-driven counts | Data | production-audit |
| 2B.2 | Remove silent `STAGES_DATA` fallback → explicit empty/error | UI | §3 states |
| 2B.3 | Split `learn-hub.ts` / `learn-data.ts` from view components | Data | Layer separation |
| 2B.4 | `useLearnProgress` hook; views consume only | Logic | Scalable |
| 2B.5 | Reduced motion on Chamber animations | Motion | §5 |
| 2B.6 | Gate 5 checklist: learn dashboard, module reader, profile | QA | COMPONENT-CHECKLIST |

### 2C — Auth (`/auth/*`)

| ID | Task | Layer | GOLDRULES |
|----|------|-------|-----------|
| 2C.1 | All auth forms: rhf + zod + shadcn Form (register/login/reset) | UI | §4 |
| 2C.2 | Validation + network error states per page spec | UI | §3 |
| 2C.3 | Gate 5 checklist for login, register | QA | COMPONENT-CHECKLIST |

**v0.3.0 release:** P0 checklists green; `goldrules:audit` error budget &lt; baseline.

---

## Phase 3 — Design system debt (v0.3.x → v0.4.0)

| ID | Task | Scope |
|----|------|--------|
| 3.1 | Exception log for arbitrary Tailwind (`docs/zero-gap/TOKEN-EXCEPTIONS.md`) | Eng |
| 3.2 | Migrate `text-[10px]` / `tracking-[0.14em]` to semantic text utilities in P0 | UI |
| 3.3 | Replace raw `bg-blue-*` / `text-gray-*` in P0/P1 with semantic tokens | UI |
| 3.4 | Eliminate inline `style={{}}` in P0 files (40 → 0 on P0) | UI |
| 3.5 | Marketing motion: import from `motion-tokens.ts` only | Motion |
| 3.6 | `useReducedMotion` wrapper in `src/motion/hooks.ts`; apply to all animated P1 components | A11y |

---

## Phase 4 — P1 pages (v0.4.0)

| Area | Routes | Tasks |
|------|--------|-------|
| Marketing | `/`, `/about`, `/events` | Page specs → responsive sm–xl → checklist |
| Budget news | `/budgetnews/*` | Data in `lib/budget-report-data.ts`; UI thin |
| Weekly notes | `/weekly-notes/*` | States + export flows |
| Learn forum | `/learn/forum` | AsyncListShell + composer separation |
| Reports | `/reports` | Align with reports-api layer |

Each P1 page PR must include: spec link, checklist diff, `goldrules:audit` delta.

---

## Phase 5 — Learn scale (v0.5.0)

From [production-audit.md](../production-audit.md):

| ID | Task |
|----|------|
| 5.1 | Lift civic modules into `LearnContext` (dynamic stage list) |
| 5.2 | Single localStorage blob per module (not key explosion) |
| 5.3 | Sync `currentStep` drawer ↔ context |
| 5.4 | Content out of client bundle → API/CDN |
| 5.5 | Unified `CivicModule` + `LearningUnit` model in `src/types/learn.ts` |

---

## Phase 6 — Admin consolidation (v0.6.0)

| ID | Task |
|----|------|
| 6.1 | Audit admin routes: mark **ship** vs **hide** vs **delete** |
| 6.2 | Deprecate `(legacy)/*-v1` with redirects or removal |
| 6.3 | Template dashboards (ecommerce, logistics, CRM clone): hide from nav unless PRD exists |
| 6.4 | Real admin features only: task, users, content, communication, budget-data |

---

## Phase 7 — Continuous upgrade (every sprint)

**Standing rules for all PRs on this branch (and after merge to main):**

1. **No page-only PR** without spec update or explicit “spec N/A” in PRD exceptions.
2. **File placement:**
   - `src/app/**/page.tsx` — route shell only (&lt; 80 lines target)
   - `src/features/<domain>/` — feature UI composed of patterns
   - `src/lib/` + `src/data/` — API clients, transforms, static JSON
   - `src/hooks/` — stateful logic
3. Run `pnpm goldrules:audit` locally before push.
4. Bump patch version for user-visible fixes; minor for phase completion.
5. Update [UPGRADE-LOG.md](./UPGRADE-LOG.md) each release.

**Sprint cadence (suggested):**

| Week | Focus |
|------|--------|
| 1 | Phase 0 + Phase 1 PRDs |
| 2 | Phase 2A Tasks |
| 3 | Phase 2B Learn (partial) + 2C Auth |
| 4 | Phase 2B complete + v0.3.0 |
| 5–6 | Phase 3 + Phase 4 P1 (batch 1) |
| 7+ | Phase 5–6 as capacity allows |

---

## Mechanical audit thresholds (ratchet)

`pnpm goldrules:audit` tracks:

| Metric | Baseline (v0.2.0) | Target v0.3.0 | Target v0.4.0 |
|--------|-------------------|---------------|---------------|
| Inline `style={{}}` in `src/` | ~40 files | ≤ 20 | ≤ 5 |
| Arbitrary `[Npx]` in feature code | high | −30% | −60% |
| Raw palette classes | ~30 files | ≤ 15 | ≤ 5 |
| Forms without rhf on P0 | 3+ | 0 | 0 |
| P0 pages with signed checklist | 0 | 15 | 15 |
| P1 pages with signed checklist | 0 | 0 | 25 |

---

## Risk register

| Risk | Mitigation |
|------|------------|
| Scope creep (160 routes) | Strict P0→P1→P2; no P3 unless PRD |
| Breaking learn progress | Feature flag + migration for localStorage |
| Stash/mobile task work diverged | Merge `feat/task-subtask-roster` + mobile fix early in 2A |
| Monorepo apps (`apps/admin`, `apps/budgethub`) | Phase 8 (post-1.0): align or document as out of scope |

---

## Phase 8 — Monorepo alignment (post-1.0)

| ID | Task |
|----|------|
| 8.1 | Single source for task/learn components (main `src/` vs `apps/*`) |
| 8.2 | Shared `packages/ui-patterns` if duplication persists |
| 8.3 | Turborepo task graph for `goldrules:audit` on all apps |

---

## Quick links

- [LAYER-CONVENTIONS.md](./LAYER-CONVENTIONS.md)
- [PAGE-INVENTORY.md](./PAGE-INVENTORY.md)
- [UPGRADE-LOG.md](./UPGRADE-LOG.md)
- [TOKEN-EXCEPTIONS.md](./TOKEN-EXCEPTIONS.md)
- [templates/](./templates/) — PRD, page spec, checklist copies

**Next action:** Complete Phase 0 tasks 0.3–0.8, then start PRD 1.1 (Task workspace).
