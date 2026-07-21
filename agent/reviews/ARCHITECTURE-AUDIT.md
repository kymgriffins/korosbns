# Architecture Audit — Living Baseline

```yaml
document: ARCHITECTURE-AUDIT
status: living_baseline
version: 1.2.0
date: 2026-07-08
runtime_stage: draft
pending: gate_1_human_walkthrough
platform_version: "3.1"
baseline_frozen: "1.0"
platform_evolution: stopped
product_delivery: active
knowledge_layer: living
scope: Learning Journey Platform + Specification Driven Platform
verdict: constitution_frozen_knowledge_living_product_continuous
guiding_principle: prove_the_architecture
phase_dod: build_evidence
rule_of_three: active
kpi_platform_stability: 0
kpi_constitution_exceptions: 0
platform_validation_review: after_CAP-010
```

> **Purpose.** Living architectural baseline (**Knowledge** — may update).  
> **Constitution:** [PLATFORM.md](../PLATFORM.md) — **FROZEN**.  
> **Ledger:** [capability-ledger.yaml](../runtime/capability-ledger.yaml) — Knowledge.  
> **Post–CAP-010:** [PLATFORM-VALIDATION-REVIEW.md](./PLATFORM-VALIDATION-REVIEW.md)

```
Constitution  FROZEN
Knowledge     LIVING
Product       CONTINUOUS
```

**Boundary crossed:** designing the engineering system → **using** it.  
**Phase DoD:** Build evidence. Do not reopen Baseline until CAP-010 Platform Validation Review.

---

## Executive Summary

**Product:** Budget Ndio Story **Learn** — a mobile-first civic **Learning Journey Platform**, not a traditional LMS.

**Problem:** Civic budget literacy needs distraction-free, journey-shaped learning — not course catalogs that behave like dashboards.

**Users:** Kenyan civic learners (primary); facilitators and partners (secondary).

**Primary journey:** Open lesson → watch → checkpoint / trivia → reflection → continue → progress unlocks next lesson.

**Platform status:** Specification-driven foundation is coherent. Learning Shell, Learning Runtime, and Learning Experience prove composition. Runtime remains **`draft`** until Gate 1 (human walkthrough) certifies experience validation; only then may the platform promote to **`validated`** and make the first implementation commits.

### Maturity (revised)

| Lens | Score | Interpretation |
|------|------:|----------------|
| **Platform Architecture** | **9.2 / 10** | Spec → contracts → shell → event-sourced runtime → vertical slice |
| **Product Completeness** | **5.5 / 10** | By design — hubs and advanced capabilities intentionally deferred |
| **Overall Project Maturity** | **8.5 / 10** | Engineering platform maturity, not feature count |

Feature absences (AI Tutor, analytics, offline, multi-tenancy) do **not** reduce architecture scores when the foundation was designed to support them later.

---

## Product Identity

We build a **Learning Journey Platform** — not an LMS.

This distinction must appear in every architectural document, capability review, and UI critique:

| LMS default | LJP identity |
|-------------|--------------|
| Sidebars and dense chrome | Zero desktop sidebar; immersive lesson |
| Multi-CTA dashboards | ≤2 decisions per viewport |
| Screen-owned progress | Runtime-owned, event-derived progress |
| Features before contracts | Contracts before components |
| Docs as afterthought | Specifications as first-class citizens |

---

## Specification-First Evolution

```
Experience Principles
        ↓
Design DNA
        ↓
Product Architecture + Information Architecture
        ↓
Navigation Laws
        ↓
Layout Blueprints
        ↓
Screen Contracts + Component Contracts
        ↓
Engineering Architecture
        ↓
Agentic Development Operating System (ADOS)
        ↓
Specification Driven Platform (SDP)
        ↓
Knowledge Graph (foundation → transitional authority)
        ↓
Learning Shell
        ↓
Learning Runtime
        ↓
Learning Experience (first vertical slice)
        ↓
Current State (draft · Gate 1 pending)
```

Each layer exists to remove a class of failure: experience ambiguity, visual drift, navigation invention, layout improvisation, agent freelancing, untraceable code, and UI becoming a second source of truth.

---

# Architectural Invariants

**Non-negotiable.** Violation is an architecture fail — not a style preference.

```
1. No desktop sidebar in /learn.
2. Learning Runtime owns journey state.
3. UI never mutates progress directly.
4. Events are append-only.
5. Specifications precede implementation.
6. Contracts precede components.
7. Traceability is mandatory (REQ → contract → capability → code → test → evidence).
8. Learning Experience remains immersive (lesson routes: bottom nav hidden).
9. No second source of truth — UI observes; runtime decides.
10. Every capability must produce evidence (review + observability).
```

