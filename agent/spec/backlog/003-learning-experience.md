# LJP-003 — Learning Experience

```yaml
id: LJP-003
capability: learning-experience
title: Learning Experience
priority: P0
approval_required: true
blueprint: D
estimated_complexity: 9/10
node: LearningExperience

depends_on_capabilities:
  - learning-shell
  - learning-runtime

contracts:
  journey: lesson-journey@1.0.0
  screen: lesson-screen@1.0.0
  components:
    - video_player@1.0.0
    - trivia_popup@1.0.0
    - continue_button@1.0.0

emotion: Focus
acceptance:
  - lesson_journey_complete
  - runtime_definition_of_done
  - ui_questionnaire
  - design_review_checklist

files_expected:
  - src/components/lms/lesson/learning-experience.tsx
  - src/components/lms/lesson/video-player.tsx
  - src/components/lms/lesson/trivia-sheet.tsx
  - src/components/lms/lesson/continue-button.tsx
  - src/lib/learning-runtime/__tests__/lesson-journey.test.ts
```

## Builder goal

Demonstrate the architecture delivers one complete learning journey without violating any specification.

## Done when

Canonical journey test passes + evidence review. See `journey-contracts/lesson-journey.md`.
