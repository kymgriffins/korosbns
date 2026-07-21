# Agent Memory
## Implemented inventory + contract bindings (`implements[]`)

Update after each sub-capability or capability complete. Status: `draft` | `done` | `deprecated`.

**Drift:** compare `implements` to `spec/contracts/versions.yaml` — see `runtime/drift.md`.

---

## Binding template

```yaml
ComponentName:
  path: src/...
  status: draft | done
  implements:
    - contract-id@semver
  drift: none | detected
```

## Infrastructure

| Component | Path | Version | Status | Depends on | Known limitations |
|-----------|------|---------|--------|------------|-------------------|
| LmsDesignTokens | `src/constants/lms-design-tokens.ts` | 1.0 | `done` | — | Tokens defined; not fully adopted in draft UI |
| lms.css | `src/styles/lms.css` | 1.0 | `done` | tokens | learn-root scoped |
| LmsProviders | `src/components/lms/providers/lms-providers.tsx` | 1.0 | `done` | — | MotionConfig |
| LmsErrorBoundary | `src/components/lms/providers/lms-error-boundary.tsx` | 1.0 | `done` | — | Class boundary |
| Shell types | `src/components/lms/shell/types.ts` | 1.0 | `draft` | — | `resolveShellMode` exists |
| lesson-state | `src/data/lms/lesson-state.ts` | 1.0 | `draft` | types | Reducer exists; not wired to UI |
| events | `src/data/lms/events.ts` | 1.0 | `draft` | — | Dev emitter only |
| catalog | `src/data/lms/catalog.ts` | 1.0 | `done` | types | Static catalog |
| helpers | `src/data/lms/helpers.ts` | 1.0 | `done` | catalog | 6 tests passing |

---

## Shell (LJP-001 — done)

| Component | Path | Version | Status | implements | drift |
|-----------|------|---------|--------|------------|-------|
| LearningShell | `shell/learning-shell.tsx` | 1.0 | `done` | lms-shell@1.0.0 | none |
| LmsTopNav | `shell/lms-top-nav.tsx` | 1.0 | `done` | lms-shell@1.0.0 | none |
| LmsBottomNav | `shell/lms-bottom-nav.tsx` | 1.0 | `done` | lms-shell@1.0.0 | none |
| LmsPage | `shell/lms-page.tsx` | 1.0 | `done` | lms-shell@1.0.0 | none |
| LmsToastLayer | `shell/lms-toast-layer.tsx` | 1.0 | `done` | lms-shell@1.0.0 | none |
| LmsDialogLayer | `shell/lms-dialog-layer.tsx` | 1.0 | `done` | lms-shell@1.0.0 | none |
| LmsBottomSheetLayer | `shell/lms-bottom-sheet-layer.tsx` | 1.0 | `done` | lms-shell@1.0.0 | none |
| LmsProviders | `providers/lms-providers.tsx` | 1.0 | `done` | lms-shell@1.0.0 | none |
| LmsErrorBoundary | `providers/lms-error-boundary.tsx` | 1.0 | `done` | error-handling@1.0.0 | none |

Legacy re-exports: `lms-shell.tsx`, `lms-nav.tsx`, `lms-page.tsx` → shell/

---

## Learning Experience (LJP-003 — done, uncommitted)

| Component | Path | Version | Status | implements | drift |
|-----------|------|---------|--------|------------|-------|
| LearningExperience | `lesson/learning-experience.tsx` | 1.0 | `done` | lesson-journey@1.0.0 | none |
| VideoPlayer | `lesson/video-player.tsx` | 1.0 | `done` | video_player@1.0.0 | none |
| TriviaSheet | `lesson/trivia-sheet.tsx` | 1.0 | `done` | trivia_popup@1.0.0 | none |
| ContinueButton | `lesson/continue-button.tsx` | 1.0 | `done` | continue_button@1.0.0 | none |
| ReflectionPanel | `lesson/reflection-panel.tsx` | 1.0 | `done` | lesson-screen@1.0.0 | none |
| deriveLessonExperience | `lib/learning-runtime/experience.ts` | 1.0 | `done` | lesson-journey@1.0.0 | none |
| journey-effects | `lib/learning-runtime/journey-effects.ts` | 1.0 | `done` | lesson-journey@1.0.0 | none |

---

## Feature components (legacy draft — superseded by LJP-003)

| Component | Path | Version | Status | Contract | Violations |
|-----------|------|---------|--------|----------|------------|
| LessonExperience | `src/components/lms/lesson-experience.tsx` | 0.5 | `draft` | lesson.md | Footer CTA, trivia dismiss |
| VideoExperience | `src/components/lms/video-experience.tsx` | 0.5 | `draft` | video-player.md | — |
| TriviaSheet | `src/components/lms/trivia-sheet.tsx` | 0.5 | `draft` | trivia-popup.md | Dismissible (Law 8) |
| LessonFooter | `src/components/lms/lesson-footer.tsx` | 0.5 | `draft` | continue-button.md | Not sticky; Law 13 |
| CourseCard | `src/components/lms/course-card.tsx` | 0.7 | `draft` | course-card.md | Minor spacing |
| ModuleCard | `src/components/lms/module-card.tsx` | 0.7 | `draft` | module-card.md | No accordion group |
| ProgressBar | `src/components/lms/progress-bar.tsx` | 0.7 | `draft` | progress-ring.md | Linear not ring |
| AchievementCard | `src/components/lms/achievement-card.tsx` | 0.7 | `draft` | achievement-badge.md | — |
| ReflectionCard | `src/components/lms/reflection-card.tsx` | 0.5 | `draft` | reflection-card.md | — |
| ResourcesSection | `src/components/lms/resources-section.tsx` | 0.5 | `draft` | resource-card.md | — |
| LessonHero | `src/components/lms/lesson-hero.tsx` | 0.5 | `draft` | — | May not match Blueprint D |

**Missing (per contracts):** ContinueButton, CourseHero, VideoPlayer (contract-named), LmsBottomSheetLayer.

---

## Routes (draft)

| Route | Path | Status | Backlog |
|-------|------|--------|---------|
| Learn home | `src/app/(marketing)/learn/page.tsx` | `draft` | LJP-005 |
| Catalogue | `.../catalogue/page.tsx` | `draft` | LJP-006 |
| Course detail | `.../courses/[courseSlug]/page.tsx` | `draft` | LJP-004 |
| Lesson | `.../lessons/[lessonSlug]/page.tsx` | `done` | LJP-003 |
| Progress | `.../progress/page.tsx` | `draft` | LJP-007 |
| Achievements | `.../achievements/page.tsx` | `draft` | LJP-008 |
| Profile | `.../profile/page.tsx` | `draft` | LJP-009 |
| Search | `.../search/page.tsx` | `draft` | LJP-010 |

---

## Spec layer

| Deliverable | Path | Version | Status |
|-------------|------|---------|--------|
| LJP reference architecture | `docs/` (60 files) | 1.0 | `done` |
| ADOS | `agent/` | 1.0 | `done` |
| UI audit Phase 2 | `docs/lms-ui-audit.md` | 1.0 | `FAIL` |

---

## Update protocol

After backlog item completes:

```yaml
- name: ComponentName
  path: src/...
  version: 1.1
  status: done
  depends_on: [Button, Badge]
  known_limitations: none
  future_work: animation improvements
  backlog: LJP-XXX
  completed: YYYY-MM-DD
```
