# Contract Index
## ADOS → docs mapping

Do not duplicate contracts here. This index is the machine-readable manifest.

```yaml
contracts:
  vision:
    - docs/lms-architecture.md

  experience:
    - docs/lms-spec/experience-principles.md
    - docs/lms-spec/design-dna.md
    - docs/lms-spec/anti-patterns.md
    - docs/lms-spec/design-review-checklist.md

  product:
    - docs/product-architecture.md
    - docs/information-architecture.md
    - docs/user-journey.md
    - docs/navigation-laws.md
    - docs/layout-blueprints.md
    - docs/screen-inventory.md
    - docs/interaction-inventory.md

  screens:
    home: docs/screen-contracts/home.md
    catalogue: docs/screen-contracts/catalogue.md
    course_detail: docs/screen-contracts/course-detail.md
    module_overview: docs/screen-contracts/module-overview.md
    lesson: docs/screen-contracts/lesson.md
    progress: docs/screen-contracts/progress.md
    achievements: docs/screen-contracts/achievements.md
    profile: docs/screen-contracts/profile.md
    search: docs/screen-contracts/search.md

  components:
    video_player: docs/component-contracts/video-player.md
    course_hero: docs/component-contracts/course-hero.md
    module_card: docs/component-contracts/module-card.md
    lesson_card: docs/component-contracts/lesson-card.md
    progress_bar: docs/component-contracts/progress-ring.md
    trivia_popup: docs/component-contracts/trivia-popup.md
    continue_button: docs/component-contracts/continue-button.md
    resource_section: docs/component-contracts/resource-card.md
    certificate_card: docs/component-contracts/certificate-card.md
    achievement_badge: docs/component-contracts/achievement-badge.md
    course_card: docs/component-contracts/course-card.md
    lms_shell: docs/component-contracts/lms-shell.md
    reflection_card: docs/component-contracts/reflection-card.md

  engineering:
    - docs/ljp-spec/engineering-principles.md
    - docs/ljp-spec/frontend-architecture.md
    - docs/ljp-spec/component-evolution.md
    - docs/ljp-spec/state-management.md
    - docs/ljp-spec/data-flow.md
    - docs/ljp-spec/motion-guidelines.md
    - docs/ljp-spec/performance-budget.md
    - docs/ljp-spec/accessibility-contract.md
    - docs/ljp-spec/testing-strategy.md
    - docs/ljp-spec/domain-model.md
    - docs/ljp-spec/state-machines.md
    - docs/ljp-spec/events.md
    - docs/ljp-spec/error-handling.md
    - docs/ljp-spec/implementation-roadmap.md
    - docs/ljp-spec/definition-of-done.md
    - docs/ljp-spec/decision-log.md

  verification:
    - docs/ui-acceptance-questionnaire.md
    - docs/architecture-review-board.md
    - docs/lms-ui-audit.md

  tokens:
    - src/constants/lms-design-tokens.ts
    - src/styles/lms.css
```

---

## Resolve contract for backlog item

```ts
// Pseudocode for agents
function resolveContracts(item: BacklogItem) {
  return {
    screen: item.contracts.screen ? contracts.screens[item.contracts.screen] : null,
    components: item.contracts.components.map(c => contracts.components[c]),
    blueprint: `docs/layout-blueprints.md#blueprint-${item.blueprint}`,
  };
}
```
