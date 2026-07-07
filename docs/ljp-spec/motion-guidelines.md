# Motion Guidelines
## Learning Journey Platform — Engineering specification

Design intent lives in `../lms-spec/design-dna.md`. This document is **implementable** — every animation has measurable parameters.

**Library:** `motion/react` (import from `motion/react`, not `framer-motion`).

**Shared variants:** `src/motion/variants.ts`  
**Tokens:** `src/constants/lms-design-tokens.ts` → `LMS_MOTION`

---

## 1. Global rules

| Rule | Value |
|------|-------|
| UI transition duration | 150–250ms |
| Sheet / overlay | Spring (damping 28, stiffness 320) |
| Decorative animation | **Forbidden** |
| `prefers-reduced-motion` | **Required** — use `useReducedMotion()` |
| Interruptible | Yes for accordions; trivia sheet completes or answers |
| GPU-friendly props | `transform`, `opacity` — avoid animating `width` where possible |

---

## 2. Animation catalog

### Accordion — module expand

| Field | Value |
|-------|-------|
| **Purpose** | Reveal lesson list in place (Law 4) |
| **Trigger** | `Collapsible` open |
| **Duration** | 200ms |
| **Easing** | Spring via Motion height OR CSS `duration-200` |
| **Interruptible** | Yes |
| **Reduced motion** | Instant expand, no height animation |
| **Component** | `ModuleCard` |
| **Implementation** | `motion.ul` height 0 → auto OR Radix Collapsible + CSS |

### Trivia bottom sheet

| Field | Value |
|-------|-------|
| **Purpose** | Challenge overlay without navigation |
| **Trigger** | `onPartEnd` when trivia exists |
| **Enter** | `y: 100%` → `0`, spring |
| **Exit** | `y: 0` → `100%` |
| **Backdrop** | Opacity 0 → 1, 150ms |
| **Interruptible** | **No** until answered (Law 8) |
| **Reduced motion** | Instant appear, no slide |
| **Component** | `TriviaPopup` |
| **Focus** | Trap focus in sheet |

### Continue button appear

| Field | Value |
|-------|-------|
| **Purpose** | Signal forward action earned |
| **Trigger** | `continueEnabled` true |
| **Duration** | 150ms fade + translateY 8px → 0 |
| **Easing** | ease-out |
| **Reduced motion** | Instant visible |
| **Component** | `ContinueButton` |

### Card hover

| Field | Value |
|-------|-------|
| **Purpose** | Affordance on tappable cards |
| **Trigger** | `:hover` / `whileHover` |
| **Scale** | 1.02 |
| **Shadow** | shadow-sm → shadow-md |
| **Duration** | 200ms |
| **Reduced motion** | No scale — border color only |
| **Components** | `CourseCard`, module rows |

### Button press

| Field | Value |
|-------|-------|
| **Purpose** | Tactile feedback |
| **Trigger** | `:active` / `whileTap` |
| **Scale** | 0.98 |
| **Duration** | 100ms |
| **Reduced motion** | No scale |

### Page enter (marketing layout)

| Field | Value |
|-------|-------|
| **Purpose** | Hub transition polish |
| **Note** | Learn routes use `contents` in marketing layout — minimal page enter |
| **Duration** | 200ms opacity |
| **Reduced motion** | Skip blur + y transform |

### Progress bar fill

| Field | Value |
|-------|-------|
| **Purpose** | Milestone feedback |
| **Duration** | 300ms |
| **Easing** | ease-out |
| **Reduced motion** | Instant width |

### Achievement unlock (v2)

| Field | Value |
|-------|-------|
| **Purpose** | Pride moment |
| **Duration** | 400ms (celebration exception) |
| **Effect** | Confetti once + scale 1.05 → 1 |
| **Reduced motion** | Text announcement only |

---

## 3. Implementation pattern

```tsx
import { motion, useReducedMotion } from "motion/react";
import { LMS_MOTION } from "@/constants/lms-design-tokens";

const prefersReducedMotion = useReducedMotion();

<motion.div
  initial={prefersReducedMotion ? false : { y: "100%" }}
  animate={{ y: 0 }}
  transition={prefersReducedMotion ? { duration: 0 } : LMS_MOTION.spring}
/>
```

---

## 4. Lazy loading motion

- Do not import Motion in Server Components
- Dynamic import trivia sheet if bundle size issue: `next/dynamic` with `ssr: false` only if measured violation

---

## 5. PR checklist (motion)

- [ ] Duration ≤ 250ms (except achievement v2)
- [ ] `useReducedMotion` handled
- [ ] Purpose documented in component contract
- [ ] No animation on initial list render (> 6 items)
