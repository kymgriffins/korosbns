# Component Inventory
## LMS — Reusable UI building blocks

Every component must have a **Component Contract** before implementation or refactor is accepted.

---

## Shell & navigation

| Component | Contract | Implemented | Path |
|-----------|----------|-------------|------|
| LMS Shell | `lms-shell.md` | ✅ | `lms-shell.tsx`, `lms-nav.tsx` |
| LMS Page wrapper | — (layout primitive) | ✅ | `lms-page.tsx` |

---

## Discovery

| Component | Contract | Implemented | Path |
|-----------|----------|-------------|------|
| Course Card | `course-card.md` | ✅ | `course-card.tsx` |
| Course Hero | `course-hero.md` | ⚠️ Inline in page | Extract to `course-hero.tsx` |

---

## Curriculum

| Component | Contract | Implemented | Path |
|-----------|----------|-------------|------|
| Module Card | `module-card.md` | ⚠️ Partial | `module-card.tsx` — needs accordion group |
| Lesson Card | `lesson-card.md` | ⚠️ Inline in module | Extract to `lesson-card.tsx` |

---

## Learning loop

| Component | Contract | Implemented | Path |
|-----------|----------|-------------|------|
| Video Player | `video-player.md` | ✅ | `video-experience.tsx` |
| Trivia Popup | `trivia-popup.md` | ⚠️ Partial | `trivia-sheet.tsx` — overlay dismiss bug |
| Reflection Card | `reflection-card.md` | ✅ | `reflection-card.tsx` |
| Continue Button | `continue-button.md` | ❌ | Not extracted — footer competes |
| Resource Section | `resource-card.md` | ✅ | `resources-section.tsx` |
| Lesson Header | — | ✅ | `lesson-hero.tsx` |
| Lesson Footer | — | ⚠️ | `lesson-footer.tsx` — violates Law 13 |

---

## Progress & motivation

| Component | Contract | Implemented | Path |
|-----------|----------|-------------|------|
| Progress Bar | `progress-ring.md` | ✅ | `progress-bar.tsx` |
| Achievement Badge | `achievement-badge.md` | ✅ | `achievement-card.tsx` |
| Certificate Card | `certificate-card.md` | ❌ v2 | — |

---

## Implementation gap summary

| Priority | Gap | Contract | Law |
|----------|-----|----------|-----|
| P0 | Extract `ContinueButton`, sticky on lesson | `continue-button.md` | 9, 10, 13 |
| P0 | Accordion group on course page | `module-card.md` | 5 |
| P0 | Trivia no dismiss | `trivia-popup.md` | 8 |
| P1 | Extract `CourseHero` 60/40 | `course-hero.md` | Blueprint B |
| P1 | Extract `LessonCard` | `lesson-card.md` | — |
| P1 | Demote `LessonFooter` to ghost row | `continue-button.md` | 13 |
| P2 | `CertificateCard` | `certificate-card.md` | — |

**Implementation is blocked until architecture review passes for each gap.**
