# Decision Log
## Learning Journey Platform — Architectural decisions

Record **why**, not just **what**. New entries at top. Required when introducing patterns not covered by existing specs.

---

## Template

```md
### Decision #NNN — Title

**Date:** YYYY-MM-DD  
**Status:** Accepted | Superseded | Proposed

**Context:**  
What problem?

**Decision:**  
What we chose.

**Reason:**  
Why.

**Alternatives considered:**  
What we rejected.

**Rejected because:**  
Why.

**Consequences:**  
Tradeoffs, follow-up work.
```

---

### Decision #013 — Shell-first implementation order

**Date:** 2026-07-07  
**Status:** Accepted

**Decision:** Implement Learning Shell before Lesson screen.

**Reason:** Shell provides nav, overlays, tokens, a11y — every screen depends on it.

**Consequences:** Existing draft Lesson UI refactored onto shell in Phase B/C.

---

### Decision #014 — Domain model + state machines as specs

**Date:** 2026-07-07  
**Status:** Accepted

**Decision:** Add `domain-model.md`, `state-machines.md`, `events.md`, `error-handling.md`.

**Reason:** UI contracts insufficient for behavioral consistency across agents.

---

### Decision #012 — Engineering spec layer before implementation commit

**Date:** 2026-07-07  
**Status:** Accepted

**Context:**  
Design specs complete but agents could still diverge on folder structure, state, testing.

**Decision:**  
Add `docs/ljp-spec/` engineering architecture. Block implementation commit until Definition of Done exists.

**Reason:**  
Engineering drift is the next risk after design drift.

**Alternatives considered:**  
Start P0 UI fixes immediately.

**Rejected because:**  
Cosmetic fixes without engineering contracts cause rework.

**Consequences:**  
Longer spec phase; predictable implementation.

---

### Decision #011 — Product name: Learning Journey Platform

**Date:** 2026-07-07  
**Status:** Accepted

**Context:**  
"LMS" in specs encouraged Moodle-style dashboards.

**Decision:**  
Internal name **Learning Journey Platform**; URLs remain `/learn/*`.

**Reason:**  
Language shapes implementation decisions.

**Alternatives considered:**  
LXP, Learning Studio.

**Rejected because:**  
LJP clearest for civic journey metaphor.

---

### Decision #010 — Black primary CTAs

**Date:** 2026-07-07  
**Status:** Accepted

**Context:**  
Site default primary is blue (`--primary: hsl(214 100% 50%)`).

**Decision:**  
Learn feature uses black/near-black CTA via scoped tokens (`LMS_COLORS.cta`).

**Reason:**  
Reduce visual competition; premium aesthetic per Design DNA.

**Alternatives considered:**  
Brand blue buttons.

**Rejected because:**  
Introduces unnecessary emphasis; weakens content-first hierarchy.

**Consequences:**  
Scoped override in learn shell or `lms.css`; not global theme change.

---

### Decision #009 — Static catalog before API

**Date:** 2026-07-07  
**Status:** Accepted

**Context:**  
Learn rebuild needs UI velocity; API endpoints not ready.

**Decision:**  
`src/data/lms/catalog.ts` as source of truth; RSC props; TanStack Query deferred.

**Reason:**  
Unblocks contract-driven UI; types stable for API migration.

**Alternatives considered:**  
Block until Django learn API exists.

**Rejected because:**  
Spec validation shouldn't wait on backend.

**Consequences:**  
Progress/enrollment mocked; migrate via `data-flow.md` API phase.

---

### Decision #008 — Lesson hides bottom navigation

**Date:** 2026-07-07  
**Status:** Accepted

**Context:**  
Hub nav competes with Continue on lesson screen.

**Decision:**  
`LmsShell` immersive mode — no bottom nav on lesson routes (Law 12).

**Reason:**  
Focus emotion; cognitive load budget.

**Alternatives considered:**  
Persistent bottom nav everywhere.

**Rejected because:**  
Violates lesson page budget (max 2 decisions).

---

### Decision #007 — Trivia cannot dismiss without answer

**Date:** 2026-07-07  
**Status:** Accepted

**Context:**  
Overlay click closed trivia in draft implementation.

**Decision:**  
No backdrop dismiss; no Escape; focus trap until answered (Law 8).

**Reason:**  
Checkpoint integrity; anti-pattern "skip learning."

**Alternatives considered:**  
Skippable trivia.

**Rejected because:**  
Breaks challenge → reward emotional arc.

---

### Decision #006 — Modules accordion on course page

**Date:** 2026-07-07  
**Status:** Accepted

**Context:**  
Need curriculum without sidebar.

**Decision:**  
Expandable `ModuleCard` in place; one open at a time; collapsed default.

**Reason:**  
Progressive disclosure (Law 4, 5).

**Alternatives considered:**  
Permanent sidebar tree; separate module list page only.

**Rejected because:**  
Sidebar forbidden; separate-only adds taps.

---

### Decision #005 — Server Components default for learn pages

**Date:** 2026-07-07  
**Status:** Accepted

**Context:**  
Next.js App Router; performance budget.

**Decision:**  
Pages are RSC; single client island per interactive screen.

**Reason:**  
Smaller JS; aligns with engineering principles E5–E6.

**Alternatives considered:**  
Full client pages like old learn hub.

**Rejected because:**  
Hydration cost; engineering drift.

---

### Decision #004 — No desktop sidebar

**Date:** 2026-07-07  
**Status:** Accepted

**Context:**  
Traditional LMS use left curriculum sidebar.

**Decision:**  
Sticky top nav (desktop) + bottom nav (mobile) only.

**Reason:**  
Content-first experience; video needs horizontal space.

**Alternatives considered:**  
Persistent left sidebar.

**Rejected because:**  
Reduced lesson focus; increased cognitive load.

---

### Decision #003 — Feature folder `components/lms`

**Date:** 2026-07-07  
**Status:** Accepted

**Context:**  
Deleted `components/learn/` entirely; need new home.

**Decision:**  
`src/components/lms/` for Learning Journey UI; no resurrection of `learn/`.

**Reason:**  
Clean break from old hub; `lms` path stable in URLs/docs.

**Alternatives considered:**  
`components/learn/` again.

**Rejected because:**  
Agents might copy old patterns.

---

### Decision #002 — Real routes instead of hub tabs

**Date:** 2026-07-07  
**Status:** Accepted

**Context:**  
Old learn used `?tab=modules` on single `/learn` route.

**Decision:**  
Each hub is real route (`/learn/progress`, etc.).

**Reason:**  
SEO, shareability, IA clarity.

**Alternatives considered:**  
Query-param tabs.

**Rejected because:**  
Anti-pattern in IA doc; breaks deep linking.

---

### Decision #001 — Brutal rebuild of /learn

**Date:** 2026-07-07  
**Status:** Accepted

**Context:**  
Legacy learn hub was document/forum/dashboard hybrid.

**Decision:**  
Delete all `/learn` and `components/learn`; rebuild from `lms-architecture.md`.

**Reason:**  
Cannot evolve old UX into content-first journey.

**Alternatives considered:**  
Incremental refactor.

**Rejected because:**  
Patterns contaminate new work.

**Consequences:**  
Account routes restored separately; `/learnhub` demo legacy.
