# Definition of Done
## Learning Journey Platform — Feature completion gate

A feature is **Done** only when **every** item below is satisfied.

Partial completion is **not Done**. Do not commit implementation to `learnreformed` until Done for the scoped feature.

---

## 1. Experience

- [ ] Primary **emotion** declared and achieved (`experience-principles.md`)
- [ ] **Cognitive load budget** not exceeded
- [ ] **Progressive complexity** level appropriate — no +2 jump
- [ ] **Time-to-value** target met for screen

---

## 2. Design

- [ ] **Design DNA** — no personality violations
- [ ] **Zero anti-pattern matches** (`anti-patterns.md`)
- [ ] **Screen contract** — every section answered
- [ ] **Component contracts** — all used components satisfied
- [ ] **Layout blueprint** — correct letter, structure matches
- [ ] **Navigation laws** — zero violations (cite numbers in PR)
- [ ] **Design review checklist** — all pass (`design-review-checklist.md`)
- [ ] **UI questionnaire** — 70/70 Yes (when visually complete)
- [ ] **Section 15 final acceptance** — all Yes
- [ ] **Visual regression** — not confused with another product; recognizable without logo

---

## 3. Engineering

- [ ] **Engineering principles** — no violations (E1–E15)
- [ ] **Frontend architecture** — files in correct folders
- [ ] **Component evolution** — reuse justified; promotions documented
- [ ] **State management** — state in correct layer
- [ ] **Data flow** — server/client boundary correct
- [ ] **Motion guidelines** — catalog entries implemented + reduced motion
- [ ] **Performance budget** — route within limits
- [ ] **Accessibility contract** — behavior verified
- [ ] **Tests** — per `testing-strategy.md` minimum for feature
- [ ] `pnpm tsc` + `pnpm test` + `pnpm build` pass

---

## 4. Process

- [ ] **Architecture review board** — complete (`architecture-review-board.md`)
- [ ] **Agent workflow** — phases 0–6 followed
- [ ] **Decision log** updated if new pattern introduced
- [ ] **`lms-ui-audit.md`** updated for affected screens
- [ ] **PR description** includes W1 (why CTA), blueprint, components reused

---

## 5. Product identity

- [ ] Feels like **Learning Journey Platform** — not LMS, not generic template
- [ ] **More content than chrome** on flow screens
- [ ] Learner can complete task **faster** or same speed — never slower
- [ ] **One primary CTA** per viewport on flow screens

---

## Feature-specific minimums

### Lesson (first implementation target)

- [ ] Blueprint D structure
- [ ] `ContinueButton` extracted + sticky
- [ ] `TriviaPopup` — no dismiss without answer
- [ ] Bottom nav hidden
- [ ] Integration tests: trivia + continue
- [ ] E2E: reach lesson, video visible

### Course Detail (second target)

- [ ] Blueprint B — 60/40 hero + breadcrumb
- [ ] Accordion group — one module open, collapsed default
- [ ] `CourseHero` extracted

---

## Sign-off

```md
## Definition of Done — [Feature name]

Date:
Branch: learnreformed

Experience: ✅
Design: ✅
Engineering: ✅
Process: ✅
Identity: ✅

Ready to commit: Yes / No
```

**Only "Yes" when every checkbox in sections 1–5 is checked.**

---

## What Done is not

```
❌ "Works in browser"
❌ "Looks okay"
❌ "We'll add tests later"
❌ "Audit fails but ship anyway"
❌ "One more quick fix after commit"
```

Done means **specification-driven completion** — the reference architecture stays trustworthy.
