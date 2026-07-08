# Platform Version — SDP / ADOS Constitution

```yaml
platform: Learning Journey Platform Execution Stack
current: "3.1"
baseline_frozen: "1.0"
freeze_declared: true
freeze_date: 2026-07-08
change_policy: evidence_from_completed_vertical_slice_plus_ADR
platform_evolution: STOPPED
product_delivery: ACTIVE
```

---

## Formal declaration

> **Platform Baseline v1.0 is FROZEN.**

That does not mean "never change."

It means:

> **Every future platform change must be justified by evidence from a completed vertical slice.**

We have crossed the boundary:

| Before | Now |
|--------|-----|
| Designing an engineering system | **Using** that engineering system |
| Improve the architecture | **Prove** the architecture |
| Features | **Capability Validations** |
| Build the platform | **Build evidence** |

If we keep adding platform concepts now, we risk an architecture optimized for itself rather than for delivering software.

**Platform evolution stops. Product delivery continues. Understanding stays living.**

---

## Freeze the Constitution, Not the Understanding

Three categories of change — keep them separate.

### 1. Constitution (Frozen)

Defines **how the platform works**. Changes only via completed Capability Validation evidence + ADR + Rule of Three + human approval.

| Examples |
|----------|
| Experience Principles, Design DNA, Navigation Laws |
| Engineering Principles, Runtime Contracts |
| Learning Shell / Runtime architecture |
| Manifest Laws, `PLATFORM.md` |
| Screen / Component / Journey contracts (semver bumps = constitutional) |

### 2. Knowledge (Living)

Describes **reality**. Must evolve continuously — these are not architecture changes.

| Examples |
|----------|
| Capability Ledger · Architecture Audit · Retrospectives |
| Reviews / Evidence · Observability · Drift reports |
| Performance metrics · Test coverage · `constitution_exceptions` |

### 3. Product (Continuous)

Iterates freely **inside** the constitution.

| Examples |
|----------|
| Course Detail · Catalogue · Progress · Achievements |
| Profile · Search · AI Tutor · Analytics · Recommendations |

Breaking a Law to ship product is a **constitution_exception** (measured), not a silent redesign.

---

## Law — The Rule of Three

A new **platform** abstraction is introduced **only if**:

1. It has appeared in **three** independent vertical slices, **and**
2. Existing abstractions cannot express it cleanly, **and**
3. An ADR documents why it belongs in the platform instead of the product.

Otherwise:

> **Solve it in the product.**

This prevents platform bloat.

---

## Guiding question (Builder)

Wrong:

> "Should I update the architecture?"

Right:

> **"Can I solve this using the existing constitution?"**

Only if the answer is **no**, and the Rule of Three is satisfied, propose an ADR.

---

## Redefined success

Success is no longer better documentation, architecture, or contracts.

Success is:

```text
Can a new capability
be built

WITHOUT

changing the platform?
```

If yes → the platform is succeeding.

---

## Platform KPIs

```yaml
metrics:
  platform_stability:
    definition: platform_constitutional_changes_per_capability
    goal: 0
  constitution_pressure:
    definition: constitution_exceptions_per_capability
    goal: 0
    signal: >
      Builder could not implement without breaking Law X.
      Record the law + why. Do not silently rewrite the constitution.
```

Ship CAP-004→010 **without constitutional edits** and **without exceptions** = strongest proof.

Track both fields on every Capability Validation in the ledger.

---

## Phase Definition of Done — Build Evidence

Every completed Capability Validation must leave behind:

1. Implementation (additive, in-constitution)
2. Tests
3. Review (`agent/reviews/…`)
4. Retrospective
5. Metrics / observability (as applicable)
6. Drift note (Architecture Audit or ledger `drift_pct`)
7. Capability Ledger update (`platform_changes`, `constitution_exceptions`)

The repository accumulates evidence that the platform holds — or does not — under real use.

---

## Capability Validations (not "features")

Each remaining item is a **scientific experiment**.

| Capability Validation | Hypothesis |
|-----------------------|------------|
| CAP-004 Course Detail | Shell + Runtime support Course Detail **unchanged** |
| CAP-005 Home Continue / Progress resume | Runtime correctly deep-links / aggregates resume state |
| CAP-006 Catalogue | Discovery reuses navigation + cards **without new architecture** |
| CAP-007 Progress Hub | Runtime aggregation surfaces correctly |
| CAP-008 Achievements | Event-derived state only |
| CAP-009 Profile | Account mode separation holds |
| CAP-010 Search | Information architecture holds |

Each capability either **validates** or **falsifies** the platform. Neither case is a license to redesign without Rule of Three + ADR.

**Additional gate (ADR-015):** Every CAP answers — *Beside RX-001, does this screen belong to the same Budget Ndio Story Learn family?* See `docs/lms-spec/reference-experience-rx-001.md` and `visual-acceptance.yaml`.

---

## Immutable constitution (until evidence)

