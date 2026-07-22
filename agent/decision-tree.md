# Decision Engine
## ADOS — No creativity. Only decisions.

Follow trees exactly. If no branch matches → **Ask** ([questions.md](./questions.md)).

---

## Need UI for a backlog item?

```
Need UI?
  → Screen contract exists?
      NO → STOP → Architecture Mode → write contract
      YES ↓
  → Layout blueprint identified?
      NO → STOP → assign blueprint in layout-blueprints.md
      YES ↓
  → Proceed to component tree
```

---

## Need a component?

```
Need component?
  → Listed in memory/implemented.md?
      YES → Reuse (extend variant if needed)
      NO ↓
  → Listed in component-contracts/?
      YES → Implement per contract (Stage 2)
      NO ↓
  → Can ui/ primitive compose it?
      YES → Compose — no new feature component
      NO ↓
  → Feature-specific (one screen)?
      YES → Q-H1 → write contract → create Stage 2
      NO ↓
  → Used on 2+ features?
      YES → Q-H1 → promote plan
      NO ↓
  → ASK
```

---

## Need state?

```
Need state?
  → Server catalog data? → RSC props from data/lms/
  → URL state? → params / searchParams
  → Form? → React Hook Form + Zod
  → Session lesson progress? → lesson-state.ts + sessionStorage
  → API data (future)? → TanStack Query
  → Global store? → STOP → Q-H1 → state-management.md amendment
  → Animation? → Motion local state only
```

---

## Need a new route?

```
Need route?
  → In screen-inventory.md?
      NO → STOP → Architecture Mode
      YES ↓
  → In information-architecture.md tier?
      YES ↓
  → Violates forbidden routes list?
      YES → STOP — forbidden
      NO → Add page under app/(marketing)/learn/
```

---

## Need motion?

```
Need motion?
  → In motion-guidelines.md catalog?
      YES → Implement with useReducedMotion
      NO ↓
  → Q-H3 → update motion-guidelines.md
```

---

## Need a new color / spacing?

```
Need token?
  → In lms-design-tokens.ts?
      YES → use token
      NO ↓
  → Can map to existing Tailwind semantic?
      YES → use semantic
      NO ↓
  → STOP → decision-log → add token
```

---

## Verification failed?

```
Layer N failed?
  → Fix root cause (not suppress)
  → Re-run layers N through 9
  → Still fail after 2 attempts?
      STOP → human + review doc BLOCKED
```

---

## Commit?

```
Ready to commit?
  → Definition of Done all checked?
      NO → STOP
      YES ↓
  → verification.md all PASS?
      NO → STOP
      YES ↓
  → questions.after all pass?
      NO → STOP
      YES ↓
  → Release Mode → commit
  → Separate spec vs feature commits
```

---

## Backlog item blocked?

```
Dependency not done?
  → Implement dependency first
  → Never stub dependency in consumer

Draft UI exists but not Done?
  → Refactor Mode OR re-implement per contract
  → Mark memory status: draft | done
```

---

## Conflict between specs?

```
Conflict detected?
  → Apply manifest authority hierarchy
  → Still conflict?
      Q-SPEC-CONFLICT → human
  → Never code through conflict
```
