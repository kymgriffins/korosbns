# Agent Questions
## When to STOP, when to ASK, when to CONTINUE

The agent must **answer every question** at each checkpoint. Any wrong answer → STOP.

---

## Before implementation (`questions.before`)

| ID | Question | Pass if |
|----|----------|---------|
| Q-B1 | Have requirements changed since contracts were written? | No — or specs updated first |
| Q-B2 | Is the screen + component contract complete for this item? | Yes |
| Q-B3 | Does an existing component solve this? (check `memory/`) | Reuse plan documented |
| Q-B4 | Should any specification be amended? | No — or amendment PR first |
| Q-B5 | Is there missing business logic in domain model / state machines? | No — or domain spec updated |
| Q-B6 | Are all backlog dependencies `done`? | Yes |
| Q-B7 | Is current ADOS mode correct for this work? | Yes |

---

## During implementation (`questions.during`)

| ID | Question | Pass if |
|----|----------|---------|
| Q-D1 | Am I creating a duplicate component? | No |
| Q-D2 | Am I violating Design DNA? | No |
| Q-D3 | Am I introducing new spacing outside 8pt tokens? | No |
| Q-D4 | Am I introducing a new color token? | No — or tokens file + decision log |
| Q-D5 | Am I introducing new typography rules? | No |
| Q-D6 | Can I reuse an existing primitive from `components/ui/`? | Yes — or justified |
| Q-D7 | Am I breaking a Navigation Law? | No |
| Q-D8 | Am I exceeding cognitive load budget? | No |
| Q-D9 | Am I adding `"use client"` without justification? | No |
| Q-D10 | Am I putting business logic in a leaf component? | No |

**Any No on Q-D2, Q-D7, Q-D8 → STOP immediately.**

---

## Runtime / domain (`questions.runtime`) — required for LJP-002+

| ID | Question | Pass if |
|----|----------|---------|
| Q-R1 | What business object owns this state? | Learning Runtime — documented |
| Q-R2 | What event created this state? | Named event type in event-model |
| Q-R3 | Should this belong to Learning Runtime instead of the component? | Yes for progress/session — or justified exception |
| Q-R4 | Which REQ introduced this event? | REQ-* cited in dispatch site or contract |

**Any direct progress mutation in a component → STOP.**

---

## After implementation (`questions.after`)

| ID | Question | Pass if |
|----|----------|---------|
| Q-A1 | Does this resemble the reference design language? | Yes |
| Q-A2 | Could this screenshot be confused with another product? | No |
| Q-A3 | Would Apple remove anything from this page? | If yes → remove before continue |
| Q-A4 | Would Linear simplify navigation? | If yes → simplify |
| Q-A5 | Does information hierarchy still hold? | Yes |
| Q-A6 | Is the primary CTA obvious within 2 seconds? | Yes |
| Q-A7 | Can the learner complete their task faster? | Yes or neutral |
| Q-A8 | Would I merge this without hesitation? | Yes |
| Q-A9 | Is there more UI than content on flow screens? | No |
| Q-A10 | Would someone recognize the design without the logo? | Yes |

**Any fail → Implementation pauses. Revise. Re-verify.**

---

## Human approval gates (`questions.human`)

Ask human **only** these patterns — never implementation trivia.

### Q-H1 — New reusable component

```md
This feature requires a new Stage 2 component: [Name]

Contract: [path] (exists / needs creation)

Approve creation?
YES / NO
```

### Q-SPEC-CONFLICT — Specification conflict

```md
Specification conflict detected:

- [Doc A] says: …
- [Doc B] says: …

Which should win, or should we amend a spec?
```

### Q-H3 — New animation pattern

```md
This implementation introduces motion not in motion-guidelines.md:

[description]

Should Motion Contract be updated?
YES / NO
```

### Q-H4 — Reuse vs create

```md
Existing component [X] can be extended with variant [Y].

Preferred?
REUSE / CREATE NEW
```

---

## Continuous architecture (`questions.continuous`)

After every completed backlog item:

| ID | Question | Action if yes |
|----|----------|---------------|
| Q-C1 | Should any contract change? | Amendment PR |
| Q-C2 | Should Design DNA evolve? | decision-log + DNA patch |
| Q-C3 | Should a component be promoted? | component-evolution.md |
| Q-C4 | Should Engineering Principles change? | ljp-spec patch |
| Q-C5 | Should Definition of Done change? | rare — decision log |
| Q-C6 | Should Anti-Patterns grow? | add line + reason |

---

## Answer log template

Store in `reviews/[item-id].md`:

```md
## Question checkpoint

### Before
- Q-B1: …
…

### During
…

### After
…

### Human
N/A | Q-H1: APPROVED
```