Additional derived invariants:

- Black (foreground) primary CTAs in learn scope — not marketing blue.
- Builder does not edit `agent/spec/` under execution lock.
- Runtime is not `validated` until Shell + Runtime + Experience compose successfully.
- Prefer evolution over replacement — do not rewrite solved layers.

---

# Platform vs Product

These evolve **independently**. Product features consume platform; they must not redesign it.

```
PLATFORM                         PRODUCT
─────────                        ───────
SDP / ADOS                       Learning Shell
Knowledge Graph                  Learning Experience
Learning Runtime                 Course Detail
Execution (queue/state)          Home Continue
Traceability / Promotion         Catalogue · Progress
Experience Replay (API)          Achievements · Profile · Search
                                 (future: AI Tutor · Certificates · …)
```

| Change type | Allowed when |
|-------------|--------------|
| Platform change | Requires ADR + contract bump + promotion awareness |
| Product vertical slice | Must reuse shell + runtime + contracts; no new truth source |

---

# Current State

## Runtime promotion

```
draft  ──(Gate 1 human PASS)──►  validated  ──►  three commits  ──►  reference
```

| Stage | Status |
|-------|--------|
| learning_shell_complete | Achieved |
| learning_runtime_complete | Achieved |
| learning_experience_complete | Achieved (capability) |
| validated | **Blocked** — `pending: gate_1_human_walkthrough` |
| First commits | Deferred until validated |

Sources: `agent/runtime/state.yaml`, `agent/runtime/promotion.md`, `agent/reviews/LJP-003-validation.md`.

## Vertical Slice Index

```
Foundation (docs + SDP)     ██████████
Learning Shell (001)        ██████████
Learning Runtime (002)      ██████████
Learning Experience (003)   ██████████  (Gate 1 open)
Course Detail (004)         ██░░░░░░░░  (wired; review pending)
Home Continue (005)         ███░░░░░░░  (wired; review pending)
Catalogue (006)             ██░░░░░░░░
Progress (007)              █░░░░░░░░░
Achievements (008)          █░░░░░░░░░
Profile (009)               █░░░░░░░░░
Search (010)                █░░░░░░░░░
```

## Capability board

| ID | Capability | Status | Note |
|----|------------|--------|------|
| LJP-001 | Learning Shell | Complete | Review PASS |
| LJP-002 | Learning Runtime | Complete | Event-sourced; runtime DoD tested |
| LJP-003 | Learning Experience | Complete* | Validation CONDITIONAL_PASS — Gate 1 |
| LJP-004 | Course Detail | Wired | Hero 60/40 + accordion; backlog pending |
| LJP-005 | Home Continue | Wired | ContinueCard → active lesson |
| LJP-006–010 | Hubs | Pending | Draft routes; not contract-complete |

---

# Validated Capabilities

Proven through implementation + evidence (not only documentation).

### Learning Shell (LJP-001)

- Hub / immersive / account shell modes via `resolveShellMode`
- Top nav + bottom nav (immersive hides bottom nav)
- Toast / dialog / bottom-sheet host layers
- No `/learn` sidebar
- Providers: motion (reduced-motion), error boundary, runtime provider

### Learning Runtime (LJP-002)

- Append-only event log; `dispatch` → persist → notify
- Derived session, progress, lesson phase, timeline
- Session hydrate / replay / recoverable
- Journey side effects: `ContinuePressed` → `PartAdvanced` | `LessonCompleted`
- Public continue resolution: `resolveContinueLesson` / `resolveActiveCourse`

### Learning Experience (LJP-003)

- Canonical journey test (`lesson-journey.test.ts`)
- UI observes `deriveLessonExperience`; no `setLessonCompleted`
- Video → Trivia → Reflection → Continue → LessonCompleted → next lesson
- Experience Replay API: `formatExperienceReplay`

---

# Architecture Drift

SDP health metric: distance between specification and implementation.

```
Specification  →  Contracts  →  Implementation  →  Current Code
```

| Drift band | Meaning | Action |
|------------|---------|--------|
| ~0% | Spec and code aligned | Maintain |
| ≤5% | Acceptable | Log in retrospective |
| ~15% | Needs review | Capability review + memory update |
| ≥30% | Architecture degraded | STOP — amend contracts / ADR before features |

### Experience Drift (parallel — RX-001)

