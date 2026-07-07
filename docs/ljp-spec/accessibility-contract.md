# Accessibility Contract
## Learning Journey Platform — Behavioral specification

WCAG 2.1 AA minimum. This document specifies **behavior**, not just compliance labels.

---

## 1. Universal requirements

| Rule | Implementation |
|------|----------------|
| Keyboard accessible | All interactive elements focusable |
| Focus order | Matches visual order (DOM order) |
| Focus visible | `focus-visible:ring-2` on all controls |
| Touch target | Minimum 44×44px (`min-h-11 min-w-11`) |
| Color contrast | 4.5:1 body text, 3:1 large text/UI |
| Motion | `prefers-reduced-motion` honored (see motion-guidelines.md) |
| Landmarks | `nav`, `main`, `header`, `footer` where applicable |
| Headings | One `h1` per page; no level skips |

---

## 2. Navigation

| Element | A11y |
|---------|------|
| Bottom nav | `<nav aria-label="Learn">` |
| Active item | `aria-current="page"` |
| Top nav | Same pattern |
| Breadcrumb | `<nav aria-label="Breadcrumb">` + ordered list |

---

## 3. Lesson page

| Element | Behavior |
|---------|----------|
| Video | Native controls — keyboard operable |
| Part selector | `role="tablist"` or button group with `aria-current` |
| Transcript | `<details>` — native expand |
| Continue (sticky) | `aria-disabled` when not ready; not `disabled` hidden from AT if visible |
| Secondary actions | Ghost buttons — full text labels |

---

## 4. Trivia sheet (critical)

| Rule | Behavior |
|------|----------|
| Modal type | `role="dialog"` `aria-modal="true"` |
| Label | `aria-labelledby` → question text |
| Focus trap | **Required** while open |
| Escape | **Disabled** until answered (Law 8) |
| Overlay click | **Disabled** — does not dismiss |
| On open | Move focus to first option or question |
| On close | Return focus to video or Continue |

---

## 5. Module accordion

| Rule | Behavior |
|------|----------|
| Trigger | `aria-expanded` |
| Locked module | `aria-disabled="true"` |
| Lesson links | Descriptive text — include duration in accessible name optional |

---

## 6. Forms

| Form | Rules |
|------|-------|
| Reflection textarea | `<label>` or `aria-labelledby` |
| Search | `role="search"`, input `aria-label` |
| Errors | `aria-invalid` + `aria-describedby` to error text |

---

## 7. Dynamic content

| Event | Announcement |
|-------|--------------|
| Trivia feedback | `aria-live="polite"` region |
| Progress update (v2) | polite live region |
| Route change | Next.js title update sufficient |

---

## 8. Testing requirements

Per feature PR:

- [ ] Keyboard-only walkthrough documented in PR
- [ ] axe-core or Playwright a11y scan — zero critical violations
- [ ] Focus trap verified on trivia
- [ ] Reduced motion verified

---

## 9. Forbidden

```
❌ Icon-only buttons without aria-label
❌ Div onClick without role + keyboard handler
❌ Positive tabindex
❌ Auto-playing video with sound
❌ Color-only status (locked/unlocked)
❌ Dismiss trivia with Escape before answer
```

---

## 10. Tooling

| Tool | Use |
|------|-----|
| eslint-plugin-jsx-a11y | CI |
| @axe-core/playwright | E2E learn journeys |
| Manual | VoiceOver / NVDA spot check on lesson |
