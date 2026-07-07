# Testing Strategy
## Learning Journey Platform — Design TDD + Engineering TDD

Mirrors specification stack: contracts define expected behavior; tests prove it.

---

## 1. Test pyramid

```
        E2E (Playwright)
       ─────────────────  Critical journeys
      Integration (RTL + Vitest)
     ─────────────────────────  Component behavior
    Unit (Vitest)
   ─────────────────────────────  Pure logic, helpers
```

---

## 2. What to test where

### Unit — `vitest`

| Target | Examples |
|--------|----------|
| `data/lms/helpers.ts` | `getLessonNeighbors`, `getFirstLessonHref` |
| `data/lms/catalog.ts` | getters return valid shapes |
| `lib/learn-nav.ts` | `isLmsNavActive` |
| Zod schemas (future) | reflection, filters |
| State reducers (future) | lesson state machine pure functions |

Location: `src/data/lms/__tests__/`, `src/lib/__tests__/`

### Integration — `vitest` + `@testing-library/react`

| Target | Examples |
|--------|----------|
| `ModuleCard` | expand/collapse, one-open group |
| `TriviaPopup` | cannot dismiss without answer |
| `ContinueButton` | hidden until enabled |
| `VideoPlayer` | part switch, onPartEnd callback |
| `LessonExperience` | full loop mock |

Location: `src/components/lms/__tests__/`

### E2E — `playwright`

| Journey | Path |
|---------|------|
| J-B Returning learner | Home → Continue → Lesson video visible |
| J-A New learner | Catalogue → Course → Enroll → Lesson |
| Trivia gate | Play video end → trivia → answer → continue |
| Navigation laws | No sidebar; bottom nav on hub, hidden on lesson |
| a11y | axe scan on lesson + home |

Location: `e2e/learn/` (to create)

### Visual regression (target)

| Tool | Scope |
|------|-------|
| Playwright screenshots | Lesson, Course detail vs baseline |
| Chromatic (optional) | Component stories |

Compare against reference design — fail if confused with generic template.

### Performance

| Check | Tool |
|-------|------|
| Bundle size | `@next/bundle-analyzer` on PR |
| Lighthouse | CI budget (future) |

---

## 3. Contract → test map

| Contract | Minimum tests |
|----------|---------------|
| `navigation-laws.md` Law 8 | Trivia integration test |
| `continue-button.md` | Enabled/disabled states |
| `module-card.md` | Accordion single-open |
| `lesson.md` screen | E2E lesson load |
| `experience-principles.md` | E2E ≤2 taps home→lesson (when continue wired) |

---

## 4. Coverage expectations

| Area | Target |
|------|--------|
| `data/lms/helpers.ts` | 100% |
| `components/lms` orchestrators | 80% branches |
| Route pages | E2E cover critical paths |
| UI primitives | Via integration, not unit |

**Do not** test shadcn primitives.

---

## 5. CI commands

```bash
pnpm test                           # vitest unit + integration
pnpm test:e2e -- e2e/learn          # learn journeys (when added)
```

PR must pass `pnpm test` and `pnpm build`.

---

## 6. Test naming

```
describe('getLessonNeighbors')
describe('TriviaPopup')
  it('does not close when backdrop is clicked before answer')
  it('traps focus while open')
describe('learn journey')
  it('returns learner to lesson in one tap from home')
```

---

## 7. Fixtures

| Fixture | Location |
|---------|----------|
| Mock course | import from `catalog.ts` or test slice |
| Mock lesson with trivia | `data/lms/__fixtures__/lesson-with-trivia.ts` (create when testing) |

---

## 8. Definition of Done link

Feature not done without tests listed in its screen contract's **Testing** section (add when implementing).

Minimum for Lesson v1:

- [ ] Unit: `getLessonNeighbors`
- [ ] Integration: `TriviaPopup` dismiss blocked
- [ ] Integration: `ContinueButton` gating
- [ ] E2E: home → lesson path