A screen can satisfy contracts and still fail the learner. Track per Capability Validation via `visual-acceptance.yaml`:

```yaml
experience_drift:
  visual_noise: low
  competing_actions: "<= 2"
  cognitive_load: within_budget
  primary_focus: obvious_under_3_seconds
  brand_recognition: passes_family_test  # FT1–FT5
  civic_warmth: present
  learner_feel: matches_phase
```

Experience Drift is **Knowledge** (living). It does not amend the constitution — it records whether RX-001 feeling still holds.

### Current estimated drift (Jul 2026)

| Area | Drift | Notes |
|------|------:|-------|
| Shell vs contracts | ~5% | Complete; deprecated re-exports linger |
| Runtime vs runtime-contracts | ~5% | Solid; dual `PartAdvanced` path is a rule gap |
| Experience vs journey-contract | ~10% | Gate 1 open; hydration fragility |
| Course/Home vs backlog | ~15% | Code ahead of reviews/backlog status |
| Knowledge Graph authority | Transitional | Expected milestone — see below |
| Progress display | ~15% | Catalog `getCompletedLessonsCount` vs runtime progress |
| E2E vs SDP lesson tree | ~20% | Playwright still emphasizes `/learn/paths` |

**Overall critical-path drift:** approximately **8–12%** — acceptable for draft, unacceptable to ignore after `validated`.

Update this section after every capability retrospective.

---

# Transitional Areas

Intentionally evolving — **not** framed as authenticity failures.

### Knowledge Graph authority

**Current (transitional):**

```
Markdown (docs/)  →  Graph seeds (YAML + graph-data.ts)  →  Code
```

**Target (SDP 3.0 complete):**

```
Graph (authoritative)  →  Markdown views  →  Code
```

Wording: **Knowledge Graph Authority is transitional**, not “low authenticity.”

Machine query today: `src/lib/sdp/query.ts` over `graph-data.ts`.  
Human REQ catalog: `agent/graph/requirements.yaml`.  
Missing on disk: `entities.yaml` / `relationships.yaml` (listed in graph README).  
Roadmap: sync script YAML → `graph-data.ts`; generate markdown from graph.

### Dual progress display

Static catalog completion helpers still feed some progress bars while journey completion is runtime-derived. Transitional until product surfaces bind exclusively to `state.progress`.

### Dual `PartAdvanced` entry

Continue path: runtime-owned via `deriveContinueSideEffects`.  
Part picker: UI still dispatches `PartAdvanced` directly. Must converge on one ownership rule before `reference` stage.

### Release gate

Shell / runtime / experience exist in the working tree but first implementation commits wait on `validated`. Uncommitted validated layers are a **risk of knowledge loss**, not an invitation to skip Gate 1.

---

# Technical Readiness

Actionable readiness for extension — independent of product completeness.

| Area | Ready | Why |
|------|:-----:|-----|
| Additional lessons | ✅ | Catalog + lesson journey + runtime |
| Additional modules | ✅ | Module accordion + unlock helpers |
| Additional courses | ✅ | Course hero + continue resolution + static catalog pattern |
| Certificates | 🟢 | Progress events exist; UI/capability not started |
| Multi-language | 🟢 | Content separation possible; i18n stack not LJP-gated |
| AI Tutor | 🟡 | Event stream is the extension point; no tutor contracts yet |
| Analytics | 🟡 | Timeline / Experience Replay API; no analytics sink |
| Offline | 🟡 | Hydrate + replay exist; sync protocol missing |
| Adaptive learning | 🟡 | Replay + derived state ready; policy layer missing |
| Multi-tenancy | 🔴 | Local session singleton; no tenant partition |

Legend: ✅ ready now · 🟢 feasible soon · 🟡 architecture ready, product unfinished · 🔴 requires platform work

---

# Repository Map (responsibility)

| Area | Responsibility |
|------|----------------|
| `docs/` | Human product + engineering law (~65 files) |
| `agent/spec/` | Immutable ADOS intent (capabilities, backlog, journey/runtime contracts) |
| `agent/runtime/` | Mutable queue, state, promotion, observability |
| `agent/graph/` | REQ catalog + intended machine graph |
| `agent/reviews/` | Evidence packages + **this baseline** |
| `src/lib/sdp/` | Query engine + graph-data (orchestration authority today) |
| `src/lib/learning-runtime/` | Event store, reducer, journey effects, continue, experience derive |
| `src/components/lms/shell/` | Learning Shell composition |
| `src/components/lms/lesson/` | Learning Experience vertical slice |
| `src/components/lms/course/`, `home/` | Course Detail / Home Continue (wired) |
| `src/data/lms/` | Catalog, routes, types |
| `src/styles/lms.css` + tokens | Design DNA in code |

