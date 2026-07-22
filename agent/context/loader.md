# Context Loader
## Execute before any Implementation Mode turn

Load in order. Do not skip. Confirm each file exists.

---

## Loader sequence

```yaml
load_order:
  - id: experience
    path: docs/lms-spec/experience-principles.md
    required: true

  - id: design_dna
    path: docs/lms-spec/design-dna.md
    required: true

  - id: anti_patterns
    path: docs/lms-spec/anti-patterns.md
    required: true

  - id: navigation_laws
    path: docs/navigation-laws.md
    required: true

  - id: engineering
    path: docs/ljp-spec/engineering-principles.md
    required: true

  - id: domain_model
    path: docs/ljp-spec/domain-model.md
    required: true

  - id: state_machines
    path: docs/ljp-spec/state-machines.md
    required: true

  - id: definition_of_done
    path: docs/ljp-spec/definition-of-done.md
    required: true

  - id: backlog_item
    path: agent/spec/backlog/{current_item}.md
    required: true

  - id: screen_contract
    path: dynamic  # from backlog item contracts.screen
    required: if_screen

  - id: component_contracts
    path: dynamic  # from backlog item contracts.components[]
    required: true

  - id: blueprint
    path: docs/layout-blueprints.md
    section: dynamic  # from backlog blueprint
    required: if_screen

  - id: memory
    path: agent/memory/implemented.md
    required: true

  - id: manifest
    path: agent/manifest.md
    required: true
```

---

## Per-backlog-type additions

### Shell / infrastructure

```yaml
additional:
  - docs/ljp-spec/frontend-architecture.md
  - docs/ljp-spec/motion-guidelines.md
  - docs/ljp-spec/accessibility-contract.md
  - docs/component-contracts/lms-shell.md
```

### Lesson feature

```yaml
additional:
  - docs/ljp-spec/error-handling.md
  - docs/ljp-spec/events.md
  - docs/ljp-spec/performance-budget.md
  - docs/screen-contracts/lesson.md
  - docs/component-contracts/video-player.md
  - docs/component-contracts/trivia-popup.md
  - docs/component-contracts/continue-button.md
```

---

## Loader acknowledgment

```md
## Context loaded

- Experience: ✓
- Design DNA: ✓
- Navigation Laws: ✓
- Engineering: ✓
- Domain Model: ✓
- Backlog: LJP-001
- Screen contract: N/A | lesson.md
- Component contracts: [list]
- Memory: ✓
- Manifest: ✓

Ready to Plan: YES | NO (missing: …)
```

---

## Contract index

Full path map: [contracts/index.md](../contracts/index.md)