```
PLATFORM.md
manifest.md
ARCHITECTURE-AUDIT.md
capability-ledger.yaml          (status updates allowed; schema freeze)
docs/lms-spec/experience-principles.md
docs/lms-spec/design-dna.md
docs/lms-spec/reference-experience-rx-001.md   # ADR-015
docs/lms-spec/visual-acceptance.yaml
docs/navigation-laws.md
docs/layout-blueprints.md
docs/ljp-spec/engineering-principles.md
docs/screen-contracts/
docs/component-contracts/
agent/spec/runtime-contracts/
agent/spec/journey-contracts/
```

Do not amend without completed-slice evidence + ADR.

---

## Platform version history

| Version | Name | Meaning |
|---------|------|---------|
| **v1.0** | Experience + Design | Experience Principles, Design DNA, anti-patterns, design review |
| **v2.0** | Specification Layer | Product/IA, Navigation Laws, Blueprints, Screen/Component/Journey contracts |
| **v3.0** | Execution Layer | ADOS/SDP, runtime state, capability gates, traceability, promotion |
| **v3.1** | Knowledge Graph Foundation + Freeze | REQ graph + query + **Baseline v1.0 FROZEN** |
| **v4.0** *(earned only)* | Authoritative Knowledge Graph | Requires Rule of Three + ADR |
| **v5.0** *(earned only)* | Specification Compiler | Requires Rule of Three + ADR |

Current: **v3.1 (frozen)**. Later platforms versions are **earned**, not aspirational.

---

## Baseline v1.0 layers (frozen)

### Experience · Product · Engineering · Execution

As previously declared — Experience Principles, Design DNA, Product/IA, Navigation Laws, Blueprints, Screen/Component/Journey contracts, Engineering Principles, Runtime Contracts, state/motion/perf/a11y/testing, ADOS/SDP, KG Foundation, gates, traceability, promotion.

See living detail in [ARCHITECTURE-AUDIT.md](./reviews/ARCHITECTURE-AUDIT.md).

---

## Roadmap (evidence sequence)

```
Platform Constitution (Frozen)
        │
        ▼
Gate 1 Validation
        │
        ▼
Three Foundational Commits
        │
        ▼
CAP-004 → CAP-010  (Capability Validations)
        │
        ▼
Evidence Collection  (Knowledge layer living)
        │
        ▼
Platform Validation Review  (after CAP-010 — not after CAP-004/005)
        │
        ▼
Baseline v1.1  (only if justified)
```

**Do not** reopen the constitution after CAP-004 or CAP-005. Wait until at least **CAP-010**.

---

## Platform Validation Review (post–CAP-010)

Conduct only after CAP-001…CAP-010 have evidence packages. Ask:

1. Which laws were never challenged?
2. Which laws caused friction?
3. Which ADRs were created?
4. Which abstractions were reused most?
5. Which components remained stable?
6. Did platform drift stay under target (<5%)?
7. Did any capability require a `constitution_exception`?
8. `platform_changes` / `constitution_exceptions` totals vs goals (0)?

Only then decide whether **Baseline v1.1** is warranted. Anticipation is not sufficient.

---

## Six-month success criteria

If we can say:

- CAP-001 through CAP-010 completed
- Zero constitutional changes
- Zero constitution exceptions (or each justified and scarce)
- Zero shell / runtime / navigation / contract rewrites
- Only additive components
- Architecture drift under 5%
- KPIs ≈ 0 / 0

Then we have proven:

> **The Specification Driven Platform is stable under sustained product evolution.**

Only then consider extracting BlueprintOS / reusable framework — not before.

---

## Final observation

> The architecture is no longer changing because someone has a better idea; it changes only when implementation evidence proves it must.

At this stage the engineering foundation is complete enough that project quality is determined by how consistently Capability Validations ship **without modifying the constitution**.

### Layered model (ADR-015)

```
Budget Ndio Story
        │
        ▼
Mission (Civic Education)
        │
        ▼
Reference Experience RX-001 (how it should feel)
        │
        ▼
Design DNA (how it should look)
        │
        ▼
Learning Journey Platform Constitution (how it should behave)
        │
        ▼
SDP / ADOS (how it should be built)
        │
        ▼
Capability Validations (how it is proven)
```

Do **not** add another foundational document. Let CAP-004→010 determine whether the constitution holds.

**UI execution program:** [ui-completion-roadmap.md](../docs/lms-spec/ui-completion-roadmap.md) — Phase A starts with **CAP-004 Course Detail** (flagship UI reference) before Gate 1 preferred. [SIC-CAP-004](../docs/lms-spec/sic-cap-004-course-detail.md) binds pixels. **Pixel Discipline** (manifest rule 17). Critic gates 1–5; `platform_changes: 0`.

---

## Related

| Document | Role |
|----------|------|
| [ARCHITECTURE-AUDIT.md](./reviews/ARCHITECTURE-AUDIT.md) | Living Knowledge — architectural baseline |
| [capability-ledger.yaml](./runtime/capability-ledger.yaml) | Living Knowledge — Validation register + KPIs |
| [ui-completion-roadmap.md](../docs/lms-spec/ui-completion-roadmap.md) | Product — finite RX-001 UI program |
| [promotion.md](./runtime/promotion.md) | Constitution-adjacent execution gate |
| [manifest.md](./manifest.md) | Constitution — Laws 0–4 |