---

# Layer Audits (concise evidence)

### Specification layer

Complete for critical path: Experience Principles, Design DNA, Navigation Laws, Blueprints, Screen/Component contracts, Engineering principles, Runtime + Journey contracts, Definition of Done, Decision log.  
Partial: Knowledge Graph YAML completeness; some component contracts still ahead of hubs.

### SDP lifecycle

| Stage | Present? |
|-------|----------|
| Specification | Yes |
| Planning / Queue | Yes |
| Execution | Yes |
| Verification | Yes (001–003) |
| Review / Retrospective | Partial (004+) |
| Traceability | Partial / transitional graph |
| Promotion | Blocked on Gate 1 |
| Release | Deferred |

**SDP is functioning as a discipline.** It has not yet crossed `validated`.

### Learning Shell

Reusable. Modes hub / immersive / account. Layers correct. No learn sidebar.

### Learning Runtime

Sole owner of journey progress via events. Session, phase, timeline derived. Persist in sessionStorage (local).

### Event system

Events: `LessonOpened`, `SessionStarted`, `VideoStarted`, `VideoPaused`, `VideoCompleted`, `TriviaOpened`, `TriviaAnswered`, `ReflectionSaved`, `ContinuePressed`, `LessonCompleted`, `PartAdvanced`.  
No UI `setLessonCompleted`. Append-only log + reducer.

### Learning Experience

Journey runtime-driven for completion. Hydration risk documented in validation review. Resume button removed from LessonHero (validation note may lag code).

### Design / Motion / A11y / Performance

Design DNA applied via tokens + `ljp-btn-primary`; legacy drafts still coexist. Motion: reduced-motion via MotionConfig; Continue / accordion motion present. A11y: shell landmarks and trivia portal patterns exist; full WCAG audit still open. Performance: production build passes; experience metrics design-targets only; DebugLogPanel hydration remains a P0 ops risk for local validation.

### Testing

| Type | Status |
|------|--------|
| Runtime unit / journey | Present (~9 runtime + continue tests) |
| Shell mode unit | Present |
| SDP query | Present |
| Playwright SDP lesson journey | Missing (legacy `/learn/paths` e2e exists) |
| Architecture tests | Partial |

### Traceability sample

| Behavior | REQ | Contract | Test | Evidence |
|----------|-----|----------|------|----------|
| Lesson open | REQ-0200 | lesson-journey | lesson-journey.test.ts | LJP-003 review |
| Trivia block | REQ-0088 | trivia_popup | journey test | trivia-sheet (lesson/) |
| Continue | REQ-0021 | continue_button | journey test | continue-button.tsx |
| Lesson complete | REQ-0105 | progress | journey + effects | journey-effects.ts |

Broken / weak chains: hubs without evidence reviews; catalog progress bars not REQ-traced to runtime progress.

---

# Technical Debt (ranked)

| Severity | Issue | Why |
|----------|-------|-----|
| P0 | Gate 1 unsigned · stage stays draft | Promotion / commits / trust block |
| P0 | DebugLogPanel hydration can blank lesson DOM | Blocks truthful experience validation |
| P1 | Dual progress sources | Second source of truth risk |
| P1 | Dual PartAdvanced ownership | Journey purity erosion |
| P1 | Graph authority transitional unfinished | Traceability at build time incomplete |
| P2 | Legacy LMS draft components | Drift / wrong imports |
| P2 | Deprecated `lms-page` imports | DX / path confusion |
| P2 | E2E not on SDP lesson tree | Gate automation gap |

Prefer evolution: gate or remove DebugLogPanel on learn; bind progress UI to runtime; fix PartAdvanced rule; sync graph; delete unused drafts; add Playwright lesson journey.

---

# Detailed Maturity (platform-weighted)

| Area | Score | Note |
|------|------:|------|
| Experience Architecture | 9.2 | Journey law + immersive lesson |
| Design System | 8.8 | Tokens + black CTA; cleanup remaining |
| Product Architecture | 9.0 | LJP identity clear |
| Engineering Architecture | 9.3 | Shell / runtime / experience compose |
| Specification System | 9.7 | Spec-first stack is the product’s strength |
| Runtime Architecture | 9.1 | Event-sourced; local persistence only |
| Traceability | 9.4 | Provenance + REQs; graph sync open |
| Documentation | 9.8 | docs/ + agent/ unmatched for most apps |
| Knowledge Graph | 7.8 | Transitional authority — milestone, not failure |
| Testing | 8.3 | Strong unit/journey; weak SDP e2e |
| Performance | 8.2 | Build green; production RUM pending |
| Accessibility | 8.6 | Solid shell patterns; full audit open |
| Feature Completeness | 5.4 | By design |

