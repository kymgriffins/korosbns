# Agentic Development Operating System → SDP 3.0
## Specification Driven Platform — Learning Journey Platform

This folder is an **executable specification**. The AI does not think about architecture — the **scheduler computes** the next action from `runtime/state.yaml` and `docs/`.

---

## Layers

```
Intent → Specification → Contracts → Runtime → Code → Evidence → Retrospective
```

```
Specification   agent/spec/ + docs/     ← human views (Baseline v1.0 FROZEN)
Knowledge Graph agent/graph/ + src/lib/sdp/  ← transitional → authoritative (v4.0)
Execution       agent/runtime/
Implementation  src/
```

**Platform constitution:** [PLATFORM.md](./PLATFORM.md) — **Baseline v1.0 FROZEN** · Rule of Three · KPI = 0  
**Living audit:** [reviews/ARCHITECTURE-AUDIT.md](./reviews/ARCHITECTURE-AUDIT.md)  
**Capability Validations:** [runtime/capability-ledger.yaml](./runtime/capability-ledger.yaml)

```
Constitution (Frozen)   | Knowledge (Living)     | Product (Continuous)
PLATFORM, Laws, contracts| Ledger, Audit, reviews | CAP-004→010, future hubs
```

**Builder asks:** *Can I solve this using the existing constitution?*  
**Phase DoD:** Build evidence (not build platform).  
**Platform Validation Review:** After CAP-010 only — [PLATFORM-VALIDATION-REVIEW.md](./reviews/PLATFORM-VALIDATION-REVIEW.md)

---

## What this is

| Traditional | ADOS / SDP (post-freeze) |
|-------------|--------------------------|
| Code → documentation | Intent → spec → contracts → runtime → code → evidence |
| Features | **Capability Validations** |
| Grow platform forever | **Constitution frozen · Knowledge living · Product continuous** |
| "Improve architecture" | **Prove architecture** (KPIs → 0 / 0) |
| Revisit after every feature | Revisit constitution only after CAP-010 review |

---

## Deterministic process

```
Read → Plan → Build → Verify → Ask → Continue
```

**Never skip steps. Never jump ahead.**

---

## Folder map

| Path | Purpose |
|------|---------|
| [manifest.md](./manifest.md) | AI constitution — who you are |
| [development-mode.md](./development-mode.md) | Mode definitions (Architecture, Implementation, Review, …) |
| [workflow.md](./workflow.md) | Machine-readable lifecycle |
| [questions.md](./questions.md) | Checkpoint questions — when to STOP |
| [decision-tree.md](./decision-tree.md) | No guessing — only rules |
| [verification.md](./verification.md) | 9-layer verification pipeline |
| [context/](./context/) | Context loader order + paths |
| [contracts/](./contracts/) | Index to all spec contracts |
| [spec/](./spec/) | Immutable intent — backlog, capabilities |
| [graph/](./graph/) | **Knowledge graph** — REQ-*, entities, traceability |
| [runtime/](./runtime/) | **Mutable execution** — state, queue, locks |
| [backlog/](./backlog/) | Redirect → `spec/backlog/` |
| [memory/](./memory/) | Implemented + `implements[]` contract bindings |
| [reviews/](./reviews/) | Evidence-backed reviews + retrospectives |
| [prompts/](./prompts/) | Legacy roles → [runtime/responsibilities.md](./runtime/responsibilities.md) |
| [tests/](./tests/) | Verification commands |

---

## Start here

1. [PLATFORM.md](./PLATFORM.md) — version + Baseline freeze + prove-not-improve
2. [manifest.md](./manifest.md) — Laws 0–3
3. [runtime/capability-ledger.yaml](./runtime/capability-ledger.yaml) — capability lifecycle
4. [runtime/state.yaml](./runtime/state.yaml) + [runtime/queue.yaml](./runtime/queue.yaml)
5. [reviews/ARCHITECTURE-AUDIT.md](./reviews/ARCHITECTURE-AUDIT.md)
6. [spec/capabilities.yaml](./spec/capabilities.yaml)

**Runtime commit:** deferred until `runtime_stage: validated` ([promotion.md](./runtime/promotion.md)).

```
docs/          = Source of truth (specifications)
agent/         = Execution layer (how AI uses specs)
src/           = Implementation (only after ADOS gates pass)
```

Specs live in `docs/`. ADOS **references** them — does not duplicate unless syncing an index.

---

## Current state

**LJP-001** learning-shell — complete (uncommitted)  
**LJP-002** learning-runtime — complete (uncommitted)  
**Next:** LJP-003 lesson-screen — validates shell + runtime under real UI

**Commit gate:** shell + runtime + lesson → `validated` ([promotion.md](./runtime/promotion.md))

---

## Orchestrator model

```
Orchestrator
  ├── Planner
  ├── Dependency Analyst
  ├── Builder (never edits spec/)
  ├── Reviewer + Critic (adversarial, merge-blocking)
  ├── Verifier, Guardian, Optimizer
  ├── Historian + Librarian (retrospective)
  └── Reporter
```

Single-agent mode: execute responsibilities sequentially per [workflow.md](./workflow.md).
