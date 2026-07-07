# Agent Workflow
## Learning Journey Platform — Mandatory lifecycle

Every AI agent (and human) follows this sequence. **Skipping a step invalidates the PR.**

---

## Phase 0 — Read experience (no code)

1. `../lms-spec/experience-principles.md` — emotion + cognitive load for target screen
2. `../lms-spec/design-dna.md` — personality + visual grammar
3. `../lms-spec/anti-patterns.md` — scan for instant fails

---

## Phase 1 — Read product architecture (no code)

4. `../product-architecture.md`
5. `../information-architecture.md`
6. `../user-journey.md`
7. `../navigation-laws.md`
8. `../layout-blueprints.md` — identify blueprint letter

---

## Phase 2 — Read contracts (no code)

9. `../screen-contracts/[screen].md`
10. `../component-contracts/*.md` for every component used
11. `../interaction-inventory.md` — confirm interactions exist

---

## Phase 3 — Read engineering (no code)

12. `engineering-principles.md`
13. `frontend-architecture.md` — where files go
14. `component-evolution.md` — reuse vs create
15. `state-management.md` — where state lives
16. `data-flow.md` — server vs client
17. `motion-guidelines.md`
18. `performance-budget.md`
19. `accessibility-contract.md`
20. `testing-strategy.md`

---

## Phase 4 — Plan (no code)

21. List components to **reuse** (from `../component-inventory.md`)
22. List components to **create** (contracts must exist)
23. Answer Architecture Review Board W1–W5 (`../architecture-review-board.md`)
24. Confirm no anti-pattern matches
25. If new pattern → draft `decision-log.md` entry

**Stop if any contract is missing — write contract first.**

---

## Phase 5 — Implement

26. Server page thin — data from `data/lms/`
27. Client boundary minimal — `LessonExperience` pattern
28. Tokens from `lms-design-tokens.ts`
29. Motion per `motion-guidelines.md`
30. No business logic in leaf components

---

## Phase 6 — Verify

31. `pnpm exec tsc --noEmit`
32. `pnpm test` (add tests per `testing-strategy.md`)
33. `pnpm build`
34. Keyboard walkthrough (accessibility contract)
35. `../lms-spec/design-review-checklist.md` — all pass
36. `../architecture-review-board.md` — all pass
37. `../ui-acceptance-questionnaire.md` — 70 Yes (when visual complete)
38. Update `../lms-ui-audit.md`
39. `definition-of-done.md` — all boxes checked

---

## Phase 7 — Ship

40. PR description includes:
    - Blueprint + screen contract
    - Components reused vs created
    - W1 answer (why CTA)
    - Test list
    - Design review + arch review pass
41. **Human review** for first implementation commit on learnreformed

---

## Forbidden shortcuts

```
❌ "I'll fix the contract after implementing"
❌ Skip tests because "it's just UI"
❌ New component without contract
❌ Client page when server suffices
❌ Merge with failing audit
❌ Commit without Definition of Done
```

---

## Single-feature scope rule

One PR / one commit batch = **one screen contract** or **one component extraction**.

First implementation commit recommended order:

1. `Lesson` screen (Blueprint D) — highest contract surface
2. `Course Detail` (Blueprint B)
3. Hubs alignment

---

## Escalation

| Situation | Action |
|-----------|--------|
| Contract contradicts engineering | Fix contract first, decision log |
| Need new nav law | Amend `navigation-laws.md` + review |
| Performance budget fail | Optimize before merge |
| Cannot pass a11y | Fix before merge — no exceptions |