**Do not average feature completeness into platform architecture.** That confuses “haven’t built yet” with “can’t build on this.”

---

# Future Evolution

Nothing here replaces architecture. Everything extends it.

```
Current (draft)
        ↓
Validated Runtime  (Gate 1 → validated → three commits)
        ↓
Remaining Vertical Slices  (004→010 as contract-bound slices)
        ↓
Graph Authority  (graph → markdown → code)
        ↓
AI Tutor  (consume event stream; no UI truth)
        ↓
Adaptive Learning  (policy on timeline / replay)
        ↓
Analytics  (Experience Replay → sinks)
        ↓
Offline  (sync protocol on hydrate/replay)
        ↓
Recommendation Engine
        ↓
Public SDK
        ↓
Specification Compiler
```

### P0 Immediate

1. Complete Gate 1 human walkthrough.
2. Neutralize DebugLogPanel hydration on learn validation paths.
3. Promote `draft` → `validated`.
4. Three commits: runtime → shell → experience.
5. Close LJP-004/005 reviews to match wired code.

### P1 Near-term

1. Bind progress UI to runtime only.
2. Single PartAdvanced ownership rule.
3. Playwright SDP lesson journey.
4. Catalogue + Progress as vertical slices.

### P2 Medium-term

1. YAML ↔ graph-data sync; delete legacy drafts.
2. Achievements / Profile / Search slices.
3. Experience Replay UI + RUM metrics.

### Vision

AI Tutor · Adaptive learning · Analytics · Offline · Recommendations · SDK · Spec compiler — all on the **validated** event-sourced platform.

---

# Scale Readiness

| Target | Ready? | Why |
|--------|--------|-----|
| 100 courses | Mostly | Catalog pattern ready; need content backend |
| 10,000 learners | Partial | Needs authenticated server-side event store |
| AI tutoring | Strong | Append-only event log is the extension point |
| Offline | Partial | Hydrate/replay exist; sync missing |
| Adaptive learning | Strong | Replay + derived state |
| Analytics | Strong | Timeline / Experience Replay |
| Multi-tenancy | Not yet | Session singleton — platform work |

---

# Final Verdict

| Question | Answer |
|----------|--------|
| Is the architecture coherent? | **Yes** |
| Is SDP functioning? | **Yes** — as discipline; not yet promoted |
| Can future features reuse the foundation? | **Yes** |
| Biggest strengths | Spec-first identity · Nav laws · Event-sourced runtime · Proven vertical slice · Clear promotion gate |
| Biggest risks | Unsignaled Gate 1 · Hydration blanking · Progress dual-source · Graph sync unfinished · Uncommitted layers |

**Promotion remains correct:** do not treat the runtime as validated until composition is proven under a signed experience walkthrough.

---

# Living Baseline Protocol

After each capability:

1. Update **[capability-ledger.yaml](../runtime/capability-ledger.yaml)** (status, evidence, drift).
2. Update **Vertical Slice Index** and **Capability board** in this document.
3. Recompute **Architecture Drift** table.
4. Move items between **Validated** and **Transitional** only with evidence.
5. Never weaken **Architectural Invariants** or **Baseline v1.0** without an ADR.
6. Prefer extending **Future Evolution** over inventing parallel architectures.
7. Do **not** add foundational docs unless PLATFORM.md freeze exceptions apply.

**Mindset:** Prove the architecture scales — do not redesign Shell, Runtime, or Execution to ship hubs.

---

## Evidence index

| Artifact | Path |
|----------|------|
| Runtime state | `agent/runtime/state.yaml` |
| Promotion | `agent/runtime/promotion.md` |
| Capabilities | `agent/spec/capabilities.yaml` |
| LJP-001–003 reviews | `agent/reviews/LJP-00*.md` |
| Validation gate | `agent/reviews/LJP-003-validation.md` |
| Manifest laws | `agent/manifest.md` |
| Runtime | `src/lib/learning-runtime/` |
| Shell | `src/components/lms/shell/` |
| Experience | `src/components/lms/lesson/` |
| SDP query | `src/lib/sdp/` |

---

*Architecture Archaeology · Learning Journey Platform · Specification Driven Platform · Living Baseline v1.0.0*
