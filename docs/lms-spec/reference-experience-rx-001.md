# Reference Experience RX-001
## Visual + emotional constitution — Budget Ndio Story Learn

```yaml
id: RX-001
status: constitutional_companion
decision: ADR-015
version: 1.1.0
date: 2026-07-08
principle: defines_experience_not_product_category
```

> **RX-001 defines the experience, not the product category.**  
> Contributors do not ask “Does this look like Udemy?”  
> They ask “Does this **feel** like Budget Ndio Story Learn?”

Not a pixel clone. Not an LMS. Marketplace widgets from the inspiration board are **rejected**.

---

## Layered responsibilities (do not conflate)

| Layer | Answers | Source |
|-------|---------|--------|
| **Mission** | Why does this exist? | Budget Ndio Story (civic education) |
| **RX-001** | What experience / feeling? | This document |
| **Design DNA** | What visual language? | `design-dna.md` |
| **Platform Constitution** | What interaction + architecture rules? | Navigation Laws, contracts, PLATFORM.md |
| **SDP / ADOS** | How is it built consistently? | `agent/` |
| **Capability Validations** | What evidence proves it holds? | Capability Ledger |

No new foundational docs beyond these companions. Prove with CAP-004→010.

---

## Identity

| Layer | Name |
|-------|------|
| Public brand | **Budget Ndio Story Learn** (or simply **Learn** in-product) |
| Architecture | Learning Journey Platform (internal) |
| Purpose | Open-source **civic** learning — mission-first |
| Homepage test | Never Moodle / Canvas / Blackboard / Classroom / Udemy / Coursera |

Within **30 seconds** a first-time citizen should confidently begin; contributors should recognize a consistent BNS design language.

---

## How the learner should feel

```yaml
reference_experience:
  first_impression:
    - calm
    - welcoming
    - trustworthy
  during_learning:
    - focused
    - uninterrupted
    - confident
  after_completion:
    - accomplished
    - curious_to_continue
    - empowered
```

Critic: if the screen is contract-correct but the learner would feel rushed, confused, or “managed by LMS chrome” → **fail** (experience drift).

---

## What RX-001 protects

### Functional journey (Runtime)

```
Course → Module → Lesson → Video → Trivia → Reflection → Continue → Next
```

### Visual language

Calm · editorial spacing · obvious hierarchy · huge hero · one CTA · rounded minimal cards · ~95% grayscale chrome · color from content / civic impact only.

---

## Non-negotiable visual laws

### Hierarchy

One obvious starting point (readable in ~3 seconds). Nothing competes with the primary path.

### Whitespace (8pt)

Nothing touches. Scale only: `{4,8,16,24,32,48,64,80}`. Outer 64–80 · sections 48–64 · cards 24–32 · elements 16–24 · labels 8.

### Content width

Max **~1280px** centered. Lesson prose narrower.

### Typography

Hero → Title → Section → Body → Caption → Meta. Size/weight, not rainbow color. Max three weights.

### Palette

Background `#FAFAFA` · Surface white · Text near `#111` · Secondary `#6B7280` · Border `#E5E7EB` · CTA black.

### Cards / CTAs / Imagery / Nav / Motion

As ADR-015: soft radius 20–24, one black primary, Blueprint B ~60/40 hero, **no sidebar**, Apple/Linear/Notion motion (state only).

---

## Civic warm adaptations (not marketplace)

| Board pattern | Budget Ndio Story |
|---------------|-------------------|
| Price | Time · difficulty · citizens completed · Budget Impact |
| Buy / Enroll | **Start Journey** · **Continue Learning** |
| Star reviews | Community impact · civic outcomes |
| Mentors / Cart chrome | Rejected |
| Curriculum sidebar | Modules accordion (Law 5) |

---

## Family Test (five questions — all required)

Every `/learn` UI change and every Capability Validation must pass **all five**:

```text
1. Would someone recognize this as Budget Ndio Story Learn
   without seeing the logo?

2. Does one action dominate the screen?

3. Does the layout breathe?

4. Would removing an element improve the screen?
   (If yes → remove it before merge.)

5. Would RX-001's designer approve this composition?
```

Question 4 is a deliberate fail trigger — “would remove improve?” → **remove**, do not rationalize density.

---

## Necessity test (“Could Apple remove this?”)

For every new UI element:

```text
If this component disappeared tomorrow,
would learning become harder,
or merely different?
```

| Answer | Action |
|--------|--------|
| Harder | Keep (document why) |
| Merely different | **Remove** — reinforces calm editorial language |

---

## Open-source contributor rule

```text
Contributors may innovate in implementation.
Contributors may not invent interaction.

New interaction patterns require
an ADR and evidence (Rule of Three for platform-level change).
```

Interaction consistency is the hardest open-source asset — protect it.

---

## Experience Drift (parallel to Architecture Drift)

A screen can satisfy contracts and still feel cluttered. Track:

```yaml
experience_drift:
  visual_noise: low          # required
  competing_actions: "<= 2"  # required
  cognitive_load: within_budget
  primary_focus: obvious_under_3_seconds
  brand_recognition: passes_family_test  # all 5 Qs
  civic_warmth: present
  learner_feel: matches_phase  # first_impression | during | after
```

Machine binding: [`visual-acceptance.yaml`](./visual-acceptance.yaml).

---

## Rejected from RX-001

Sidebars · cart · price-as-CTA · gift buy · mentors/students primary chrome · enterprise density · flashy motion · multiple equal primary buttons.

---

## Machine binding

| Concern | Source |
|---------|--------|
| Tokens | `src/constants/lms-design-tokens.ts` |
| DNA + Civic Warmth | `design-dna.md` |
| VAS + Experience Drift | `visual-acceptance.yaml` |
| Architecture Drift | `agent/reviews/ARCHITECTURE-AUDIT.md` |
| ADR | `docs/ljp-spec/decision-log.md` #015 |
