# Change Impact Analysis
## Blast radius before implementation

Run before Builder. Present impact to human when `risk >= medium`.

---

## Query algorithm

```pseudo
function impact(target):
  direct = files that import target
  transitive = BFS import graph to depth 3
  contracts = component contracts referencing target
  tests = test files importing target
  routes = pages rendering target
  return { direct, transitive, contracts, tests, routes }
```

---

## Template

```yaml
change_impact:
  target: [Component or file]
  action: modify | create | delete

  breaks_if_wrong:
    routes: []
    components: []
    tests: []
    contracts: []

  contracts_affected: []
  e2e_affected: []
  snapshots: none  # no storybook in repo

  safe_to_proceed: boolean
  rollback_plan: see rollback.md
```

---

## LJP-001 — Learning Shell impact

```yaml
change_impact:
  target: LearningShell / learn layout
  action: refactor + extend

  breaks_if_wrong:
    routes:
      - src/app/(marketing)/learn/**/page.tsx  # all learn pages
    components:
      - LmsPage (child of shell)
      - All pages using LmsShell via layout
    tests:
      - src/data/lms/__tests__/*  # indirect — should not break
    contracts:
      - docs/component-contracts/lms-shell.md
      - docs/navigation-laws.md (2, 3, 12, 14, 15)

  contracts_affected:
    - lms-shell.md

  e2e_affected:
    - e2e/learn/ (when added)

  downstream_blocked_if_fails:
    - LJP-002 through LJP-010

  safe_to_proceed: true  # specs complete; refactor not rewrite

  specific_risks:
    - layout.tsx must pass immersive mode to shell (currently missing)
    - account bypass must remain
    - bottom nav padding on hub routes
```

---

## LJP-001 — If ContinueButton were changed (example)

```yaml
change_impact:
  target: ContinueButton
  action: modify

  breaks_if_wrong:
    routes: [lesson, course, home]
    components: [LessonExperience, CourseDetail, Home continue card]
    contracts: [continue-button.md, lesson.md, course-detail.md, home.md]
```

Use this pattern for every Builder action on shared components.
